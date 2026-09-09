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
   * Uploads the logo file to Firebase Storage using a stable tenant path:
   * institutions/{institutionId}/branding/logo
   * 
   * Then immediately persists the Storage download URL to Firestore:
   * institutions/{institutionId}/settings/website
   */
  async uploadInstitutionLogo(file: File, institutionId?: string): Promise<string> {
    const instId = institutionId || getInstitutionId();

    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload a valid image file (PNG, JPG, SVG, WebP).');
    }

    if (!storage) {
      throw new Error('Firebase Storage is not initialized. Please verify configuration.');
    }

    // Stable path: institutions/{institutionId}/branding/logo
    const storageRef = ref(storage, `institutions/${instId}/branding/logo`);

    // Set appropriate metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        institutionId: instId,
        uploadedAt: new Date().toISOString()
      }
    };

    // Upload to Firebase Storage
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    if (!downloadUrl) {
      throw new Error('Failed to retrieve download URL from Firebase Storage.');
    }

    // Save Storage URL to Firestore immediately
    await this.saveInstitutionLogo(instId, downloadUrl);

    return downloadUrl;
  },

  /**
   * Saves the logo URL (Storage URL or external URL) to Firestore.
   * Path: institutions/{institutionId}/settings/website
   */
  async saveInstitutionLogo(institutionId: string, logoUrl: string | null): Promise<void> {
    const instId = institutionId || getInstitutionId();
    if (!db) {
      throw new Error('Firestore is not initialized.');
    }

    const tenantDocRef = doc(db, 'institutions', instId, 'settings', 'website');
    const payload = cleanFirestoreData({
      institutionId: instId,
      logoUrl: logoUrl || null,
      updatedAt: serverTimestamp()
    });

    // 1. Write to tenant path: institutions/{institutionId}/settings/website
    await setDoc(tenantDocRef, payload, { merge: true });

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

    // 3. Update local ERP service state
    this.syncLocalLogoState(logoUrl || '');
  },

  /**
   * Validates and saves an external logo URL to Firestore.
   */
  async saveExternalLogoUrl(rawUrl: string, institutionId?: string): Promise<string> {
    const instId = institutionId || getInstitutionId();
    const trimmed = rawUrl.trim();

    if (!trimmed) {
      throw new Error('Please provide an image URL.');
    }

    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error('URL must start with http:// or https://');
      }
    } catch {
      throw new Error('Invalid URL format. Please enter a valid http:// or https:// image link.');
    }

    // Do NOT allow data: or base64 URLs
    if (trimmed.startsWith('data:')) {
      throw new Error('Base64 URLs cannot be saved as permanent logo. Please upload the image file directly.');
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
      // Avoid saving Base64 strings to local storage
      const sanitizedUrl = logoUrl.startsWith('data:') ? '' : logoUrl;

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
