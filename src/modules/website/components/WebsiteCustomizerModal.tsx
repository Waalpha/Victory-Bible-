import React, { useState, useEffect } from 'react';
import { 
  X, Save, CheckCircle2, Globe, Sparkles, Image as ImageIcon, 
  Bell, MapPin, Phone, Mail, Award, ExternalLink 
} from 'lucide-react';
import { LogoUploader } from '../../../components/LogoUploader';
import { erpService } from '../../../services/erpService';
import { brandingService, getInstitutionId } from '../../../services/brandingService';
import { WebsiteSettings } from '../../../types';

interface WebsiteCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsUpdated: (newSettings: WebsiteSettings) => void;
  onEnterErp?: () => void;
}

export const WebsiteCustomizerModal: React.FC<WebsiteCustomizerModalProps> = ({
  isOpen,
  onClose,
  onSettingsUpdated,
  onEnterErp
}) => {
  const [settings, setSettings] = useState<WebsiteSettings>(() => erpService.getWebsiteSettings());
  const [activeSection, setActiveSection] = useState<'logo' | 'announcement' | 'branding' | 'stats' | 'contact'>('logo');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Requirement 4: Load Firestore branding on modal open
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    const loadTenantLogo = async () => {
      try {
        const instId = settings.institutionId || getInstitutionId(settings);
        const tenantSettings = await brandingService.fetchInstitutionWebsiteSettings(instId);
        if (isMounted && tenantSettings && tenantSettings.logoUrl !== undefined) {
          setSettings(prev => ({
            ...prev,
            branding: {
              ...prev.branding,
              logoUrl: tenantSettings.logoUrl || ''
            }
          }));
        }
      } catch (err) {
        console.warn('Could not load tenant branding in modal:', err);
      }
    };
    loadTenantLogo();
    return () => { isMounted = false; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    erpService.saveWebsiteSettings(settings);

    // Synchronize to ERP settings as well
    const sys = erpService.getSettings();
    erpService.updateSettings({
      ...sys,
      institutionName: settings.branding.institutionName,
      tagline: settings.branding.tagline,
      logoUrl: settings.branding.logoUrl,
      address: settings.contact.address,
      phone: settings.contact.phone,
      email: settings.contact.email
    });

    erpService.logAction('admin@gracetheo.edu', 'SUPER_ADMIN', 'Quick customized public website', 'Website Customizer');
    onSettingsUpdated(settings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#0A192F] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-white">Super Admin Website Customizer</h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-300">Upload institution logo and edit public website configuration in real time</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onEnterErp && (
              <button
                type="button"
                onClick={onEnterErp}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-slate-700 transition-colors"
              >
                <span>Full CMS Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 px-6 py-3 bg-slate-50 border-b border-slate-200 overflow-x-auto custom-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSection('logo')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeSection === 'logo'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Upload Logo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('branding')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeSection === 'branding'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Name & Motto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('announcement')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeSection === 'announcement'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Announcement Bar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('stats')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeSection === 'stats'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Impact Stats</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('contact')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeSection === 'contact'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Campus & Contact</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {savedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Website updated and synced to Firestore! Refreshing preview...</span>
            </div>
          )}

          {/* Section: Upload Logo */}
          {activeSection === 'logo' && (
            <div className="space-y-4">
              <LogoUploader
                currentLogoUrl={settings.branding.logoUrl || ''}
                onLogoChange={(newUrl) => {
                  setSettings(prev => ({
                    ...prev,
                    branding: { ...prev.branding, logoUrl: newUrl }
                  }));
                }}
                institutionName={settings.branding.institutionName}
                institutionId={settings.institutionId || getInstitutionId(settings)}
              />
            </div>
          )}

          {/* Section: Name & Motto */}
          {activeSection === 'branding' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-2">Seminary / College Name</label>
                <input
                  type="text"
                  required
                  value={settings.branding.institutionName}
                  onChange={(e) => setSettings({
                    ...settings,
                    branding: { ...settings.branding, institutionName: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Primary Tagline</label>
                <input
                  type="text"
                  required
                  value={settings.branding.tagline}
                  onChange={(e) => setSettings({
                    ...settings,
                    branding: { ...settings.branding, tagline: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Institutional Motto</label>
                <input
                  type="text"
                  required
                  value={settings.branding.motto}
                  onChange={(e) => setSettings({
                    ...settings,
                    branding: { ...settings.branding, motto: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>
          )}

          {/* Section: Announcement */}
          {activeSection === 'announcement' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-800">Top Announcement Bar Status</div>
                  <div className="text-[11px] text-slate-500">Show or hide the alert bar above the website header</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.announcementBarEnabled}
                  onChange={(e) => setSettings({ ...settings, announcementBarEnabled: e.target.checked })}
                  className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Announcement Message</label>
                <input
                  type="text"
                  value={settings.announcementText}
                  onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                  placeholder="2027 Admissions Open..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Button Label</label>
                  <input
                    type="text"
                    value={settings.announcementLinkText}
                    onChange={(e) => setSettings({ ...settings, announcementLinkText: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Target Link</label>
                  <input
                    type="text"
                    value={settings.announcementLink}
                    onChange={(e) => setSettings({ ...settings, announcementLink: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Stats */}
          {activeSection === 'stats' && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-2">Years of Formation</label>
                <input
                  type="text"
                  value={settings.stats.yearsOfFormation}
                  onChange={(e) => setSettings({
                    ...settings,
                    stats: { ...settings.stats, yearsOfFormation: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Graduates Count</label>
                <input
                  type="text"
                  value={settings.stats.graduatesCount}
                  onChange={(e) => setSettings({
                    ...settings,
                    stats: { ...settings.stats, graduatesCount: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Programs Count</label>
                <input
                  type="text"
                  value={settings.stats.academicProgramsCount}
                  onChange={(e) => setSettings({
                    ...settings,
                    stats: { ...settings.stats, academicProgramsCount: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Faculty Count</label>
                <input
                  type="text"
                  value={settings.stats.facultyCount}
                  onChange={(e) => setSettings({
                    ...settings,
                    stats: { ...settings.stats, facultyCount: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>
            </div>
          )}

          {/* Section: Contact */}
          {activeSection === 'contact' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-2">Physical Campus Address</label>
                <input
                  type="text"
                  value={settings.contact.address}
                  onChange={(e) => setSettings({
                    ...settings,
                    contact: { ...settings.contact, address: e.target.value }
                  })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Phone</label>
                  <input
                    type="text"
                    value={settings.contact.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, phone: e.target.value }
                    })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={settings.contact.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      contact: { ...settings.contact, email: e.target.value }
                    })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Save Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Apply & Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
