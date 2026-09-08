import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, Search, Bell, Shield, ExternalLink, Globe, Database, 
  ChevronDown, MapPin, Calendar, CheckCircle2, User, Sparkles, X, ShieldCheck,
  LogOut, KeyRound, Lock
} from 'lucide-react';
import { UserRole, UserAccount } from '../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  institutionName: string;
  onNavigatePublic: (page: string) => void;
  onOpenFirestoreSync: () => void;
  onNavigateModule?: (module: string) => void;
  currentUser?: UserAccount | null;
  onOpenProfileModal?: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onToggleSidebar, 
  userRole, 
  onRoleChange, 
  institutionName,
  onNavigatePublic,
  onOpenFirestoreSync,
  onNavigateModule
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [showSessionDropdown, setShowSessionDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentCampus, setCurrentCampus] = useState('Main Campus — Nairobi');
  const [currentSession, setCurrentSession] = useState('2026/2027 — Sem 1');

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const campusRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
      if (campusRef.current && !campusRef.current.contains(event.target as Node)) {
        setShowCampusDropdown(false);
      }
      if (sessionRef.current && !sessionRef.current.contains(event.target as Node)) {
        setShowSessionDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: UserRole[] = [
    'SUPER_ADMIN', 'ADMIN'
  ];

  const notifications = [
    { id: 1, title: '5 Admission applications pending review', time: '12m ago', unread: true },
    { id: 2, title: 'Fee collection batch reconciled: $3,200', time: '1h ago', unread: true },
    { id: 3, title: 'Chapel attendance reached 95.4% today', time: '3h ago', unread: false },
    { id: 4, title: 'Certificate #CERT-2026-00124 generated', time: '5h ago', unread: false }
  ];

  return (
    <header className="h-16 sm:h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Branding & Campus Selector */}
      <div className="flex items-center space-x-2 sm:space-x-3.5 min-w-0">
        <button 
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden transition-colors shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 tracking-tight leading-tight truncate">
              {institutionName || 'Victory International'}
            </h2>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60 shrink-0">
              Seminary ERP
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate hidden xs:block">
            Theological Education & Ministry Management ERP
          </p>
        </div>
      </div>

      {/* Center / Right: Search & Actions */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 shrink-0">
        {/* Mobile View Public Website Button */}
        <button 
          onClick={() => onNavigatePublic('/')}
          className="p-2 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl flex md:hidden items-center justify-center transition-colors border border-amber-200/80 shrink-0"
          title="View Public Seminary Website"
          aria-label="View Public Seminary Website"
        >
          <Globe className="w-4 h-4 text-amber-600" />
        </button>
        {/* Campus Switcher */}
        <div className="relative hidden 2xl:block" ref={campusRef}>
          <button
            onClick={() => setShowCampusDropdown(!showCampusDropdown)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate max-w-[140px]">{currentCampus}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showCampusDropdown && (
            <div className="absolute left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Campus
              </div>
              {['Main Campus — Nairobi', 'Online Seminary Extension', 'Rift Valley Regional Campus'].map(c => (
                <button
                  key={c}
                  onClick={() => {
                    setCurrentCampus(c);
                    setShowCampusDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                    currentCampus === c ? 'text-amber-700 bg-amber-50/70 font-bold' : 'text-slate-700'
                  }`}
                >
                  <span>{c}</span>
                  {currentCampus === c && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Academic Session Selector */}
        <div className="relative hidden xl:block" ref={sessionRef}>
          <button
            onClick={() => setShowSessionDropdown(!showSessionDropdown)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{currentSession}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showSessionDropdown && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Academic Session
              </div>
              {['2026/2027 — Sem 1', '2026/2027 — Sem 2', '2025/2026 — Sem 2'].map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setCurrentSession(s);
                    setShowSessionDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                    currentSession === s ? 'text-blue-700 bg-blue-50/70 font-bold' : 'text-slate-700'
                  }`}
                >
                  <span>{s}</span>
                  {currentSession === s && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global search */}
        <div className="hidden lg:flex items-center relative w-56 xl:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search students, courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
          <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-200/70 rounded">
            ⌘K
          </kbd>
        </div>

        {/* Public portal quick actions */}
        <div className="hidden md:flex items-center space-x-1.5 border-r border-slate-200/80 pr-2.5">
          <button 
            onClick={() => onNavigatePublic('/')}
            className="px-2.5 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer border border-amber-200/80"
            title="View Public Seminary Website"
          >
            <Globe className="w-3.5 h-3.5 text-amber-600" />
            <span>Public Website</span>
          </button>
          <button 
            onClick={() => onNavigatePublic('/verify')}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Verify Cert</span>
          </button>
          <button 
            onClick={() => onNavigatePublic('/apply')}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
            <span>Apply Online</span>
          </button>
        </div>

        {/* Super Admin Customize Website Quick Access */}
        {userRole === 'SUPER_ADMIN' && onNavigateModule && (
          <button
            onClick={() => onNavigateModule('website-cms')}
            title="Super Admin: Customize Public Website, Logo & Content"
            className="flex items-center space-x-1.5 px-3 py-2 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Customize Website</span>
          </button>
        )}

        {/* Cloud Firestore Push / Sync button */}
        <button
          onClick={onOpenFirestoreSync}
          title="Cloud Firestore Database Sync Center"
          className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors ring-1 ring-slate-800"
        >
          <Database className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="hidden sm:inline">Push to Firestore</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            aria-label="View notifications"
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-900">Institutional Alerts</p>
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  2 unread
                </span>
              </div>
              <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3 text-xs hover:bg-slate-50 transition-colors ${n.unread ? 'bg-amber-50/30' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-medium ${n.unread ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>{n.title}</p>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <span className="text-[11px] font-semibold text-amber-700 hover:underline cursor-pointer">
                  View All Seminary Notifications
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Premium Administrator Profile Control */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center space-x-2.5 p-1.5 pr-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center shadow-xs">
              {userRole.substring(0, 2)}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-slate-900 leading-none">
                {userRole === 'SUPER_ADMIN' ? 'Dean of Administration' : userRole.replace('_', ' ')}
              </span>
              <span className="block text-[10px] font-semibold text-amber-700 font-mono mt-0.5">
                {userRole}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 max-h-[30rem] overflow-y-auto animate-in fade-in zoom-in-95">
              {/* Account summary */}
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <p className="text-xs font-bold text-slate-900">Dr. David Muchiri</p>
                <p className="text-[11px] text-slate-500 truncate">davmuchiri48@gmail.com</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-semibold text-emerald-700">Authenticated • Cloud Firestore Live</span>
                </div>
              </div>

              {/* Role Switcher */}
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Active Role</p>
              </div>
              <div className="py-1">
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setShowProfileDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-1.5 text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                      userRole === r ? 'text-amber-700 bg-amber-50/60 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>{r.replace('_', ' ')}</span>
                    {userRole === r && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
