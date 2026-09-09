import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, UserPlus, BookOpen, GraduationCap, FileText, 
  DollarSign, Library, Home, Church, ShieldAlert, UserCheck, 
  Bell, FolderOpen, Settings, BarChart2, Layers, ChevronLeft, ChevronRight,
  Sparkles, ShieldCheck, Globe
} from 'lucide-react';
import { UserRole } from '../types';
import { erpService } from '../services/erpService';

interface SidebarProps {
  currentModule: string;
  onSelectModule: (module: string) => void;
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface MenuItemDef {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  badge?: string;
  group?: 'CORE' | 'ACADEMIC' | 'STUDENT LIFE' | 'FINANCE' | 'PEOPLE' | 'COMPLETION' | 'ADMINISTRATION';
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentModule, 
  onSelectModule, 
  userRole, 
  isOpen, 
  onClose,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse: externalOnToggleCollapse 
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalCollapsed;
  const toggleCollapse = externalOnToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const isStudent = userRole === 'STUDENT';
  const isLecturer = userRole === 'LECTURER' || userRole === 'FACULTY';

  const menuItems: MenuItemDef[] = [
    // Core
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ALL'], group: 'CORE' },
    
    // ACADEMIC
    { id: 'admissions', label: 'Admissions', icon: UserPlus, roles: ['SUPER_ADMIN', 'ADMIN', 'REGISTRAR', 'PRINCIPAL'], badge: '2', group: 'ACADEMIC' },
    { id: 'students', label: 'Student Information', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN', 'REGISTRAR', 'ACADEMIC_DEAN', 'ACADEMIC_OFFICER', 'PRINCIPAL', 'PRESIDENT'], group: 'ACADEMIC' },
    { id: 'academics', label: 'Academics & Courses', icon: BookOpen, roles: ['ALL'], group: 'ACADEMIC' },
    { id: 'examinations', label: 'Examinations & Results', icon: Layers, roles: ['SUPER_ADMIN', 'ADMIN', 'REGISTRAR', 'ACADEMIC_DEAN', 'ACADEMIC_OFFICER', 'EXAM_OFFICER', 'LECTURER', 'FACULTY', 'STUDENT'], group: 'ACADEMIC' },
    
    // STUDENT LIFE
    { id: 'ministry', label: 'Ministry Formation', icon: Church, roles: ['SUPER_ADMIN', 'ADMIN', 'MINISTRY_COORDINATOR', 'STUDENT', 'LECTURER', 'FACULTY'], badge: 'Active', group: 'STUDENT LIFE' },
    { id: 'chapel', label: 'Chapel & Spiritual', icon: Sparkles, roles: ['ALL'], group: 'STUDENT LIFE' },
    { id: 'affairs', label: 'Student Affairs & Discipline', icon: ShieldAlert, roles: ['SUPER_ADMIN', 'ADMIN', 'STUDENT_AFFAIRS', 'PRINCIPAL'], group: 'STUDENT LIFE' },
    { id: 'hostels', label: 'Hostel & Housing', icon: Home, roles: ['SUPER_ADMIN', 'ADMIN', 'HOSTEL_MANAGER', 'STUDENT'], group: 'STUDENT LIFE' },
    { id: 'library', label: 'Library Management', icon: Library, roles: ['ALL'], group: 'STUDENT LIFE' },
    
    // FINANCE
    { id: 'finance', label: 'Fees & Finance', icon: DollarSign, roles: ['SUPER_ADMIN', 'ADMIN', 'FINANCE', 'FINANCE_OFFICER', 'STUDENT', 'PRINCIPAL'], group: 'FINANCE' },
    
    // PEOPLE
    { id: 'staff', label: 'Staff & Faculty', icon: UserCheck, roles: ['SUPER_ADMIN', 'ADMIN', 'REGISTRAR', 'PRINCIPAL', 'PRESIDENT'], group: 'PEOPLE' },
    
    // COMPLETION
    { id: 'graduation', label: 'Graduation', icon: GraduationCap, roles: ['SUPER_ADMIN', 'ADMIN', 'REGISTRAR', 'ACADEMIC_DEAN', 'ACADEMIC_OFFICER'], badge: '38', group: 'COMPLETION' },
    { id: 'certificates', label: 'Certificates & Verify', icon: FileText, roles: ['ALL'], group: 'COMPLETION' },
    
    // ADMINISTRATION
    { id: 'website-cms', label: 'Website CMS & Logo', icon: Globe, roles: ['SUPER_ADMIN'], badge: 'Super Admin', group: 'ADMINISTRATION' },
    { id: 'reports', label: 'Reports Center', icon: BarChart2, roles: ['SUPER_ADMIN', 'ADMIN', 'FINANCE', 'FINANCE_OFFICER', 'REGISTRAR', 'PRINCIPAL'], group: 'ADMINISTRATION' },
    { id: 'announcements', label: 'Announcements', icon: Bell, roles: ['ALL'], group: 'ADMINISTRATION' },
    { id: 'documents', label: 'Document Repository', icon: FolderOpen, roles: ['ALL'], group: 'ADMINISTRATION' },
    { id: 'alumni', label: 'Alumni Network', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN', 'REGISTRAR', 'ALUMNI'], group: 'ADMINISTRATION' },
    { id: 'settings', label: 'System Settings', icon: Settings, roles: ['SUPER_ADMIN', 'ADMIN'], group: 'ADMINISTRATION' }
  ];

  const currentSettings = erpService.getWebsiteSettings();

  const filteredItems = menuItems.filter(item => {
    if (item.roles.includes('ALL')) return true;
    if (isStudent && ['dashboard', 'academics', 'examinations', 'ministry', 'finance', 'library', 'hostels', 'chapel', 'certificates', 'announcements', 'documents'].includes(item.id)) return true;
    if (isLecturer && ['dashboard', 'academics', 'examinations', 'ministry', 'library', 'chapel', 'announcements'].includes(item.id)) return true;
    return item.roles.includes(userRole);
  });

  const groups: Array<{ name: string; items: MenuItemDef[] }> = [];
  filteredItems.forEach(item => {
    const groupName = item.group || 'OTHER';
    let group = groups.find(g => g.name === groupName);
    if (!group) {
      group = { name: groupName, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  });

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden" onClick={onClose} />
      )}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full bg-[#0B1F17] text-slate-100 flex flex-col transition-all duration-300 ease-in-out border-r border-[#153F33]/60 shadow-2xl lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-72 w-72'}`}
      >
        {/* Brand header */}
        <div className="p-4.5 border-b border-[#153F33]/60 flex items-center justify-between bg-[#071711]">
          <div className="flex items-center space-x-3 overflow-hidden">
            {currentSettings?.branding?.logoUrl ? (
              <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 p-1 border border-emerald-500/30 flex items-center justify-center overflow-hidden shadow-inner">
                <img
                  src={currentSettings.branding.logoUrl}
                  alt={currentSettings.branding.institutionName}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-serif font-bold text-xl shadow-inner">
                ✝
              </div>
            )}
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <h1 className="font-extrabold text-sm tracking-wider text-white truncate">THEOLOGICAL ERP</h1>
                <p className="text-[11px] text-emerald-300/80 font-medium truncate flex items-center gap-1">
                  <span>Seminary & Bible College</span>
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="hidden lg:flex p-1.5 rounded-lg text-emerald-200/70 hover:text-white hover:bg-emerald-900/40 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation links grouped */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-scrollbar">
          {groups.map(grp => (
            <div key={grp.name} className="space-y-1">
              {grp.name !== 'CORE' && !isCollapsed && (
                <div className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-wider text-emerald-300/60 uppercase">
                  {grp.name}
                </div>
              )}
              {grp.name !== 'CORE' && isCollapsed && (
                <div className="my-2 border-t border-[#153F33]/60 mx-2" />
              )}
              {grp.items.map(item => {
                const Icon = item.icon;
                const isActive = currentModule === item.id;
                return (
                  <button
                    key={item.id}
                    title={isCollapsed ? item.label : undefined}
                    onClick={() => {
                      onSelectModule(item.id);
                      onClose();
                    }}
                    className={`w-full group relative flex items-center ${
                      isCollapsed ? 'justify-center px-0 py-2.5' : 'space-x-3 px-3 py-2.5'
                    } rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive 
                        ? 'bg-[#15803D] text-white font-bold shadow-sm shadow-emerald-950/40' 
                        : 'text-emerald-100/80 hover:bg-[#133327] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-white' : 'text-emerald-300/70 group-hover:text-emerald-300'
                    }`} />
                    
                    {!isCollapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive ? 'bg-[#071711] text-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip on hover when collapsed */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#0B1F17] text-white text-xs font-medium rounded-lg shadow-xl border border-emerald-800/80 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                        {item.label}
                        {item.badge && <span className="ml-1.5 text-emerald-400 font-bold">({item.badge})</span>}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer user badge */}
        <div className="p-3 border-t border-[#153F33]/60 bg-[#071711]">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-[#153F33] to-[#0B1F17] border border-[#1E5A44]/80 flex items-center justify-center font-bold text-emerald-300 text-xs shadow-inner">
              {userRole.substring(0, 2)}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[11px] font-bold text-white truncate">Theological Admin</p>
                </div>
                <p className="text-[10px] text-emerald-400/90 font-mono font-medium truncate">{userRole}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
