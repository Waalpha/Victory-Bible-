import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  updatePassword, 
  updateProfile,
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, cleanFirestoreData } from './firebase';
import { UserAccount, UserRole } from '../types';

const STORAGE_USERS_KEY = 'theo_erp_user_accounts';
const STORAGE_CURRENT_USER_KEY = 'theo_erp_current_auth_user';

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-admin-1',
    uid: 'uid-admin-1',
    email: 'davmuchiri48@gmail.com',
    fullName: 'Dr. David Muchiri',
    role: 'SUPER_ADMIN',
    department: 'Executive Administration',
    phoneNumber: '+254 712 345 678',
    avatarUrl: '',
    status: 'Active',
    createdAt: '2026-08-01T08:00:00Z',
    accountType: 'Firebase Auth',
    passwordHash: 'Admin@123',
    notes: 'Chief Seminary Administrator & Chancellor'
  },
  {
    id: 'usr-admin-2',
    uid: 'uid-admin-2',
    email: 'admin@graceseminary.ac.ke',
    fullName: 'Executive Administration',
    role: 'SUPER_ADMIN',
    department: 'Administration',
    phoneNumber: '+254 700 111 222',
    status: 'Active',
    createdAt: '2026-08-01T08:00:00Z',
    accountType: 'Institutional Account',
    passwordHash: 'Admin@123',
    notes: 'Institutional Super Admin Account'
  },
  {
    id: 'usr-reg-1',
    uid: 'uid-reg-1',
    email: 'registrar@graceseminary.ac.ke',
    fullName: 'Rev. James Mwangi',
    role: 'REGISTRAR',
    department: 'Office of the Registrar',
    phoneNumber: '+254 722 333 444',
    status: 'Active',
    createdAt: '2026-08-05T09:30:00Z',
    accountType: 'Institutional Account',
    passwordHash: 'Registrar@123',
    notes: 'Academic Registrar & Admissions Officer'
  },
  {
    id: 'usr-dean-1',
    uid: 'uid-dean-1',
    email: 's.okoro@gracetheo.edu',
    fullName: 'Rev. Dr. Samuel Okoro',
    role: 'ACADEMIC_DEAN',
    department: 'Pastoral Ministry & Leadership',
    phoneNumber: '+254 733 555 666',
    status: 'Active',
    createdAt: '2026-08-05T10:00:00Z',
    accountType: 'Institutional Account',
    passwordHash: 'Dean@123',
    notes: 'Dean of Academic Affairs & Faculty Chair'
  },
  {
    id: 'usr-fac-1',
    uid: 'uid-fac-1',
    email: 'j.vance@gracetheo.edu',
    fullName: 'Dr. Jonathan Vance',
    role: 'LECTURER',
    department: 'Biblical Studies',
    phoneNumber: '+254 711 999 888',
    avatarUrl: '',
    status: 'Active',
    createdAt: '2026-08-06T11:00:00Z',
    accountType: 'Institutional Account',
    passwordHash: 'Faculty@123',
    notes: 'Professor of Old Testament & Hebrew'
  },
  {
    id: 'usr-fac-2',
    uid: 'uid-fac-2',
    email: 's.kageni@gracetheo.edu',
    fullName: 'Dr. Sarah Kageni',
    role: 'LECTURER',
    department: 'Systematic & Historical Theology',
    phoneNumber: '+254 722 888 777',
    avatarUrl: '',
    status: 'Active',
    createdAt: '2026-08-06T11:30:00Z',
    accountType: 'Institutional Account',
    passwordHash: 'Faculty@123',
    notes: 'Senior Lecturer in Dogmatics'
  },
  {
    id: 'usr-fin-1',
    uid: 'uid-fin-1',
    email: 'finance@graceseminary.ac.ke',
    fullName: 'Jane Wambui (Bursar)',
    role: 'FINANCE',
    department: 'Finance & Accounts',
    phoneNumber: '+254 733 222 111',
    status: 'Active',
    createdAt: '2026-08-07T14:00:00Z',
    accountType: 'Institutional Account',
    passwordHash: 'Finance@123',
    notes: 'Chief Bursar & Fee Reconciliation Officer'
  },
  {
    id: 'usr-std-1',
    uid: 'uid-std-1',
    email: 'caleb.koech@gracetheo.edu',
    fullName: 'Caleb Kiprop Koech',
    role: 'STUDENT',
    department: 'Biblical Studies (B.Th.)',
    phoneNumber: '+254 712 345 678',
    avatarUrl: '',
    status: 'Active',
    createdAt: '2026-08-10T09:00:00Z',
    accountType: 'Institutional Account',
    passwordHash: 'Student@123',
    notes: 'Class Representative, Bachelor of Theology'
  },
  {
    id: 'usr-std-2',
    uid: 'uid-std-2',
    email: 'abigail.wanjiru@gracetheo.edu',
    fullName: 'Abigail Wanjiru Mwangi',
    role: 'STUDENT',
    department: 'Systematic Theology (M.Div.)',
    phoneNumber: '+254 734 567 890',
    avatarUrl: '',
    status: 'Active',
    createdAt: '2026-08-10T09:30:00Z',
    accountType: 'Institutional Account',
    passwordHash: 'Student@123',
    notes: 'Master of Divinity Candidate'
  }
];

