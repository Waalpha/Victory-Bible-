import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc,
  getDocs, 
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';
import { db, firebaseConfig, cleanFirestoreData } from './firebase';
import { erpService, onErpDataChanged } from './erpService';
import { authService } from './authService';

export interface SyncActivityItem {
  id: string;
  time: string;
  text: string;
  success: boolean;
}

export interface SyncProgress {
  status: 'idle' | 'in_progress' | 'success' | 'error';
  totalCollections: number;
  completedCollections: number;
  totalDocuments: number;
  message: string;
  lastSyncedAt: string | null;
  errorDetails?: string;
  collectionCounts: Record<string, number>;
  autoSyncEnabled: boolean;
  isAutoSyncing: boolean;
  syncMode?: 'auto' | 'manual';
  recentActivity: SyncActivityItem[];
}

const STORAGE_LAST_SYNC_KEY = 'theo_erp_last_firestore_sync';
const STORAGE_AUTO_SYNC_KEY = 'theo_erp_auto_sync_enabled';
const STORAGE_INITIAL_BOOT_SYNC_KEY = 'theo_erp_has_initial_firestore_synced';

class FirestoreSyncService {
  private progressListeners: ((progress: SyncProgress) => void)[] = [];
  private autoSyncEnabled: boolean = localStorage.getItem(STORAGE_AUTO_SYNC_KEY) !== 'false';
  private isAutoSyncing: boolean = false;
  private recentActivity: SyncActivityItem[] = [];
  private debounceTimer: any = null;
  private intervalTimer: any = null;
  private pendingCollections: Set<string> = new Set();
  private isInitialized: boolean = false;

  private currentProgress: SyncProgress = {
    status: 'idle',
    totalCollections: 0,
    completedCollections: 0,
    totalDocuments: 0,
    message: 'Firestore Auto-Sync active',
    lastSyncedAt: localStorage.getItem(STORAGE_LAST_SYNC_KEY) || null,
    collectionCounts: {},
    autoSyncEnabled: localStorage.getItem(STORAGE_AUTO_SYNC_KEY) !== 'false',
    isAutoSyncing: false,
    syncMode: 'auto',
    recentActivity: []
  };

  constructor() {
    // Load initial activity if available
    const lastSync = localStorage.getItem(STORAGE_LAST_SYNC_KEY);
    if (lastSync) {
      this.recentActivity.push({
        id: 'init-1',
        time: lastSync,
        text: 'Initial cloud connection established',
        success: true
      });
    }
    this.currentProgress.recentActivity = [...this.recentActivity];
  }

  public getProgress(): SyncProgress {
    return { 
      ...this.currentProgress,
      autoSyncEnabled: this.autoSyncEnabled,
      isAutoSyncing: this.isAutoSyncing,
      recentActivity: [...this.recentActivity]
    };
  }

  public subscribe(listener: (progress: SyncProgress) => void): () => void {
    this.progressListeners.push(listener);
    listener(this.getProgress());
    return () => {
      this.progressListeners = this.progressListeners.filter(l => l !== listener);
    };
  }

  private notify(updates: Partial<SyncProgress>) {
    this.currentProgress = { 
      ...this.currentProgress, 
      ...updates,
      autoSyncEnabled: this.autoSyncEnabled,
      isAutoSyncing: this.isAutoSyncing,
      recentActivity: [...this.recentActivity]
    };
    this.progressListeners.forEach(l => l(this.getProgress()));
  }

