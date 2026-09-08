import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ChevronDown, GraduationCap, BookOpen, ShieldCheck, 
  ExternalLink, User, Church, Phone, ArrowRight, Sparkles 
} from 'lucide-react';
import { WebsiteSettings } from '../../../types';
import { erpService } from '../../../services/erpService';

interface WebsiteNavbarProps {
  settings?: WebsiteSettings;
  currentRoute: string;
  onNavigate: (route: string) => void;
  onEnterErp: () => void;
}

export const WebsiteNavbar: React.FC<WebsiteNavbarProps> = ({
  settings: propSettings,
  currentRoute,
  onNavigate,
  onEnterErp
}) => {
  const settings = propSettings || erpService.getWebsiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for transition from transparent to solid navy
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close resources dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHome = currentRoute === '/';
  const navBg = isHome && !isScrolled
    ? 'bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-950/40 text-white border-transparent'
    : 'bg-[#0A192F]/98 backdrop-blur-md text-white border-slate-800/80 shadow-lg';

  const navLinks = [
    { label: 'Home', route: '/' },
    { label: 'About', route: '/about' },
    { label: 'Academics', route: '/programs' },
    { label: 'Admissions', route: '/admissions' },
    { label: 'Tuition & Fees', route: '/fees' },
    { label: 'Student Life', route: '/campus' },
    { label: 'Ministry', route: '/ministry' },
    { label: 'Faculty', route: '/faculty' },
    { label: 'News & Events', route: '/news' },
  ];

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 border-b ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Seminary Identity */}
          <div 
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group min-w-0 flex-1 mr-2"
            onClick={() => onNavigate('/')}
          >
            {settings.branding.logoUrl ? (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 p-1 border border-amber-400/40 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0 backdrop-blur-xs overflow-hidden">
                <img
                  src={settings.branding.logoUrl}
                  alt={settings.branding.institutionName || 'Seminary Logo'}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to cross seal
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-linear-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black text-lg sm:text-xl shadow-md ring-2 ring-amber-400/40 group-hover:scale-105 transition-transform shrink-0">
                ✝
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-serif font-black text-sm sm:text-base md:text-lg tracking-tight text-white leading-tight truncate group-hover:text-amber-300 transition-colors">
                {settings.branding.institutionName || 'Grace Theological Seminary'}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider sm:tracking-widest text-amber-400/90 font-mono truncate hidden xs:block">
                {settings.branding.motto || 'Veritas • Pietas • Missio'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = currentRoute === link.route || (link.route !== '/' && currentRoute.startsWith(link.route));
              return (
                <button
                  key={link.route}
                  onClick={() => onNavigate(link.route)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    active 
                      ? 'text-amber-400 bg-amber-500/15 font-bold shadow-xs' 
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* Resources Dropdown */}
            <div className="relative" ref={resourcesRef}>
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                  resourcesOpen ? 'text-amber-400 bg-white/10' : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>Resources</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`} />
              </button>

              {resourcesOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Institutional Services
                  </div>
                  <button
                    onClick={() => { onNavigate('/library'); setResourcesOpen(false); }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-amber-300 flex items-center gap-2.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Theological Library</span>
                  </button>
                  <button
                    onClick={() => { onNavigate('/verify'); setResourcesOpen(false); }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-amber-300 flex items-center gap-2.5 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Verify Credentials</span>
                  </button>
                  <button
                    onClick={() => { onNavigate('/gallery'); setResourcesOpen(false); }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-amber-300 flex items-center gap-2.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Campus Gallery</span>
                  </button>
                  <button
                    onClick={() => { onNavigate('/faq'); setResourcesOpen(false); }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-amber-300 flex items-center gap-2.5 transition-colors"
                  >
                    <Church className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admissions & FAQs</span>
                  </button>
                  <div className="my-1 border-t border-slate-800" />
                  <button
                    onClick={() => { onNavigate('/contact'); setResourcesOpen(false); }}
                    className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-amber-300 flex items-center gap-2.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Contact & Location</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action CTAs (Desktop) */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Student & Staff Portal Login */}
            <button
              onClick={() => onNavigate('/login')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Portal Login</span>
            </button>

            {/* Apply Now Primary CTA */}
            <button
              onClick={() => onNavigate('/apply')}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-amber-500/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger & Quick CTA (Always visible on Phone) */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => onNavigate('/apply')}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-amber-500 to-amber-600 active:scale-95 text-slate-950 text-xs font-black rounded-xl shadow-xs transition-transform flex items-center gap-1 cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl text-white bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/15 transition-colors shrink-0 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Full Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 sm:top-20 bottom-0 z-50 bg-[#0A192F]/98 backdrop-blur-2xl border-t border-slate-800/80 overflow-y-auto px-4 py-5 text-slate-100 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-md mx-auto space-y-4">
            {/* Quick action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onNavigate('/apply');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl text-center text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Apply for Admission</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-center text-xs border border-white/15 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>Student Portal</span>
              </button>
            </div>

            {/* Primary Navigation Links */}
            <div className="bg-slate-900/90 rounded-2xl p-2 border border-slate-800/80 space-y-0.5">
              <div className="px-3 py-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                Seminary Navigation
              </div>
              {navLinks.map((link) => {
                const isActive = currentRoute === link.route || (link.route !== '/' && currentRoute.startsWith(link.route));
                return (
                  <button
                    key={link.route}
                    onClick={() => {
                      onNavigate(link.route);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-between transition-colors ${
                      isActive 
                        ? 'text-amber-300 bg-amber-500/15 font-bold' 
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                  </button>
                );
              })}
            </div>

            {/* Quick Institutional Tools */}
            <div className="bg-slate-900/90 rounded-2xl p-2 border border-slate-800/80">
              <div className="px-3 py-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                Services & Campus Life
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  onClick={() => { onNavigate('/library'); setMobileMenuOpen(false); }}
                  className="p-2.5 rounded-xl bg-slate-950/80 text-slate-200 hover:bg-slate-800 flex items-center gap-2 border border-slate-800/60"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Theological Library</span>
                </button>
                <button
                  onClick={() => { onNavigate('/verify'); setMobileMenuOpen(false); }}
                  className="p-2.5 rounded-xl bg-slate-950/80 text-slate-200 hover:bg-slate-800 flex items-center gap-2 border border-slate-800/60"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Verify Certificate</span>
                </button>
                <button
                  onClick={() => { onNavigate('/gallery'); setMobileMenuOpen(false); }}
                  className="p-2.5 rounded-xl bg-slate-950/80 text-slate-200 hover:bg-slate-800 flex items-center gap-2 border border-slate-800/60"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Campus Gallery</span>
                </button>
                <button
                  onClick={() => { onNavigate('/contact'); setMobileMenuOpen(false); }}
                  className="p-2.5 rounded-xl bg-slate-950/80 text-slate-200 hover:bg-slate-800 flex items-center gap-2 border border-slate-800/60"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Contact Admissions</span>
                </button>
              </div>
            </div>

            {/* Switch to ERP Portal Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  onEnterErp();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Switch to Seminary Management ERP</span>
              </button>
            </div>

            {/* Direct Phone / WhatsApp Inquiry */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-[11px] text-slate-300">
                Need phone assistance? Call{' '}
                <a href={`tel:${settings.contact.phone || '+254700000000'}`} className="text-amber-400 font-bold underline">
                  {settings.contact.phone || '+254 700 000 000'}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