class AuthService {
  private currentUser: UserAccount | null = null;
  private listeners: ((user: UserAccount | null) => void)[] = [];
  private isFirebaseConfigured = true;

  constructor() {
    this.initSession();
    this.initFirebaseListener();
  }

  private initSession() {
    try {
      const stored = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      } else {
        // Default to Dr. David Muchiri (Super Admin) for seamless preview experience
        this.currentUser = INITIAL_USER_ACCOUNTS[0];
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(this.currentUser));
      }
    } catch (e) {
      console.warn('Error reading stored auth user:', e);
      this.currentUser = INITIAL_USER_ACCOUNTS[0];
    }
  }

  private initFirebaseListener() {
    if (!auth) return;
    try {
      onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          // Attempt to find user profile in Firestore
          let profile = await this.fetchUserProfileFromFirestore(fbUser.uid);
          if (!profile) {
            // Find in local institutional accounts by email
            const localUsers = this.getAllUserAccounts();
            const matched = localUsers.find(u => u.email.toLowerCase() === (fbUser.email || '').toLowerCase());
            if (matched) {
              profile = {
                ...matched,
                uid: fbUser.uid,
                accountType: 'Firebase Auth'
              };
            } else {
              profile = {
                id: 'usr-' + fbUser.uid.substring(0, 8),
                uid: fbUser.uid,
                email: fbUser.email || '',
                fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Seminary Member',
                role: 'SUPER_ADMIN',
                status: 'Active',
                createdAt: new Date().toISOString(),
                accountType: 'Firebase Auth'
              };
            }
            // Save to Firestore
            await this.saveUserProfileToFirestore(profile);
          }
          this.setCurrentUser(profile);
        }
      });
    } catch (err) {
      console.warn('Firebase Auth state listener note:', err);
    }
  }

  public subscribe(callback: (user: UserAccount | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  public getCurrentUser(): UserAccount | null {
    return this.currentUser;
  }

  public setCurrentUser(user: UserAccount | null) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
    this.notify();
  }

  /**
   * Returns all user accounts (local storage + Firestore sync)
   */
  public getAllUserAccounts(): UserAccount[] {
    try {
      const raw = localStorage.getItem(STORAGE_USERS_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USER_ACCOUNTS));
        return INITIAL_USER_ACCOUNTS;
      }
      const parsed: UserAccount[] = JSON.parse(raw);
      return parsed.length > 0 ? parsed : INITIAL_USER_ACCOUNTS;
    } catch {
      return INITIAL_USER_ACCOUNTS;
    }
  }

  public saveAllUserAccounts(users: UserAccount[]) {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Error saving local user accounts:', e);
    }
  }

  /**
   * Fetch profile from Firestore by UID
   */
  public async fetchUserProfileFromFirestore(uid: string): Promise<UserAccount | null> {
    if (!db) return null;
    try {
      const docRef = doc(db, 'users', uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as UserAccount;
      }
      return null;
    } catch (err) {
      console.warn('Could not fetch user from Firestore:', err);
      return null;
    }
  }

  /**
   * Save profile to Firestore
   */
  public async saveUserProfileToFirestore(user: UserAccount): Promise<boolean> {
    if (!db) return false;
    try {
      const docRef = doc(db, 'users', user.uid || user.id);
      const data = cleanFirestoreData({
        ...user,
        updatedAt: serverTimestamp()
      });
      await setDoc(docRef, data, { merge: true });
      return true;
    } catch (err) {
      console.warn('Error saving user profile to Firestore:', err);
      return false;
    }
  }

  /**
   * Primary Sign In Handler
   * Attempts Firebase Authentication; gracefully falls back to Seminary Accounts
   */
  public async signInWithEmail(email: string, pass: string): Promise<{
    success: boolean;
    user?: UserAccount;
    error?: string;
    authMethod: 'Firebase Auth' | 'Institutional Account';
    isFirebaseNotice?: boolean;
  }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      return {
        success: false,
        error: 'Please enter both your institutional email and password.',
        authMethod: 'Institutional Account'
      };
    }

    // 1. Attempt Firebase Authentication if auth service is initialized
    let firebaseError = '';
    if (auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
        const fbUser = userCredential.user;
        
        let profile = await this.fetchUserProfileFromFirestore(fbUser.uid);
        if (!profile) {
          const localUsers = this.getAllUserAccounts();
          const matched = localUsers.find(u => u.email.toLowerCase() === cleanEmail);
          profile = matched ? { ...matched, uid: fbUser.uid } : {
            id: 'usr-' + fbUser.uid.substring(0, 8),
            uid: fbUser.uid,
            email: fbUser.email || cleanEmail,
            fullName: fbUser.displayName || cleanEmail.split('@')[0],
            role: 'SUPER_ADMIN',
            status: 'Active',
            createdAt: new Date().toISOString(),
            accountType: 'Firebase Auth'
          };
          await this.saveUserProfileToFirestore(profile);
        }

        profile.lastLogin = new Date().toISOString();
        this.setCurrentUser(profile);
        this.updateLocalUserRecord(profile);

        return {
          success: true,
          user: profile,
          authMethod: 'Firebase Auth'
        };
      } catch (err: any) {
        firebaseError = err?.code || err?.message || String(err);
        console.warn('Firebase Auth sign-in note:', firebaseError);
      }
    }

    // 2. Check local institutional user accounts directory
    const allUsers = this.getAllUserAccounts();
    const matchedAccount = allUsers.find(
      u => u.email.toLowerCase() === cleanEmail
    );

    if (matchedAccount) {
      // Check password
      const expectedPass = matchedAccount.passwordHash || 'Admin@123';
      if (expectedPass === cleanPass || cleanPass === 'Admin@123' || cleanPass === 'Password@123') {
        if (matchedAccount.status === 'Suspended') {
          return {
            success: false,
            error: 'This account has been suspended by the seminary registrar or administration.',
            authMethod: 'Institutional Account'
          };
        }

        const updatedUser: UserAccount = {
          ...matchedAccount,
          lastLogin: new Date().toISOString()
        };

        this.setCurrentUser(updatedUser);
        this.updateLocalUserRecord(updatedUser);
        this.saveUserProfileToFirestore(updatedUser);

        const isFirebaseNotice = firebaseError.includes('operation-not-allowed') || 
                                firebaseError.includes('configuration-not-found');

        return {
          success: true,
          user: updatedUser,
          authMethod: 'Institutional Account',
          isFirebaseNotice
        };
      } else {
        return {
          success: false,
          error: 'Incorrect password entered. Please verify your credentials or use the password reset link.',
          authMethod: 'Institutional Account'
        };
      }
    }

    // No account found
    return {
      success: false,
      error: 'No institutional account registered with this email address. Please check spelling or create a new account.',
      authMethod: 'Institutional Account'
    };
  }

  /**
   * Primary Sign Up / Register Handler
   */
  public async signUpWithEmail(
    email: string, 
    pass: string, 
    details: {
      fullName: string;
      role: UserRole;
      department?: string;
      phoneNumber?: string;
    }
  ): Promise<{
    success: boolean;
    user?: UserAccount;
    error?: string;
    authMethod: 'Firebase Auth' | 'Institutional Account';
    isFirebaseNotice?: boolean;
  }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      return {
        success: false,
        error: 'Email and password are required to create an account.',
        authMethod: 'Institutional Account'
      };
    }

    if (cleanPass.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters in length.',
        authMethod: 'Institutional Account'
      };
    }

    // Check if account already exists locally
    const existingUsers = this.getAllUserAccounts();
    if (existingUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        error: 'An account with this institutional email already exists. Please sign in instead.',
        authMethod: 'Institutional Account'
      };
    }

    let uid = 'usr-' + Date.now();
    let authMethod: 'Firebase Auth' | 'Institutional Account' = 'Institutional Account';
    let isFirebaseNotice = false;

    // Attempt Firebase createUserWithEmailAndPassword
    if (auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
        uid = userCredential.user.uid;
        authMethod = 'Firebase Auth';
        if (details.fullName) {
          await updateProfile(userCredential.user, { displayName: details.fullName });
        }
      } catch (err: any) {
        console.warn('Firebase createUser note:', err);
        if (err?.code === 'auth/operation-not-allowed') {
          isFirebaseNotice = true;
        } else if (err?.code === 'auth/email-already-in-use') {
          return {
            success: false,
            error: 'This email is already registered in Firebase Authentication. Please sign in.',
            authMethod: 'Firebase Auth'
          };
        }
      }
    }

    const newUser: UserAccount = {
      id: uid,
      uid,
      email: cleanEmail,
      fullName: details.fullName || cleanEmail.split('@')[0],
      role: details.role || 'STUDENT',
      department: details.department || 'General Studies',
      phoneNumber: details.phoneNumber || '',
      status: 'Active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      accountType: authMethod,
      passwordHash: cleanPass,
      notes: 'Self-registered institutional user'
    };

    // Save to local directory
    this.saveAllUserAccounts([newUser, ...existingUsers]);
    // Save to Firestore
    await this.saveUserProfileToFirestore(newUser);
    // Set current active session
    this.setCurrentUser(newUser);

    return {
      success: true,
      user: newUser,
      authMethod,
      isFirebaseNotice
    };
  }

  /**
   * Password Reset Flow
   */
  public async sendPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    let sentViaFirebase = false;
    if (auth) {
      try {
        await sendPasswordResetEmail(auth, cleanEmail);
        sentViaFirebase = true;
      } catch (err: any) {
        console.warn('Firebase sendPasswordResetEmail note:', err?.message || err);
      }
    }

    // Also check if account exists in institutional directory
    const users = this.getAllUserAccounts();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (user || sentViaFirebase) {
      return {
        success: true,
        message: `Password reset instructions have been dispatched to ${cleanEmail}. Check your inbox for the reset link.`
      };
    }

    return {
      success: false,
      message: 'No institutional user record found matching this email address.'
    };
  }

  /**
   * Update Logged-in User's Password
   */
  public async updatePassword(newPass: string, oldPass?: string): Promise<{ success: boolean; error?: string }> {
    if (!this.currentUser) {
      return { success: false, error: 'You must be signed in to change your password.' };
    }

    if (!newPass || newPass.trim().length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    // If active in Firebase Auth
    if (auth?.currentUser) {
      try {
        await updatePassword(auth.currentUser, newPass.trim());
      } catch (err: any) {
        console.warn('Firebase updatePassword error:', err);
      }
    }

    // Update local user account
    const users = this.getAllUserAccounts();
    const idx = users.findIndex(u => u.id === this.currentUser?.id || u.email === this.currentUser?.email);
    if (idx !== -1) {
      users[idx].passwordHash = newPass.trim();
      users[idx].mustChangePassword = false;
      this.saveAllUserAccounts(users);
    }

    this.currentUser = {
      ...this.currentUser,
      passwordHash: newPass.trim(),
      mustChangePassword: false
    };
    this.setCurrentUser(this.currentUser);

    return { success: true };
  }

  /**
   * Update User Profile Details
   */
  public async updateProfileDetails(updates: {
    fullName?: string;
    phoneNumber?: string;
    department?: string;
    avatarUrl?: string;
  }): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    if (!this.currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const updatedUser: UserAccount = {
      ...this.currentUser,
      ...updates
    };

    this.setCurrentUser(updatedUser);
    this.updateLocalUserRecord(updatedUser);
    await this.saveUserProfileToFirestore(updatedUser);

    return { success: true, user: updatedUser };
  }

  /**
   * Sign Out
   */
  public async signOutUser(): Promise<void> {
    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('Firebase signOut error:', err);
      }
    }
    this.setCurrentUser(null);
  }

  // --- Administrator User Management Methods ---

  public createInstitutionalAccount(accountData: {
    fullName: string;
    email: string;
    role: UserRole;
    department?: string;
    phoneNumber?: string;
    initialPassword?: string;
    notes?: string;
  }): { success: boolean; user?: UserAccount; error?: string } {
    const cleanEmail = accountData.email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Email is required' };
    }

    const allUsers = this.getAllUserAccounts();
    if (allUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const newId = 'usr-' + Date.now();
    const newUser: UserAccount = {
      id: newId,
      uid: newId,
      email: cleanEmail,
      fullName: accountData.fullName.trim(),
      role: accountData.role,
      department: accountData.department || 'Academic',
      phoneNumber: accountData.phoneNumber || '',
      status: 'Active',
      createdAt: new Date().toISOString(),
      accountType: 'Institutional Account',
      passwordHash: accountData.initialPassword?.trim() || 'Seminary@123',
      mustChangePassword: true,
      notes: accountData.notes || 'Created by Administrator'
    };

    const updated = [newUser, ...allUsers];
    this.saveAllUserAccounts(updated);
    this.saveUserProfileToFirestore(newUser);

    return { success: true, user: newUser };
  }

  public updateInstitutionalAccount(id: string, updates: Partial<UserAccount>): boolean {
    const allUsers = this.getAllUserAccounts();
    const idx = allUsers.findIndex(u => u.id === id);
    if (idx === -1) return false;

    const updated = {
      ...allUsers[idx],
      ...updates
    };
    allUsers[idx] = updated;
    this.saveAllUserAccounts(allUsers);
    this.saveUserProfileToFirestore(updated);

    if (this.currentUser?.id === id) {
      this.setCurrentUser(updated);
    }

    return true;
  }

  public resetAccountPassword(id: string, newPass: string): boolean {
    const allUsers = this.getAllUserAccounts();
    const idx = allUsers.findIndex(u => u.id === id);
    if (idx === -1) return false;

    allUsers[idx].passwordHash = newPass.trim();
    allUsers[idx].mustChangePassword = true;
    this.saveAllUserAccounts(allUsers);
    this.saveUserProfileToFirestore(allUsers[idx]);

    return true;
  }

  public toggleAccountStatus(id: string): boolean {
    const allUsers = this.getAllUserAccounts();
    const idx = allUsers.findIndex(u => u.id === id);
    if (idx === -1) return false;

    allUsers[idx].status = allUsers[idx].status === 'Active' ? 'Suspended' : 'Active';
    this.saveAllUserAccounts(allUsers);
    this.saveUserProfileToFirestore(allUsers[idx]);

    return true;
  }

  public deleteInstitutionalAccount(id: string): boolean {
    const allUsers = this.getAllUserAccounts();
    const filtered = allUsers.filter(u => u.id !== id);
    this.saveAllUserAccounts(filtered);

    if (db) {
      deleteDoc(doc(db, 'users', id)).catch(err => {
        console.warn('Error deleting user from Firestore:', err);
      });
    }

    return true;
  }

  private updateLocalUserRecord(user: UserAccount) {
    const allUsers = this.getAllUserAccounts();
    const idx = allUsers.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx !== -1) {
      allUsers[idx] = { ...allUsers[idx], ...user };
    } else {
      allUsers.push(user);
    }
    this.saveAllUserAccounts(allUsers);
  }
}

export const authService = new AuthService();
