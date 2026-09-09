import React, { useState, useEffect } from 'react';
import { Home, BookOpen, GraduationCap, DollarSign, User, ShieldCheck } from 'lucide-react';
import { TopAnnouncementBar } from './components/TopAnnouncementBar';
import { WebsiteNavbar } from './components/WebsiteNavbar';
import { WebsiteFooter } from './components/WebsiteFooter';
import { erpService } from '../../services/erpService';
import { brandingService } from '../../services/brandingService';
import { WebsiteSettings } from '../../types';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { ApplyPage } from './pages/ApplyPage';
import { RequirementsPage } from './pages/RequirementsPage';
import { FeesPage } from './pages/FeesPage';
import { FacultyPage } from './pages/FacultyPage';
import { CampusPage } from './pages/CampusPage';
import { MinistryPage } from './pages/MinistryPage';
import { LibraryPage } from './pages/LibraryPage';
import { NewsPage } from './pages/NewsPage';
import { EventsPage } from './pages/EventsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { VerifyPage } from './pages/VerifyPage';
import { LoginPage } from './pages/LoginPage';

interface PublicWebsiteLayoutProps {
  currentPath: string;
  onNavigate: (route: string) => void;
  onEnterErp: (role?: string) => void;
}

export const PublicWebsiteLayout: React.FC<PublicWebsiteLayoutProps> = ({
  currentPath,
  onNavigate,
  onEnterErp
}) => {
  // Parse sub-route params e.g. /programs/:id or /news/:id or /apply?program=xxx
  const [route, setRoute] = useState(currentPath || '/');
  const [subParam, setSubParam] = useState<string | null>(null);
  const [settings, setSettings] = useState<WebsiteSettings>(() => erpService.getWebsiteSettings());

  // Load latest logo and branding from Firestore on mount
  useEffect(() => {
    let isMounted = true;
    brandingService.fetchInstitutionWebsiteSettings().then(tenantDoc => {
      if (isMounted && tenantDoc && tenantDoc.logoUrl !== undefined) {
        setSettings(prev => ({
          ...prev,
          branding: {
            ...prev.branding,
            logoUrl: tenantDoc.logoUrl || ''
          }
        }));
      }
    }).catch(err => {
      console.warn('Could not fetch institution logo for public website:', err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Handle route changes
    if (currentPath.startsWith('/programs/')) {
      const progId = currentPath.replace('/programs/', '');
      setRoute('/programs');
      setSubParam(progId);
    } else if (currentPath.startsWith('/news/')) {
      const artId = currentPath.replace('/news/', '');
      setRoute('/news');
      setSubParam(artId);
    } else {
      setRoute(currentPath);
      setSubParam(null);
    }
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath]);

  const handlePageNavigation = (newPath: string) => {
    onNavigate(newPath);
  };

  // If login page, render full screen without standard header/footer
  if (route === '/login') {
    return (
      <LoginPage 
        onEnterErp={onEnterErp} 
        onNavigate={handlePageNavigation} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Notification Bar */}
      <TopAnnouncementBar settings={settings} onNavigate={handlePageNavigation} />

      {/* Main Website Navigation Bar */}
      <WebsiteNavbar 
        settings={settings}
        currentRoute={route}
        onNavigate={handlePageNavigation}
        onEnterErp={() => onEnterErp('admin')}
      />

      {/* Main Page Dynamic View */}
      <main className="flex-1 w-full">
        {route === '/' && (
          <HomePage onNavigate={handlePageNavigation} />
        )}

        {route === '/about' && (
          <AboutPage onNavigate={handlePageNavigation} />
        )}

        {route === '/programs' && (
          <ProgramsPage 
            initialProgramId={subParam}
            onNavigate={handlePageNavigation} 
          />
        )}

        {route === '/admissions' && (
          <AdmissionsPage onNavigate={handlePageNavigation} />
        )}

        {route === '/apply' && (
          <ApplyPage 
            initialProgramId={subParam}
            onNavigate={handlePageNavigation} 
          />
        )}

        {route === '/requirements' && (
          <RequirementsPage onNavigate={handlePageNavigation} />
        )}

        {route === '/fees' && (
          <FeesPage onNavigate={handlePageNavigation} />
        )}

        {route === '/faculty' && (
          <FacultyPage onNavigate={handlePageNavigation} />
        )}

        {(route === '/campus' || route === '/student-life') && (
          <CampusPage onNavigate={handlePageNavigation} />
        )}

        {route === '/ministry' && (
          <MinistryPage onNavigate={handlePageNavigation} />
        )}

        {route === '/library' && (
          <LibraryPage onNavigate={handlePageNavigation} />
        )}

        {route === '/news' && (
          <NewsPage 
            initialArticleId={subParam}
            onNavigate={handlePageNavigation} 
          />
        )}

        {route === '/events' && (
          <EventsPage onNavigate={handlePageNavigation} />
        )}

        {route === '/gallery' && (
          <GalleryPage onNavigate={handlePageNavigation} />
        )}

        {route === '/contact' && (
          <ContactPage onNavigate={handlePageNavigation} />
        )}

        {route === '/faq' && (
          <FaqPage onNavigate={handlePageNavigation} />
        )}

        {route === '/verify' && (
          <VerifyPage onNavigate={handlePageNavigation} />
        )}
      </main>

      {/* Institutional Website Footer */}
      <div className="pb-16 md:pb-0">
        <WebsiteFooter 
          settings={settings}
          onNavigate={handlePageNavigation}
          onEnterErp={() => onEnterErp('admin')}
        />
      </div>

      {/* Mobile Bottom Dock Bar (Instant thumb access on phones) */}
      <nav 
        aria-label="Mobile Navigation Dock"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0A192F]/95 backdrop-blur-xl border-t border-slate-800/90 shadow-2xl px-2 py-1.5 flex items-center justify-around"
      >
        <button
          onClick={() => handlePageNavigation('/')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors cursor-pointer ${
            route === '/' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] font-bold mt-0.5">Home</span>
        </button>

        <button
          onClick={() => handlePageNavigation('/programs')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors cursor-pointer ${
            route.startsWith('/programs') ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px] font-bold mt-0.5">Academics</span>
        </button>

        {/* Center Primary Action: Apply */}
        <button
          onClick={() => handlePageNavigation('/apply')}
          className="flex flex-col items-center justify-center -mt-4 bg-gradient-to-tr from-amber-500 to-amber-600 active:scale-95 text-slate-950 p-2.5 rounded-2xl shadow-lg shadow-amber-500/25 border-2 border-[#0A192F] transition-transform cursor-pointer"
          aria-label="Apply Now"
        >
          <GraduationCap className="w-5 h-5" />
          <span className="text-[9px] font-black tracking-tight leading-none mt-0.5">Apply</span>
        </button>

        <button
          onClick={() => handlePageNavigation('/fees')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors cursor-pointer ${
            route === '/fees' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span className="text-[10px] font-bold mt-0.5">Fees</span>
        </button>

        <button
          onClick={() => handlePageNavigation('/login')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors cursor-pointer ${
            route === '/login' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[10px] font-bold mt-0.5">Portal</span>
        </button>
      </nav>
    </div>
  );
};
