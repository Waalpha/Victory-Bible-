import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import appletConfig from '../../firebase-applet-config.json';

const metaEnv = (import.meta as any).env || {};

// Firebase configuration from firebase-applet-config.json or environment variables
export const firebaseConfig = {
  apiKey: appletConfig.apiKey || metaEnv.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: appletConfig.authDomain || metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0945118687.firebaseapp.com",
  projectId: appletConfig.projectId || metaEnv.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0945118687",
  storageBucket: appletConfig.storageBucket || metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0945118687.firebasestorage.app",
  messagingSenderId: appletConfig.messagingSenderId || metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "852436599037",
  appId: appletConfig.appId || metaEnv.VITE_FIREBASE_APP_ID || "1:852436599037:web:68b33b6ecef5e8f5d53e94",
  firestoreDatabaseId: appletConfig.firestoreDatabaseId || "(default)"
};

let app: any;
let auth: any;
let db: Firestore;
let storage: any;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  
  // Use specific firestoreDatabaseId if provided, or default
  if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') {
    try {
      db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    } catch (e) {
      console.warn("Could not init with custom firestoreDatabaseId, falling back to default db", e);
      db = getFirestore(app);
    }
  } else {
    db = getFirestore(app);
  }

  storage = getStorage(app);
  console.log("Firebase & Firestore initialized successfully for project:", firebaseConfig.projectId);
} catch (e) {
  console.warn("Firebase initialization warning:", e);
}

/**
 * Recursively strips any keys with `undefined` values from data objects.
 * Firestore strictly rejects documents containing `undefined` values.
 */
export function cleanFirestoreData<T = any>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as any;
  }
  try {
    // Convert undefined to null or omit, as Firestore accepts null but rejects undefined
    const serialized = JSON.stringify(obj, (_key, value) => {
      if (value === undefined) {
        return null;
      }
      return value;
    });
    return JSON.parse(serialized);
  } catch (e) {
    console.warn("Could not clean Firestore data:", e);
    return obj;
  }
}

export { app, auth, db, storage };