  private logActivity(text: string, success: boolean = true) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const item: SyncActivityItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      time,
      text,
      success
    };
    this.recentActivity = [item, ...this.recentActivity.slice(0, 19)];
    this.notify({});
  }

  public isAutoSyncActive(): boolean {
    return this.autoSyncEnabled;
  }

  public toggleAutoSync(enabled?: boolean): boolean {
    const nextState = enabled !== undefined ? enabled : !this.autoSyncEnabled;
    this.autoSyncEnabled = nextState;
    localStorage.setItem(STORAGE_AUTO_SYNC_KEY, String(nextState));
    
    this.logActivity(
      nextState ? 'Auto-sync enabled by administrator' : 'Auto-sync paused by administrator',
      true
    );

    this.notify({
      autoSyncEnabled: nextState,
      message: nextState ? 'Firestore Auto-Sync active' : 'Firestore Auto-Sync paused'
    });

    if (nextState) {
      // Trigger an immediate sync to catch up on any modifications
      this.triggerDebouncedSync(true);
    }

    return nextState;
  }

  /**
   * Initializes real-time Auto-Sync listeners and background heartbeat
   */
  public initAutoSync(): () => void {
    if (this.isInitialized) {
      return () => {};
    }
    this.isInitialized = true;

    // 1. Subscribe to changes from erpService
    const unsubscribeErp = onErpDataChanged((collectionName, docId, action) => {
      if (!this.autoSyncEnabled) return;
      
      this.pendingCollections.add(collectionName);
      this.triggerDebouncedSync(false, collectionName);
    });

    // 2. Perform initial boot auto-sync if not completed or fresh session
    const hasBootSynced = sessionStorage.getItem('theo_erp_session_synced');
    if (!hasBootSynced) {
      sessionStorage.setItem('theo_erp_session_synced', 'true');
      // Delay boot sync slightly so UI renders instantly without contention
      setTimeout(() => {
        if (this.autoSyncEnabled) {
          this.pushAllToFirestore(true).catch(err => {
            console.warn('Silent boot auto-sync notice:', err);
          });
        }
      }, 1500);
    }

    // 3. Setup periodic background heartbeat (every 90 seconds)
    this.intervalTimer = setInterval(() => {
      if (this.autoSyncEnabled && !this.isAutoSyncing && this.pendingCollections.size > 0) {
        this.flushPendingSync();
      }
    }, 90000);

    // 4. Also flush on window visibility change when user switches back to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && this.autoSyncEnabled && this.pendingCollections.size > 0) {
        this.flushPendingSync();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unsubscribeErp();
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      if (this.intervalTimer) clearInterval(this.intervalTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      this.isInitialized = false;
    };
  }

  /**
   * Schedules a debounced auto-sync when data changes occur
   */
  private triggerDebouncedSync(immediate = false, hintCollection?: string) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.isAutoSyncing = true;
    this.notify({
      isAutoSyncing: true,
      message: hintCollection 
        ? `Auto-syncing ${hintCollection} to Firestore...` 
        : 'Auto-syncing changes to Firestore...'
    });

    const delay = immediate ? 50 : 800; // 800ms debounce window
    this.debounceTimer = setTimeout(() => {
      this.flushPendingSync();
    }, delay);
  }

  /**
   * Flushes all queued collections to Firestore
   */
  public async flushPendingSync(): Promise<void> {
    if (!db) {
      this.isAutoSyncing = false;
      this.notify({ isAutoSyncing: false });
      return;
    }

    const collectionsToSync = Array.from(this.pendingCollections);
    this.pendingCollections.clear();

    if (collectionsToSync.length === 0) {
      this.isAutoSyncing = false;
      this.notify({ isAutoSyncing: false });
      return;
    }

    this.isAutoSyncing = true;
    let totalPushed = 0;

    try {
      for (const colName of collectionsToSync) {
        const count = await this.pushCollection(colName);
        totalPushed += count;
      }

      const syncTimestamp = new Date().toLocaleString();
      localStorage.setItem(STORAGE_LAST_SYNC_KEY, syncTimestamp);
      localStorage.setItem(STORAGE_INITIAL_BOOT_SYNC_KEY, 'true');

      this.isAutoSyncing = false;
      this.logActivity(
        `Auto-synced ${collectionsToSync.length} collection(s) (${totalPushed} records)`,
        true
      );

      this.notify({
        status: 'success',
        isAutoSyncing: false,
        message: `Auto-sync complete: updated ${collectionsToSync.join(', ')}`,
        lastSyncedAt: syncTimestamp
      });
    } catch (err: any) {
      console.warn('Auto-sync flush encountered error:', err);
      this.isAutoSyncing = false;
      this.logActivity(`Auto-sync error: ${err?.message || 'Network delay'}`, false);
      this.notify({
        status: 'error',
        isAutoSyncing: false,
        message: `Auto-sync notice: ${err?.message || 'Pending retry'}`
      });
    }
  }

  /**
   * Fetches local data for a specific collection name
   */
  private getItemsForCollection(colName: string): any[] {
    switch (colName) {
      case 'settings': 
        return [{ id: 'institution-settings', ...erpService.getSettings() }];
      case 'websiteSettings': 
        return [{ id: 'public-config', ...erpService.getWebsiteSettings() }];
      case 'students': 
        return erpService.getStudents();
      case 'applicants': 
        return erpService.getApplicants();
      case 'programs': 
        return erpService.getPrograms();
      case 'departments': 
        return erpService.getDepartments();
      case 'courses': 
        return erpService.getCourses();
      case 'staff': 
        return erpService.getStaff();
      case 'timetable': 
        return erpService.getTimetable();
      case 'assignments': 
        return erpService.getAssignments();
      case 'examinations': 
        return erpService.getExaminations();
      case 'examResults':
      case 'results': 
        return erpService.getResults();
      case 'feeStructures': 
        return erpService.getFeeStructures();
      case 'invoices': 
        return erpService.getInvoices();
      case 'payments': 
        return erpService.getPayments();
      case 'ministryPlacements': 
        return erpService.getMinistryPlacements();
      case 'ministryReports': 
        return erpService.getMinistryReports();
      case 'libraryBooks': 
        return erpService.getLibraryBooks();
      case 'hostelRooms': 
        return erpService.getHostelRooms();
      case 'chapelServices': 
        return erpService.getChapelServices();
      case 'disciplineCases': 
        return erpService.getDisciplineCases();
      case 'announcements': 
        return erpService.getAnnouncements();
      case 'auditLogs': 
        return erpService.getAuditLogs();
      case 'websiteHeroSlides': 
        return erpService.getHeroSlides();
      case 'testimonials': 
        return erpService.getTestimonials();
      case 'newsArticles': 
        return erpService.getNewsArticles();
      case 'publicEvents': 
        return erpService.getPublicEvents();
      case 'contactMessages': 
        return erpService.getContactMessages();
      case 'users': 
        return authService.getAllUserAccounts();
      default:
        try {
          const raw = localStorage.getItem(`theo_erp_${colName}`);
          return raw ? JSON.parse(raw) : [];
        } catch {
          return [];
        }
    }
  }

  /**
   * Pushes a single collection to Cloud Firestore in batches
   */
  public async pushCollection(colName: string): Promise<number> {
    if (!db) return 0;
    const items = this.getItemsForCollection(colName);
    if (!items || items.length === 0) return 0;

    const batchSize = 25;
    for (let b = 0; b < items.length; b += batchSize) {
      const batch = writeBatch(db);
      const chunk = items.slice(b, b + batchSize);

      for (const item of chunk) {
        const docId = String(item.id || item.code || Math.random().toString(36).substring(2, 9));
        const docRef = doc(db, colName, docId);
        const payload = cleanFirestoreData({
          ...item,
          _firestoreSyncedAt: new Date().toISOString()
        });
        batch.set(docRef, payload, { merge: true });
      }

      await batch.commit();
    }

    return items.length;
  }

  /**
   * Pushes a single record directly to Firestore
   */
  public async pushRecord(collectionName: string, id: string, data: any): Promise<boolean> {
    if (!db) {
      console.warn('Firestore DB not initialized');
      return false;
    }
    try {
      const docRef = doc(db, collectionName, id);
      const payload = cleanFirestoreData({
        ...data,
        updatedAt: serverTimestamp(),
        _firestoreSyncedAt: new Date().toISOString()
      });
      await setDoc(docRef, payload, { merge: true });
      this.logActivity(`Auto-saved record ${id} to ${collectionName}`, true);
      return true;
    } catch (err) {
      console.error(`Error pushing document ${id} to collection ${collectionName}:`, err);
      return false;
    }
  }

  /**
   * Deletes a single record directly from Firestore
   */
  public async deleteRecord(collectionName: string, id: string): Promise<boolean> {
    if (!db) return false;
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      this.logActivity(`Deleted record ${id} from ${collectionName}`, true);
      return true;
    } catch (err) {
      console.error(`Error deleting document ${id} from collection ${collectionName}:`, err);
      return false;
    }
  }

  /**
   * Pushes all local institutional data into Firestore collections
   */
  public async pushAllToFirestore(isSilent = false): Promise<{ success: boolean; totalDocs: number; error?: string }> {
    if (!db) {
      const errMsg = 'Firestore is not initialized. Please verify configuration.';
      if (!isSilent) {
        this.notify({ status: 'error', message: errMsg, errorDetails: errMsg });
      }
      return { success: false, totalDocs: 0, error: errMsg };
    }

    this.isAutoSyncing = true;
    this.notify({
      status: 'in_progress',
      isAutoSyncing: true,
      syncMode: isSilent ? 'auto' : 'manual',
      completedCollections: 0,
      totalCollections: 28,
      totalDocuments: 0,
      message: isSilent ? 'Auto-syncing database with Cloud Firestore...' : 'Pushing all collections to Cloud Firestore...',
      collectionCounts: {}
    });

    const dataset: { name: string; items: any[] }[] = [
      { name: 'settings', items: [{ id: 'institution-settings', ...erpService.getSettings() }] },
      { name: 'departments', items: erpService.getDepartments() },
      { name: 'programs', items: erpService.getPrograms() },
      { name: 'courses', items: erpService.getCourses() },
      { name: 'students', items: erpService.getStudents() },
      { name: 'applicants', items: erpService.getApplicants() },
      { name: 'staff', items: erpService.getStaff() },
      { name: 'timetable', items: erpService.getTimetable() },
      { name: 'assignments', items: erpService.getAssignments() },
      { name: 'examinations', items: erpService.getExaminations() },
      { name: 'examResults', items: erpService.getResults() },
      { name: 'feeStructures', items: erpService.getFeeStructures() },
      { name: 'invoices', items: erpService.getInvoices() },
      { name: 'payments', items: erpService.getPayments() },
      { name: 'ministryPlacements', items: erpService.getMinistryPlacements() },
      { name: 'ministryReports', items: erpService.getMinistryReports() },
      { name: 'libraryBooks', items: erpService.getLibraryBooks() },
      { name: 'hostelRooms', items: erpService.getHostelRooms() },
      { name: 'chapelServices', items: erpService.getChapelServices() },
      { name: 'disciplineCases', items: erpService.getDisciplineCases() },
      { name: 'announcements', items: erpService.getAnnouncements() },
      { name: 'auditLogs', items: erpService.getAuditLogs() },
      { name: 'websiteHeroSlides', items: erpService.getHeroSlides() },
      { name: 'websiteSettings', items: [{ id: 'public-config', ...erpService.getWebsiteSettings() }] },
      { name: 'testimonials', items: erpService.getTestimonials() },
      { name: 'newsArticles', items: erpService.getNewsArticles() },
      { name: 'publicEvents', items: erpService.getPublicEvents() },
      { name: 'contactMessages', items: erpService.getContactMessages() },
      { name: 'users', items: authService.getAllUserAccounts() }
    ];

    let totalDocsPushed = 0;
    const collectionCounts: Record<string, number> = {};

    try {
      for (let i = 0; i < dataset.length; i++) {
        const { name, items } = dataset[i];
        
        if (!isSilent) {
          this.notify({
            message: `Synchronizing collection "${name}" (${items.length} records)...`,
            completedCollections: i,
            totalCollections: dataset.length
          });
        }

        if (items.length > 0) {
          const batchSize = 25;
          for (let b = 0; b < items.length; b += batchSize) {
            const batch = writeBatch(db);
            const chunk = items.slice(b, b + batchSize);

            for (const item of chunk) {
              const docId = String(item.id || item.code || Math.random().toString(36).substring(2, 9));
              const docRef = doc(db, name, docId);
              const payload = cleanFirestoreData({
                ...item,
                _firestoreSyncedAt: new Date().toISOString()
              });
              batch.set(docRef, payload, { merge: true });
            }

            await batch.commit();
          }
        }

        totalDocsPushed += items.length;
        collectionCounts[name] = items.length;

        this.notify({
          completedCollections: i + 1,
          totalDocuments: totalDocsPushed,
          collectionCounts: { ...collectionCounts }
        });
      }

      // Maintain institutional multi-tenant settings document
      try {
        const currentWeb = erpService.getWebsiteSettings();
        const instId = currentWeb.institutionId || 'victory-international';
        const tenantLogoUrl = currentWeb.branding?.logoUrl || erpService.getSettings().logoUrl || null;
        const tenantDocRef = doc(db, 'institutions', instId, 'settings', 'website');
        await setDoc(tenantDocRef, cleanFirestoreData({
          institutionId: instId,
          logoUrl: tenantLogoUrl,
          updatedAt: serverTimestamp()
        }), { merge: true });
        totalDocsPushed += 1;
      } catch (tenantErr) {
        console.warn('Tenant document sync notice:', tenantErr);
      }

      const syncTimestamp = new Date().toLocaleString();
      localStorage.setItem(STORAGE_LAST_SYNC_KEY, syncTimestamp);
      localStorage.setItem(STORAGE_INITIAL_BOOT_SYNC_KEY, 'true');

      this.isAutoSyncing = false;
      this.logActivity(
        isSilent 
          ? `Auto-sync completed: ${totalDocsPushed} documents verified with Firestore`
          : `Full push completed: ${totalDocsPushed} documents across ${dataset.length} collections`,
        true
      );

      this.notify({
        status: 'success',
        isAutoSyncing: false,
        completedCollections: dataset.length,
        totalDocuments: totalDocsPushed,
        message: `Successfully synchronized ${totalDocsPushed} documents across ${dataset.length} collections to Cloud Firestore!`,
        lastSyncedAt: syncTimestamp,
        collectionCounts
      });

      return { success: true, totalDocs: totalDocsPushed };
    } catch (error: any) {
      console.error('Failed to sync to Firestore:', error);
      const errorMsg = error?.message || 'Unknown Firestore error';
      this.isAutoSyncing = false;
      this.logActivity(`Sync error: ${errorMsg}`, false);
      this.notify({
        status: 'error',
        isAutoSyncing: false,
        message: `Firestore sync failed: ${errorMsg}`,
        errorDetails: errorMsg
      });
      return { success: false, totalDocs: totalDocsPushed, error: errorMsg };
    }
  }

  /**
   * Pulls documents from Firestore into local state
   */
  public async pullAllFromFirestore(): Promise<{ success: boolean; totalDocs: number; error?: string }> {
    if (!db) {
      return { success: false, totalDocs: 0, error: 'Firestore not initialized' };
    }

    try {
      this.notify({
        status: 'in_progress',
        syncMode: 'manual',
        message: 'Pulling latest records from Cloud Firestore...'
      });

      const collectionsToPull = [
        'departments', 'programs', 'courses', 'students', 'applicants', 
        'staff', 'invoices', 'payments', 'examinations', 'examResults',
        'ministryPlacements', 'libraryBooks', 'announcements'
      ];

      let pulledCount = 0;
      for (const colName of collectionsToPull) {
        const querySnapshot = await getDocs(collection(db, colName));
        const docs = querySnapshot.docs.map(d => d.data());
        if (docs.length > 0) {
          pulledCount += docs.length;
          localStorage.setItem(`theo_erp_${colName}`, JSON.stringify(docs));
        }
      }

      const syncTimestamp = new Date().toLocaleString();
      localStorage.setItem(STORAGE_LAST_SYNC_KEY, syncTimestamp);
      this.logActivity(`Pulled ${pulledCount} documents from Cloud Firestore`, true);

      this.notify({
        status: 'success',
        lastSyncedAt: syncTimestamp,
        message: `Pulled ${pulledCount} documents from Cloud Firestore. Refreshing local state...`
      });

      return { success: true, totalDocs: pulledCount };
    } catch (err: any) {
      console.error('Failed to pull from Firestore:', err);
      this.logActivity(`Pull error: ${err?.message}`, false);
      return { success: false, totalDocs: 0, error: err?.message };
    }
  }
}

export const firestoreSyncService = new FirestoreSyncService();
