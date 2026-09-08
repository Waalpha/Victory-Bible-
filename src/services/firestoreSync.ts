import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';
import { db, firebaseConfig, cleanFirestoreData } from './firebase';
import { erpService } from './erpService';

export interface SyncProgress {
  status: 'idle' | 'in_progress' | 'success' | 'error';
  totalCollections: number;
  completedCollections: number;
  totalDocuments: number;
  message: string;
  lastSyncedAt: string | null;
  errorDetails?: string;
  collectionCounts: Record<string, number>;
}

class FirestoreSyncService {
  private progressListeners: ((progress: SyncProgress) => void)[] = [];
  private currentProgress: SyncProgress = {
    status: 'idle',
    totalCollections: 0,
    completedCollections: 0,
    totalDocuments: 0,
    message: 'Ready to sync',
    lastSyncedAt: localStorage.getItem('theo_erp_last_firestore_sync') || null,
    collectionCounts: {}
  };

  public getProgress(): SyncProgress {
    return { ...this.currentProgress };
  }

  public subscribe(listener: (progress: SyncProgress) => void): () => void {
    this.progressListeners.push(listener);
    listener(this.getProgress());
    return () => {
      this.progressListeners = this.progressListeners.filter(l => l !== listener);
    };
  }

  private notify(updates: Partial<SyncProgress>) {
    this.currentProgress = { ...this.currentProgress, ...updates };
    this.progressListeners.forEach(l => l(this.getProgress()));
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
        updatedAt: serverTimestamp()
      });
      await setDoc(docRef, payload, { merge: true });
      return true;
    } catch (err) {
      console.error(`Error pushing document ${id} to collection ${collectionName}:`, err);
      return false;
    }
  }

  /**
   * Pushes all local institutional data into Firestore collections
   */
  public async pushAllToFirestore(): Promise<{ success: boolean; totalDocs: number; error?: string }> {
    if (!db) {
      const errMsg = 'Firestore is not initialized. Please verify configuration.';
      this.notify({ status: 'error', message: errMsg, errorDetails: errMsg });
      return { success: false, totalDocs: 0, error: errMsg };
    }

    this.notify({
      status: 'in_progress',
      completedCollections: 0,
      totalCollections: 16,
      totalDocuments: 0,
      message: 'Connecting to Cloud Firestore database...',
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
      { name: 'contactMessages', items: erpService.getContactMessages() }
    ];

    let totalDocsPushed = 0;
    const collectionCounts: Record<string, number> = {};

    try {
      for (let i = 0; i < dataset.length; i++) {
        const { name, items } = dataset[i];
        this.notify({
          message: `Pushing collection "${name}" (${items.length} records)...`,
          completedCollections: i,
          totalCollections: dataset.length
        });

        if (items.length > 0) {
          // Write documents in batches of max 20 to avoid exceeding limits
          const batchSize = 20;
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

      const syncTimestamp = new Date().toLocaleString();
      localStorage.setItem('theo_erp_last_firestore_sync', syncTimestamp);

      this.notify({
        status: 'success',
        completedCollections: dataset.length,
        totalDocuments: totalDocsPushed,
        message: `Successfully pushed ${totalDocsPushed} documents across ${dataset.length} collections to Cloud Firestore!`,
        lastSyncedAt: syncTimestamp,
        collectionCounts
      });

      erpService.logAction(
        'system@gracetheo.edu',
        'ADMIN',
        `Pushed all ${totalDocsPushed} records to Cloud Firestore`,
        'Database'
      );

      return { success: true, totalDocs: totalDocsPushed };
    } catch (error: any) {
      console.error('Failed to push to Firestore:', error);
      const errorMsg = error?.message || 'Unknown Firestore error';
      this.notify({
        status: 'error',
        message: `Firestore push failed: ${errorMsg}`,
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
          // Sync into localStorage
          localStorage.setItem(`theo_erp_${colName}`, JSON.stringify(docs));
        }
      }

      this.notify({
        status: 'success',
        message: `Pulled ${pulledCount} documents from Cloud Firestore. Refreshing local state...`
      });

      return { success: true, totalDocs: pulledCount };
    } catch (err: any) {
      console.error('Failed to pull from Firestore:', err);
      return { success: false, totalDocs: 0, error: err?.message };
    }
  }
}

export const firestoreSyncService = new FirestoreSyncService();
