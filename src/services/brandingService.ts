import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage, cleanFirestoreData } from './firebase';
import { erpService } from './erpService';

export const DEFAULT_INSTITUTION_ID = 'victory-international';

/**
 * Returns a stable, sanitized institution/tenant identifier.
 */
export function getInstitutionId(customSettings?: { institutionId?: string; institutionName?: string }): string {
  if (customSettings?.institutionId && customSettings.institutionId.trim()) {
    return customSettings.institutionId.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
  }
  const sys = erpService.getSettings();
  if (sys?.institutionId && sys.institutionId.trim()) {
    return sys.institutionId.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
  }
  return DEFAULT_INSTITUTION_ID;
}

export interface InstitutionWebsiteSettingsDoc {
  institutionId: string;
  logoUrl: string | null;
  updatedAt?: any;
  [key: string]: any;
}

/**
 * Optimizes an uploaded logo/emblem image file for web display and Firestore persistence.
 * Resizes large images to max 480x480 maintaining aspect ratio with smooth rendering and
 * full alpha transparency preservation, resulting in a compact (~20-45KB) base64 string
 * that easily fits within Firestore's 1MB document limit and renders instantly across all devices.
 */
export async function optimizeLogoFile(file: File, maxDimension = 480): Promise<string> {
  // If SVG, read as clean data URL directly
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Export as PNG with high fidelity transparency
        const optimizedUrl = canvas.toDataURL('image/png', 0.9);
        resolve(optimizedUrl);
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const brandingService = {
  /**
   * Fetches the institution's website/branding document from Firestore.
   * Path: institutions/{institutionId}/settings/website
   */
  async fetchInstitutionWebsiteSettings(institutionId?: string): Promise<InstitutionWebsiteSettingsDoc | null> {
    const instId = institutionId || getInstitutionId();
    if (!db) {
      console.warn('Firestore is not initialized');
      return null;
    }

    try {
      // Primary tenant-isolated path with timeout to avoid stalling on slow/offline connections
      const tenantDocRef = doc(db, 'institutions', instId, 'settings', 'website');
      const tenantSnap = await Promise.race([
        getDoc(tenantDocRef),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Firestore fetch timeout')), 4000)
        )
      ]);

      if (tenantSnap && tenantSnap.exists()) {
        const data = tenantSnap.data() as InstitutionWebsiteSettingsDoc;
        // Sync into local ERP memory and storage if logoUrl exists
        if (data.logoUrl !== undefined) {
          this.syncLocalLogoState(data.logoUrl || '');
        }
        return data;
      }

      // Fallback: check general websiteSettings/public-config
      try {
        const publicDocRef = doc(db, 'websiteSettings', 'public-config');
        const publicSnap = await getDoc(publicDocRef);
        if (publicSnap.exists()) {
          const publicData = publicSnap.data();
          const fallbackLogoUrl = publicData.branding?.logoUrl || null;
          if (fallbackLogoUrl) {
            // Backport to tenant path so subsequent reads hit the tenant document directly
            await this.saveInstitutionLogo(instId, fallbackLogoUrl);
            return {
              institutionId: instId,
              logoUrl: fallbackLogoUrl
            };
          }
        }
      } catch (fallbackErr) {
        // Non-critical fallback error
      }

      return null;
    } catch (err: any) {
      if (err?.code === 'unavailable' || err?.message?.includes('timeout') || err?.message?.includes('offline')) {
        console.warn('Firestore temporarily offline or unavailable. Operating in local mode.');
      } else {
        console.warn('Could not fetch institution website settings from Firestore:', err);
      }
      return null;
    }
  },

  /**
   * Uploads or persists the logo:
   * First generates a high-definition, transparent-optimized logo data payload.
   * Tries Firebase Storage with a strict 2-second timeout (if configured and bucket accessible).
   * If Storage is not enabled or times out, immediately persists the optimized logo to Firestore
   * and local ERP state so uploads NEVER hang, spin indefinitely, or fail.
   */
  async uploadInstitutionLogo(file: File, institutionId?: string): Promise<string> {
    const instId = institutionId || getInstitutionId();

    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload a valid image file (PNG, JPG, SVG, WebP).');
    }

    // 1. Optimize image client-side to ensure instant performance & fit under Firestore limits
    const optimizedLogoUrl = await optimizeLogoFile(file);
    let finalLogoUrl = optimizedLogoUrl;

    // 2. Try Firebase Storage with a strict 2-second timeout ONLY if available
    if (storage) {
      try {
        const storageRef = ref(storage, `institutions/${instId}/branding/logo`);
        const metadata = {
          contentType: file.type,
          customMetadata: {
            institutionId: instId,
            uploadedAt: new Date().toISOString()
          }
        };

        const uploadTask = uploadBytes(storageRef, file, metadata)
          .then((snapshot) => getDownloadURL(snapshot.ref));

        const timeoutTask = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Storage upload timeout')), 2000)
        );

        const storageDownloadUrl = await Promise.race([uploadTask, timeoutTask]);
        if (storageDownloadUrl) {
          finalLogoUrl = storageDownloadUrl;
        }
      } catch (storageErr) {
        // Gracefully fall back to the optimized logo URL without stalling the user
        console.info('Firebase Storage unavailable or bucket not found, persisting directly via Firestore:', storageErr);
      }
    }

    // 3. Persist to Firestore and synchronise throughout all navigation bars & ERP views
    await this.saveInstitutionLogo(instId, finalLogoUrl);

    return finalLogoUrl;
  },

  /**
   * Saves the logo URL (Storage URL, data URL, or external URL) to Firestore.
   * Path: institutions/{institutionId}/settings/website
   */
  async saveInstitutionLogo(institutionId: string, logoUrl: string | null): Promise<void> {
    const instId = institutionId || getInstitutionId();

    // 1. Immediately update local ERP service state so UI updates with zero delay
    this.syncLocalLogoState(logoUrl || '');

    if (!db) {
      console.warn('Firestore is not initialized; saved in local state.');
      return;
    }

    try {
      const tenantDocRef = doc(db, 'institutions', instId, 'settings', 'website');
      const payload = cleanFirestoreData({
        institutionId: instId,
        logoUrl: logoUrl || null,
        updatedAt: serverTimestamp()
      });

      // Write to tenant path with timeout to prevent hanging on offline/unreachable networks
      const setTenantPromise = setDoc(tenantDocRef, payload, { merge: true });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore write timeout')), 3500)
      );
      await Promise.race([setTenantPromise, timeoutPromise]);

      // 2. Also synchronize to general collections for app-wide compatibility
      try {
        const publicDocRef = doc(db, 'websiteSettings', 'public-config');
        await setDoc(publicDocRef, cleanFirestoreData({
          branding: {
            logoUrl: logoUrl || ''
          },
          _firestoreSyncedAt: new Date().toISOString()
        }), { merge: true });

        const sysDocRef = doc(db, 'settings', 'institution-settings');
        await setDoc(sysDocRef, cleanFirestoreData({
          logoUrl: logoUrl || '',
          _firestoreSyncedAt: new Date().toISOString()
        }), { merge: true });
      } catch (syncErr) {
        console.warn('Note on secondary collection sync:', syncErr);
      }
    } catch (err: any) {
      console.warn('Firestore write warning (data retained in local ERP storage):', err?.message || err);
    }
  },

  /**
   * Validates and saves an external or uploaded logo URL to Firestore.
   */
  async saveExternalLogoUrl(rawUrl: string, institutionId?: string): Promise<string> {
    const instId = institutionId || getInstitutionId();
    const trimmed = rawUrl.trim();

    if (!trimmed) {
      throw new Error('Please provide an image URL.');
    }

    if (!trimmed.startsWith('data:image/')) {
      try {
        const parsed = new URL(trimmed);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          throw new Error('URL must start with http:// or https://');
        }
      } catch {
        throw new Error('Invalid URL format. Please enter a valid http:// or https:// image link.');
      }
    }

    await this.saveInstitutionLogo(instId, trimmed);
    return trimmed;
  },

  /**
   * Removes the logo from Firestore:
   * sets logoUrl to null in institutions/{institutionId}/settings/website
   */
  async removeInstitutionLogo(institutionId?: string): Promise<void> {
    const instId = institutionId || getInstitutionId();
    await this.saveInstitutionLogo(instId, null);
  },

  /**
   * Synchronizes the logo URL into local ERP service state
   * so all navigation bars, sidebars, and print layouts update instantly.
   */
  syncLocalLogoState(logoUrl: string) {
    try {
      const sanitizedUrl = logoUrl || '';

      // Update website settings
      const webSettings = erpService.getWebsiteSettings();
      if (webSettings.branding.logoUrl !== sanitizedUrl) {
        webSettings.branding.logoUrl = sanitizedUrl;
        erpService.saveWebsiteSettings(webSettings);
      }

      // Update system settings
      const sysSettings = erpService.getSettings();
      if (sysSettings.logoUrl !== sanitizedUrl) {
        sysSettings.logoUrl = sanitizedUrl;
        erpService.updateSettings(sysSettings);
      }
    } catch (err) {
      console.warn('Could not sync local ERP logo state:', err);
    }
  }
};
