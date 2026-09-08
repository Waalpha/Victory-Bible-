import React, { useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { WebsiteSettings } from '../../../types';
import { erpService } from '../../../services/erpService';

interface TopAnnouncementBarProps {
  settings?: WebsiteSettings;
  onNavigate: (route: string) => void;
}

export const TopAnnouncementBar: React.FC<TopAnnouncementBarProps> = ({ settings: propSettings, onNavigate }) => {
  const [dismissed, setDismissed] = useState(false);
  const settings = propSettings || erpService.getWebsiteSettings();

  if (!settings?.announcementBarEnabled || dismissed) {
    return null;
  }

  return (
    <aside 
      aria-label="Important Announcement"
      className="bg-linear-to-r from-amber-700 via-amber-600 to-amber-700 text-white text-xs font-semibold py-1.5 px-3 sm:py-2 sm:px-4 relative z-50 border-b border-amber-500/40 shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 text-center flex-wrap sm:flex-nowrap min-w-0">
          <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-100 shrink-0">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-200" />
            Announcement
          </span>
          <span className="text-amber-50 font-medium text-[11px] sm:text-xs truncate max-w-[260px] xs:max-w-xs sm:max-w-none">
            {settings.announcementText || '2027 Admissions Now Open — Apply Today for Degree, Diploma & Certificate Programs'}
          </span>
          <button
            onClick={() => onNavigate(settings.announcementLink || '/apply')}
            className="inline-flex items-center gap-0.5 underline underline-offset-2 sm:underline-offset-4 hover:text-amber-200 font-bold ml-1 transition-colors group cursor-pointer text-[11px] sm:text-xs shrink-0"
          >
            <span>{settings.announcementLinkText || 'APPLY NOW'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
