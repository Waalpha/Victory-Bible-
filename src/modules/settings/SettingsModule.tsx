import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, Database, CloudUpload, Server, ShieldCheck, Loader2, Globe, ExternalLink } from 'lucide-react';
import { erpService } from '../../services/erpService';
import { firestoreSyncService } from '../../services/firestoreSync';
import { firebaseConfig } from '../../services/firebase';
import { LogoUploader } from '../../components/LogoUploader';
import { brandingService, getInstitutionId } from '../../services/brandingService';

export const SettingsModule: React.FC = () => {
  const [settings, setSettings] = useState(erpService.getSettings());
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  // Load latest branding and logo from Firestore on mount
  useEffect(() => {
    let isMounted = true;
    const loadFirestoreLogo = async () => {
      try {
        const instId = settings.institutionId || getInstitutionId(settings);
        const tenantDoc = await brandingService.fetchInstitutionWebsiteSettings(instId);
        if (isMounted && tenantDoc && tenantDoc.logoUrl !== undefined) {
          setSettings(prev => ({
            ...prev,
            logoUrl: tenantDoc.logoUrl || ''
          }));
        }
      } catch (err) {
        console.warn('Could not load logo from Firestore in SettingsModule:', err);
      }
    };
    loadFirestoreLogo();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    erpService.updateSettings(settings);

    // Sync to website settings
    const webSettings = erpService.getWebsiteSettings();
    erpService.saveWebsiteSettings({
      ...webSettings,
      branding: {
        ...webSettings.branding,
        institutionName: settings.institutionName,
        tagline: settings.tagline,
        logoUrl: settings.logoUrl
      },
      contact: {
        ...webSettings.contact,
        address: settings.address,
        phone: settings.phone,
        email: settings.email
      }
    });

    erpService.logAction('admin@gracetheo.edu', 'ADMIN', 'Updated institutional settings & logo', 'Settings');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePushFirestore = async () => {
    setSyncing(true);
    setSyncMsg(null);
    const result = await firestoreSyncService.pushAllToFirestore();
    setSyncing(false);
    if (result.success) {
      setSyncMsg(`Successfully synchronized ${result.totalDocs} documents to Cloud Firestore!`);
    } else {
      setSyncMsg(`Sync error: ${result.error}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Institutional Settings & Branding</h2>
          <p className="text-xs text-slate-500">Configure seminary name, logo, address, academic year, currency, and grading parameters.</p>
        </div>
        {saved && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 animate-fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-3xl">
        {/* Logo Uploader */}
        <LogoUploader
          currentLogoUrl={settings.logoUrl || ''}
          onLogoChange={(newUrl) => {
            setSettings({ ...settings, logoUrl: newUrl });
          }}
          institutionName={settings.institutionName}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-2">Institution Name</label>
            <input
              type="text"
              required
              value={settings.institutionName}
              onChange={e => setSettings({...settings, institutionName: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-2">Tagline / Motto</label>
            <input
              type="text"
              required
              value={settings.tagline}
              onChange={e => setSettings({...settings, tagline: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-2">Official Email</label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={e => setSettings({...settings, email: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-2">Phone Number</label>
            <input
              type="text"
              required
              value={settings.phone}
              onChange={e => setSettings({...settings, phone: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-2">Physical Address</label>
            <input
              type="text"
              required
              value={settings.address}
              onChange={e => setSettings({...settings, address: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-2">Current Academic Year</label>
            <input
              type="text"
              required
              value={settings.currentAcademicYear}
              onChange={e => setSettings({...settings, currentAcademicYear: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-2">Current Semester</label>
            <input
              type="text"
              required
              value={settings.currentSemester}
              onChange={e => setSettings({...settings, currentSemester: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-2">Institutional Currency</label>
            <input
              type="text"
              required
              value={settings.currency || 'Ksh'}
              onChange={e => setSettings({...settings, currency: e.target.value})}
              placeholder="e.g. Ksh or KES"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-[#15803D] hover:bg-[#14532D] text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition-colors shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Changes</span>
          </button>
        </div>
      </form>

      {/* Cloud Firestore Persistence Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5 max-w-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Google Cloud Firestore Database</h3>
            <p className="text-xs text-slate-500">Live cloud persistence for seminary records, students, financials, and transcripts.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 font-semibold">Firebase Project ID</span>
            <p className="font-mono font-bold text-slate-900">{firebaseConfig.projectId}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 font-semibold">Firestore Database Instance</span>
            <p className="font-mono font-bold text-slate-900 truncate">{firebaseConfig.firestoreDatabaseId}</p>
          </div>
        </div>

        {syncMsg && (
          <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncMsg}</span>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Rules deployed & active on Cloud Firestore</span>
          </div>
          <button
            type="button"
            onClick={handlePushFirestore}
            disabled={syncing}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
          >
            {syncing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Synchronizing to Firestore...</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4 text-emerald-400" />
                <span>Push All Records to Firestore</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
