import React from 'react';
import { Calendar, Users, GraduationCap, Award, Globe, Shield } from 'lucide-react';
import { WebsiteSettings } from '../../../types';

interface StatsSectionProps {
  settings: WebsiteSettings;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ settings }) => {
  const statsData = [
    {
      icon: Calendar,
      value: settings.stats.yearsOfFormation || '50+',
      label: 'Years of Gospel Formation',
      subtext: 'Established in 1976'
    },
    {
      icon: GraduationCap,
      value: settings.stats.graduatesCount || '1,500+',
      label: 'Graduates in Ministry',
      subtext: 'Pastors, leaders & missionaries'
    },
    {
      icon: Award,
      value: settings.stats.academicProgramsCount || '20+',
      label: 'Academic Programs',
      subtext: 'Certificates to Doctorates'
    },
    {
      icon: Users,
      value: settings.stats.facultyCount || '30+',
      label: 'Resident Faculty & Mentors',
      subtext: 'Experienced pastor-scholars'
    },
    {
      icon: Globe,
      value: settings.stats.countriesReached || '20+',
      label: 'Countries Reached',
      subtext: 'Global kingdom impact'
    }
  ];

  return (
    <section 
      aria-label="Institutional Highlights"
      className="bg-slate-900 border-y border-slate-800 text-white relative z-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {statsData.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="flex flex-col items-start p-4 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all duration-300 group"
              >
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 group-hover:text-amber-300 transition-colors mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-none mb-1">
                  {item.value}
                </span>
                <span className="text-xs font-bold text-slate-200 leading-tight mb-1">
                  {item.label}
                </span>
                <span className="text-[11px] text-slate-400">
                  {item.subtext}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
