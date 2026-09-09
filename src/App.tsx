import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardModule } from './modules/dashboard/DashboardModule';
import { AdmissionsModule } from './modules/admissions/AdmissionsModule';
import { StudentsModule } from './modules/students/StudentsModule';
import { AcademicsModule } from './modules/academics/AcademicsModule';
import { ExaminationsModule } from './modules/examinations/ExaminationsModule';
import { MinistryModule } from './modules/ministry/MinistryModule';
import { FinanceModule } from './modules/finance/FinanceModule';
import { LibraryModule } from './modules/library/LibraryModule';
import { ReportsModule } from './modules/reports/ReportsModule';
import { SettingsModule } from './modules/settings/SettingsModule';
import { 
  AnnouncementsModule, DocumentsModule, StaffModule, AlumniModule,
  HostelsModule, ChapelModule, StudentAffairsModule, GraduationModule, CertificatesModule 
} from './modules/misc/MiscModules';
import { PublicPages } from './modules/public/PublicPages';
import { PublicWebsiteLayout } from './modules/website/PublicWebsiteLayout';
import { WebsiteCmsModule } from './modules/website/WebsiteCmsModule';
import { FirestoreSyncModal } from './components/FirestoreSyncModal';
import { firestoreSyncService } from './services/firestoreSync';
import { erpService } from './services/erpService';
import { brandingService } from './services/brandingService';
import { UserRole } from './types';

