import React from 'react';
import { 
  Phone, Mail, MapPin, ExternalLink, ShieldCheck, 
  GraduationCap, BookOpen, Heart, ArrowRight 
} from 'lucide-react';
import { WebsiteSettings } from '../../../types';
import { erpService } from '../../../services/erpService';

interface WebsiteFooterProps {
  settings?: WebsiteSettings;
  onNavigate: (route: string) => void;
  onEnterErp?: () => void;
}

export const WebsiteFooter: React.FC<WebsiteFooterProps> = ({ settings: propSettings, onNavigate }) => {
  const settings = propSettings || erpService.getWebsiteSettings();
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => onNavigate('/')}>
              {settings.branding.logoUrl ? (
                <div className="w-11 h-11 rounded-xl bg-white/10 p-1 border border-amber-400/40 flex items-center justify-center shadow-md overflow-hidden shrink-0">
                  <img
                    src={settings.branding.logoUrl}
                    alt={settings.branding.institutionName}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shrink-0">
                  ✝
                </div>
              )}
              <div>
                <h3 className="font-serif font-bold text-lg text-white leading-tight">
                  {settings.branding.institutionName}
                </h3>
                <p className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  {settings.branding.motto}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-sm">
              An international center for classical theological education, rigorous biblical scholarship, and spiritual formation committed to equipping faithful shepherds for the global church.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.contact.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Academic Programs */}
          <div>
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Academic Programs
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('/programs/prog-5')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Doctor of Ministry (D.Min.)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/programs/prog-4')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Master of Divinity (M.Div.)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/programs/prog-3')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Bachelor of Theology (B.Th.)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/programs/prog-2')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Diploma in Pastoral Ministry
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/programs/prog-1')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Certificate in Christian Theology
                </button>
              </li>
              <li className="pt-1">
                <button onClick={() => onNavigate('/programs')} className="text-amber-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer">
                  <span>View All 20+ Programs</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Admissions & Aid */}
          <div>
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Admissions & Aid
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('/apply')} className="hover:text-amber-400 transition-colors text-left cursor-pointer font-bold text-amber-300">
                  Online Application Form
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/requirements')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Admission Requirements
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/fees')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Tuition & Fee Structure
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admissions')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Scholarships & Aid
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/faq')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Admissions FAQs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/verify')} className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verify Academic Credentials</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus & Community */}
          <div>
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Campus & Community
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  About Our Seminary
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/faculty')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Faculty & Leadership
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/ministry')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Ministry Formation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/news')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  News & Campus Events
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Contact Admissions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} {settings.branding.institutionName}. All rights reserved.
          </p>

          <div className="font-serif italic text-amber-400/80 text-xs tracking-wider">
            Soli Deo Gloria • Sola Scriptura • Sola Gratia
          </div>
        </div>
      </div>
    </footer>
  );
};