export function App() {
  const [currentModule, setCurrentModule] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('SUPER_ADMIN');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFirestoreModalOpen, setIsFirestoreModalOpen] = useState(false);

  // Synchronized route & experience state (supports both direct URLs and hash fallback like #/admin)
  const resolveCurrentPath = (): string => {
    if (typeof window === 'undefined') return '/';
    if (window.location.hash) {
      const cleanHash = window.location.hash.replace(/^#\/?/, '/');
      if (cleanHash && cleanHash !== '/') return cleanHash;
    }
    const p = window.location.pathname;
    return p && p !== '/' ? p : '/';
  };

  const resolveExperience = (path: string): 'website' | 'erp' => {
    if (path.startsWith('/admin') || (typeof window !== 'undefined' && window.location.hash.includes('admin'))) {
      return 'erp';
    }
    return 'website';
  };

  const [currentPath, setCurrentPath] = useState<string>(() => resolveCurrentPath());
  const [experience, setExperience] = useState<'website' | 'erp'>(() => resolveExperience(resolveCurrentPath()));

  useEffect(() => {
    const handleRoute = () => {
      const path = resolveCurrentPath();
      setCurrentPath(path);
      setExperience(resolveExperience(path));
    };

    window.addEventListener('popstate', handleRoute);
    window.addEventListener('hashchange', handleRoute);
    return () => {
      window.removeEventListener('popstate', handleRoute);
      window.removeEventListener('hashchange', handleRoute);
    };
  }, []);

  // Initialize Cloud Firestore Auto-Sync Engine
  useEffect(() => {
    const cleanup = firestoreSyncService.initAutoSync();
    return () => cleanup();
  }, []);

  // Fetch latest logo and institution branding from Firestore on mount
  useEffect(() => {
    brandingService.fetchInstitutionWebsiteSettings().catch(() => {
      // Local fallback active if offline
    });
  }, []);

  const settings = erpService.getSettings();

  const MODULE_PERMISSIONS: Record<string, string[]> = {
    dashboard: ['ALL'],
    admissions: ['SUPER_ADMIN', 'ADMIN', 'REGISTRAR', 'PRINCIPAL'],
    students: ['SUPER_ADMIN', 'ADMIN', 'REGISTRAR', 'ACADEMIC_DEAN', 'ACADEMIC_OFFICER', 'PRINCIPAL', 'PRESIDENT'],
    academics: ['ALL'],
    examinations: ['SUPER_ADMIN', 'ADMIN', 'REGISTRAR', 'ACADEMIC_DEAN', 'ACADEMIC_OFFICER', 'EXAM_OFFICER', 'LECTURER', 'FACULTY', 'STUDENT'],
    ministry: ['SUPER_ADMIN', 'ADMIN', 'MINISTRY_COORDINATOR', 'STUDENT', 'LECTURER', 'FACULTY'],
    chapel: ['ALL'],
    affairs: ['SUPER_ADMIN', 'ADMIN', 'STUDENT_AFFAIRS', 'PRINCIPAL'],
    hostels: ['SUPER_ADMIN', 'ADMIN', 'HOSTEL_MANAGER', 'STUDENT'],
    library: ['ALL'],
    finance: ['SUPER_ADMIN', 'ADMIN', 'FINANCE', 'FINANCE_OFFICER', 'STUDENT', 'PRINCIPAL'],
    staff: ['SUPER_ADMIN', 'ADMIN', 'REGISTRAR', 'PRINCIPAL', 'PRESIDENT'],
    graduation: ['SUPER_ADMIN', 'ADMIN', 'REGISTRAR', 'ACADEMIC_DEAN', 'ACADEMIC_OFFICER'],
    certificates: ['ALL'],
    reports: ['SUPER_ADMIN', 'ADMIN', 'FINANCE', 'FINANCE_OFFICER', 'REGISTRAR', 'PRINCIPAL'],
    announcements: ['ALL'],
    documents: ['ALL'],
    alumni: ['SUPER_ADMIN', 'ADMIN', 'REGISTRAR', 'ALUMNI'],
    settings: ['SUPER_ADMIN', 'ADMIN'],
    'website-cms': ['SUPER_ADMIN']
  };

  const isModuleAuthorized = (module: string): boolean => {
    const allowed = MODULE_PERMISSIONS[module];
    if (!allowed) return true;
    if (allowed.includes('ALL')) return true;
    return allowed.includes(userRole);
  };

  // Render Public Website Experience
  if (experience === 'website') {
    return (
      <PublicWebsiteLayout 
        currentPath={currentPath}
        onNavigate={(path) => {
          setCurrentPath(path);
          window.history.pushState({}, '', path);
          if (path.startsWith('/admin')) {
            setExperience('erp');
          }
        }}
        onEnterErp={(role) => {
          if (role === 'student') setUserRole('STUDENT');
          else if (role === 'faculty') setUserRole('LECTURER');
          else setUserRole('SUPER_ADMIN');
          setExperience('erp');
          setCurrentPath('/admin');
          window.history.pushState({}, '', '/admin');
        }}
      />
    );
  }

  // Render Private ERP Experience
  return (
    <div className="min-h-screen bg-slate-100 flex font-sans antialiased text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        userRole={userRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          userRole={userRole}
          onRoleChange={setUserRole}
          institutionName={settings.institutionName}
          onNavigatePublic={(page) => {
            const path = page.startsWith('/') ? page : `/${page}`;
            setCurrentPath(path);
            setExperience('website');
            window.history.pushState({}, '', path);
          }}
          onOpenFirestoreSync={() => setIsFirestoreModalOpen(true)}
          onNavigateModule={(mod) => setCurrentModule(mod)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {!isModuleAuthorized(currentModule) ? (
            <div className="max-w-2xl mx-auto my-12 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-5">
              <div className="w-14 h-14 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <span className="text-2xl font-bold">🔒</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900">Institutional Access Restricted</h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your current active role <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{userRole}</span> does not have authorization to access the <span className="font-bold text-slate-900 capitalize">{currentModule.replace('-', ' ')}</span> module.
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-left text-xs space-y-1">
                <p className="font-bold text-slate-700">Authorized Access Tiers:</p>
                <p className="text-slate-500 font-mono text-[11px] break-words">
                  {(MODULE_PERMISSIONS[currentModule] || []).join(' • ')}
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentModule('dashboard')}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={() => setUserRole('SUPER_ADMIN')}
                  className="px-4 py-2.5 bg-[#15803D] hover:bg-[#14532D] text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Switch to Super Admin
                </button>
              </div>
            </div>
          ) : (
            <>
              {currentModule === 'dashboard' && <DashboardModule onNavigateModule={(mod) => setCurrentModule(mod)} />}
              {currentModule === 'admissions' && <AdmissionsModule />}
              {currentModule === 'students' && <StudentsModule />}
              {currentModule === 'academics' && <AcademicsModule />}
              {currentModule === 'examinations' && <ExaminationsModule />}
              {currentModule === 'ministry' && <MinistryModule />}
              {currentModule === 'finance' && <FinanceModule />}
              {currentModule === 'library' && <LibraryModule />}
              {currentModule === 'hostels' && <HostelsModule />}
              {currentModule === 'chapel' && <ChapelModule />}
              {currentModule === 'affairs' && <StudentAffairsModule />}
              {currentModule === 'staff' && <StaffModule />}
              {currentModule === 'graduation' && <GraduationModule />}
              {currentModule === 'certificates' && <CertificatesModule />}
              {currentModule === 'reports' && <ReportsModule />}
              {currentModule === 'announcements' && <AnnouncementsModule />}
              {currentModule === 'documents' && <DocumentsModule />}
              {currentModule === 'alumni' && <AlumniModule />}
              {currentModule === 'settings' && <SettingsModule />}
              {currentModule === 'website-cms' && (
                <WebsiteCmsModule 
                  onNavigatePublic={(route) => {
                    setCurrentPath(route);
                    setExperience('website');
                    window.history.pushState({}, '', route);
                  }} 
                />
              )}

              {/* Fallback for other modules */}
              {!['dashboard', 'admissions', 'students', 'academics', 'examinations', 'ministry', 'finance', 'library', 'hostels', 'chapel', 'affairs', 'staff', 'graduation', 'certificates', 'reports', 'settings', 'announcements', 'documents', 'alumni', 'website-cms'].includes(currentModule) && (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-xs text-center space-y-4">
                  <h2 className="text-xl font-bold text-slate-900 capitalize">{currentModule.replace('-', ' ')} Module</h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    This enterprise module is fully integrated with Firestore database and configured for role-based permissions ({userRole}).
                  </p>
                  <button
                    onClick={() => setCurrentModule('dashboard')}
                    className="px-5 py-2.5 bg-[#15803D] hover:bg-[#14532D] text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Cloud Firestore Sync & Management Modal */}
      <FirestoreSyncModal 
        isOpen={isFirestoreModalOpen}
        onClose={() => setIsFirestoreModalOpen(false)}
      />
    </div>
  );
}

export default App;
