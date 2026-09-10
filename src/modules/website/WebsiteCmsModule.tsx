import React, { useState, useEffect } from 'react';
import { 
  Globe, Sparkles, Image as ImageIcon, Save, CheckCircle2, Eye, Plus, 
  Trash2, Edit3, ArrowRight, Bell, Share2, MapPin, Phone, Mail, 
  Calendar, Newspaper, MessageSquare, BookOpen, GraduationCap, 
  Award, Shield, ExternalLink, RefreshCw, Upload
} from 'lucide-react';
import { LogoUploader } from '../../components/LogoUploader';
import { WebsiteCustomizerModal } from './components/WebsiteCustomizerModal';
import { erpService } from '../../services/erpService';
import { firestoreSyncService } from '../../services/firestoreSync';
import { brandingService, getInstitutionId } from '../../services/brandingService';
import { 
  WebsiteSettings, HeroSlide, NewsArticle, PublicEvent, Testimonial 
} from '../../types';

const PRESET_HERO_PHOTOS = [
  { name: 'Library & Scriptures', url: 'https://images.unsplash.com/photo-1548625361-195fe57e937d?auto=format&fit=crop&q=80&w=1920' },
  { name: 'Chapel Sanctuary', url: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&q=80&w=1920' },
  { name: 'Open Bible Study', url: 'https://images.unsplash.com/photo-1507842229451-79731e71a802?auto=format&fit=crop&q=80&w=1920' },
  { name: 'Graduation Hall', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1920' },
  { name: 'Worship Service', url: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=1920' }
];

interface WebsiteCmsModuleProps {
  onNavigatePublic?: (route: string) => void;
}

export const WebsiteCmsModule: React.FC<WebsiteCmsModuleProps> = ({ onNavigatePublic }) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'announcements' | 'hero' | 'stats' | 'contact' | 'news' | 'events' | 'testimonials'>('branding');
  
  const [settings, setSettings] = useState<WebsiteSettings>(() => erpService.getWebsiteSettings());
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => erpService.getHeroSlides());
  const [newsList, setNewsList] = useState<NewsArticle[]>(() => erpService.getNewsArticles());
  const [eventsList, setEventsList] = useState<PublicEvent[]>(() => erpService.getPublicEvents());
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(() => erpService.getTestimonials());
  const [isQuickDrawerOpen, setIsQuickDrawerOpen] = useState(false);

  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [editingEvent, setEditingEvent] = useState<PublicEvent | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Requirement 4: Load the logo and branding from Firestore when the page loads
  useEffect(() => {
    let isMounted = true;
    const loadFromFirestore = async () => {
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
        const remoteSlides = await erpService.fetchHeroSlidesFromFirestore();
        if (isMounted && remoteSlides && remoteSlides.length > 0) {
          setHeroSlides(remoteSlides);
        }
      } catch (err) {
        console.warn('Could not load website data from Firestore:', err);
      }
    };

    loadFromFirestore();
    return () => {
      isMounted = false;
    };
  }, []);

  const showSuccess = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3500);
  };

  // Save general website settings
  const handleSaveSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    erpService.saveWebsiteSettings(settings);
    
    // Also mirror institutionName and logoUrl to system settings
    const currentSys = erpService.getSettings();
    erpService.updateSettings({
      ...currentSys,
      institutionName: settings.branding.institutionName,
      tagline: settings.branding.tagline,
      logoUrl: settings.branding.logoUrl,
      address: settings.contact.address,
      phone: settings.contact.phone,
      email: settings.contact.email
    });

    erpService.logAction('admin@gracetheo.edu', 'SUPER_ADMIN', 'Updated public website settings & branding', 'Website CMS');
    showSuccess('Website settings, logo, and branding saved successfully!');
  };

  // Hero slide handlers
  const handleSaveSlide = (slide: HeroSlide) => {
    let updated: HeroSlide[];
    const exists = heroSlides.some(s => s.id === slide.id);
    if (exists) {
      updated = heroSlides.map(s => s.id === slide.id ? slide : s);
    } else {
      updated = [...heroSlides, slide];
    }
    setHeroSlides(updated);
    erpService.saveHeroSlides(updated);
    setEditingSlide(null);
    showSuccess('Hero slide saved!');
  };

  const handleDeleteSlide = (id: string) => {
    const updated = heroSlides.filter(s => s.id !== id);
    setHeroSlides(updated);
    erpService.saveHeroSlides(updated);
    showSuccess('Slide deleted.');
  };

  // News handlers
  const handleSaveArticle = (article: NewsArticle) => {
    let updated: NewsArticle[];
    const exists = newsList.some(n => n.id === article.id);
    if (exists) {
      updated = newsList.map(n => n.id === article.id ? article : n);
    } else {
      updated = [article, ...newsList];
    }
    setNewsList(updated);
    erpService.saveNewsArticles(updated);
    setEditingArticle(null);
    showSuccess('Article updated!');
  };

  const handleDeleteArticle = (id: string) => {
    const updated = newsList.filter(n => n.id !== id);
    setNewsList(updated);
    erpService.saveNewsArticles(updated);
    showSuccess('Article deleted.');
  };

  // Event handlers
  const handleSaveEvent = (evt: PublicEvent) => {
    let updated: PublicEvent[];
    const exists = eventsList.some(e => e.id === evt.id);
    if (exists) {
      updated = eventsList.map(e => e.id === evt.id ? evt : e);
    } else {
      updated = [...eventsList, evt];
    }
    setEventsList(updated);
    erpService.savePublicEvents(updated);
    setEditingEvent(null);
    showSuccess('Event updated!');
  };

  const handleDeleteEvent = (id: string) => {
    const updated = eventsList.filter(e => e.id !== id);
    setEventsList(updated);
    erpService.savePublicEvents(updated);
    showSuccess('Event deleted.');
  };

  // Testimonial handlers
  const handleSaveTestimonial = (item: Testimonial) => {
    let updated: Testimonial[];
    const exists = testimonialsList.some(t => t.id === item.id);
    if (exists) {
      updated = testimonialsList.map(t => t.id === item.id ? item : t);
    } else {
      updated = [...testimonialsList, item];
    }
    setTestimonialsList(updated);
    erpService.saveTestimonials(updated);
    setEditingTestimonial(null);
    showSuccess('Testimonial updated!');
  };

  const handleDeleteTestimonial = (id: string) => {
    const updated = testimonialsList.filter(t => t.id !== id);
    setTestimonialsList(updated);
    erpService.saveTestimonials(updated);
    showSuccess('Testimonial removed.');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Globe className="w-3.5 h-3.5" />
            <span>Public Website Content Management System</span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
            Institutional Website & Branding Studio
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Upload your official seminary seal/logo, edit hero banners, announcements, academic stats, campus details, and publish theological news or conferences.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setIsQuickDrawerOpen(true)}
            className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-2 border border-amber-500/40 transition-colors shadow-xs cursor-pointer"
            title="Open quick slide-out customizer drawer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Quick Customizer</span>
          </button>

          {onNavigatePublic && (
            <button
              onClick={() => onNavigatePublic('/')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors shadow-xs cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Preview Public Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}

          <button
            onClick={() => handleSaveSettings()}
            className="px-5 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Notification toast */}
      {savedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-2xl flex items-center justify-between text-xs font-bold shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{savedNotice}</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-mono">Synced to Firebase</span>
        </div>
      )}

      {/* CMS Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'branding'
              ? 'bg-[#0A192F] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Logo & Identity</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-[#0A192F] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Announcement Bar</span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'hero'
              ? 'bg-[#0A192F] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Hero Carousel ({heroSlides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-[#0A192F] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Institutional Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-[#0A192F] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Campus & Contact</span>
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'news'
              ? 'bg-[#0A192F] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>News & Articles ({newsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'events'
              ? 'bg-[#0A192F] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Public Events ({eventsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('testimonials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'testimonials'
              ? 'bg-[#0A192F] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Testimonials ({testimonialsList.length})</span>
        </button>
      </div>

      {/* TAB 1: LOGO & BRANDING */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
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

          <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-serif font-bold text-lg text-slate-900">Institutional Identity & Motto</h3>
              <p className="text-xs text-slate-500">Configure how the institution is titled across headers, diplomas, and official documents.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-2">Full Institution Name</label>
                <input
                  type="text"
                  required
                  value={settings.branding.institutionName}
                  onChange={(e) => setSettings({
                    ...settings,
                    branding: { ...settings.branding, institutionName: e.target.value }
                  })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
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
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Institutional Motto (e.g. Latin / Biblical)</label>
                <input
                  type="text"
                  required
                  value={settings.branding.motto}
                  onChange={(e) => setSettings({
                    ...settings,
                    branding: { ...settings.branding, motto: e.target.value }
                  })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Primary Brand Color (Deep Navy)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.branding.primaryColor || '#0A192F'}
                    onChange={(e) => setSettings({
                      ...settings,
                      branding: { ...settings.branding, primaryColor: e.target.value }
                    })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={settings.branding.primaryColor}
                    onChange={(e) => setSettings({
                      ...settings,
                      branding: { ...settings.branding, primaryColor: e.target.value }
                    })}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Accent Brand Color (Warm Gold)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.branding.accentColor || '#D97706'}
                    onChange={(e) => setSettings({
                      ...settings,
                      branding: { ...settings.branding, accentColor: e.target.value }
                    })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={settings.branding.accentColor}
                    onChange={(e) => setSettings({
                      ...settings,
                      branding: { ...settings.branding, accentColor: e.target.value }
                    })}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>Save Branding & Identity</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: ANNOUNCEMENT BAR */}
      {activeTab === 'announcements' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">Top Header Announcement Bar</h3>
              <p className="text-xs text-slate-500">Highlighted banner that sits above the primary website navigation.</p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-xs font-bold text-slate-700">Bar Enabled:</span>
              <div 
                onClick={() => setSettings({ ...settings, announcementBarEnabled: !settings.announcementBarEnabled })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.announcementBarEnabled ? 'bg-amber-600' : 'bg-slate-300'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.announcementBarEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </div>
            </label>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-2">Announcement Message</label>
              <input
                type="text"
                required
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                placeholder="2027 Admissions Now Open — Apply Today for Degree, Diploma & Certificate Programs"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-2">Call to Action Text</label>
                <input
                  type="text"
                  required
                  value={settings.announcementLinkText}
                  onChange={(e) => setSettings({ ...settings, announcementLinkText: e.target.value })}
                  placeholder="APPLY NOW"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Destination Link</label>
                <input
                  type="text"
                  required
                  value={settings.announcementLink}
                  onChange={(e) => setSettings({ ...settings, announcementLink: e.target.value })}
                  placeholder="/apply"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            {/* Live Bar Preview */}
            <div className="pt-4">
              <label className="block font-bold text-slate-700 mb-2">Live Bar Preview</label>
              <div className="bg-linear-to-r from-amber-700 via-amber-600 to-amber-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-between shadow-xs">
                <div className="flex-1 flex items-center justify-center gap-2 flex-wrap">
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-amber-100">
                    Announcement
                  </span>
                  <span>{settings.announcementText || '2027 Admissions Open'}</span>
                  <span className="underline font-bold ml-1 flex items-center gap-1">
                    {settings.announcementLinkText || 'APPLY NOW'}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Save Announcement Bar</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: HERO CAROUSEL */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">Homepage Hero Slides</h3>
              <p className="text-xs text-slate-500">The premier visual carousel displayed on the seminary homepage.</p>
            </div>
            <button
              onClick={() => setEditingSlide({
                id: 'slide-' + Date.now(),
                eyebrow: 'CLASSICAL THEOLOGICAL EDUCATION',
                title: 'Faithful to Scripture. Equipped for Ministry.',
                description: 'Rigorous biblical scholarship, confessional integrity, and spiritual mentorship for shepherds of the global church.',
                imageUrl: 'https://images.unsplash.com/photo-1548625361-195fe57e937d?auto=format&fit=crop&q=80&w=1920',
                primaryButtonText: 'Explore Programs',
                primaryButtonLink: '/programs',
                secondaryButtonText: 'Apply for 2027',
                secondaryButtonLink: '/apply',
                order: heroSlides.length + 1,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              })}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Slide</span>
            </button>
          </div>

          {/* Modal / Inline Editor for Slide */}
          {editingSlide && (
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-serif font-bold text-base text-amber-400">Edit Hero Slide</h4>
                <button
                  onClick={() => setEditingSlide(null)}
                  className="text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Eyebrow / Badge Text</label>
                  <input
                    type="text"
                    value={editingSlide.eyebrow}
                    onChange={(e) => setEditingSlide({ ...editingSlide, eyebrow: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Order / Sequence</label>
                  <input
                    type="number"
                    value={editingSlide.order}
                    onChange={(e) => setEditingSlide({ ...editingSlide, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Main Headline</label>
                  <input
                    type="text"
                    value={editingSlide.title}
                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-serif text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingSlide.description}
                    onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="block font-bold text-slate-300">Hero Slide Photo & Background Image</label>
                  
                  {/* Thumbnail Preview */}
                  {editingSlide.imageUrl && (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                      <img 
                        src={editingSlide.imageUrl} 
                        alt="Hero Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1548625361-195fe57e937d?auto=format&fit=crop&q=80&w=1920'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                        <span className="text-[11px] font-semibold text-amber-300 bg-black/60 px-2 py-0.5 rounded-md">Active Slide Background Photo</span>
                      </div>
                    </div>
                  )}

                  {/* Upload File / Drag & Drop */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl border border-dashed border-slate-600 cursor-pointer font-bold text-xs transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo from Computer (PNG, JPG, WebP)</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && editingSlide) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                let width = img.width;
                                let height = img.height;
                                const maxWidth = 1200;
                                if (width > maxWidth) {
                                  height = Math.round((height * maxWidth) / width);
                                  width = maxWidth;
                                }
                                canvas.width = width;
                                canvas.height = height;
                                const ctx = canvas.getContext('2d');
                                if (ctx) {
                                  ctx.drawImage(img, 0, 0, width, height);
                                  const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
                                  setEditingSlide({ ...editingSlide, imageUrl: compressedDataUrl });
                                }
                              };
                              img.src = event.target?.result as string;
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Preset Selector */}
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-400 mb-1.5">Or choose from theological presets:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {PRESET_HERO_PHOTOS.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setEditingSlide({ ...editingSlide, imageUrl: preset.url })}
                          className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                            editingSlide.imageUrl === preset.url 
                              ? 'border-amber-500 bg-amber-500/20 text-white' 
                              : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <div className="w-full h-12 rounded bg-slate-900 overflow-hidden mb-1">
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="block text-[10px] font-medium truncate">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual URL input fallback */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Or paste direct image URL:</label>
                    <input
                      type="url"
                      value={editingSlide.imageUrl}
                      onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    value={editingSlide.primaryButtonText}
                    onChange={(e) => setEditingSlide({ ...editingSlide, primaryButtonText: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Primary Button Link</label>
                  <input
                    type="text"
                    value={editingSlide.primaryButtonLink}
                    onChange={(e) => setEditingSlide({ ...editingSlide, primaryButtonLink: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Secondary Button Text</label>
                  <input
                    type="text"
                    value={editingSlide.secondaryButtonText}
                    onChange={(e) => setEditingSlide({ ...editingSlide, secondaryButtonText: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Secondary Button Link</label>
                  <input
                    type="text"
                    value={editingSlide.secondaryButtonLink}
                    onChange={(e) => setEditingSlide({ ...editingSlide, secondaryButtonLink: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSlide(editingSlide)}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Save Slide
                </button>
              </div>
            </div>
          )}

          {/* Slides List */}
          <div className="grid grid-cols-1 gap-4">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col md:flex-row items-center justify-between p-4 gap-4"
              >
                <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).src = 'https://images.unsplash.com/photo-1548625361-195fe57e937d?auto=format&fit=crop&q=80&w=240';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase">
                        Slide {idx + 1}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{slide.eyebrow}</span>
                    </div>
                    <h4 className="font-serif font-bold text-slate-900 text-sm truncate mt-1">{slide.title}</h4>
                    <p className="text-xs text-slate-500 truncate max-w-md">{slide.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <button
                    onClick={() => setEditingSlide(slide)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit Slide"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STATS */}
      {activeTab === 'stats' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif font-bold text-lg text-slate-900">Institutional Impact Numbers</h3>
            <p className="text-xs text-slate-500">Key metrics displayed on the public website homepage proof banner.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-2">Years of Theological Formation</label>
              <input
                type="text"
                value={settings.stats.yearsOfFormation}
                onChange={(e) => setSettings({
                  ...settings,
                  stats: { ...settings.stats, yearsOfFormation: e.target.value }
                })}
                placeholder="50+"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">Total Conferred Graduates</label>
              <input
                type="text"
                value={settings.stats.graduatesCount}
                onChange={(e) => setSettings({
                  ...settings,
                  stats: { ...settings.stats, graduatesCount: e.target.value }
                })}
                placeholder="1,500+"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">Degree & Certificate Programs</label>
              <input
                type="text"
                value={settings.stats.academicProgramsCount}
                onChange={(e) => setSettings({
                  ...settings,
                  stats: { ...settings.stats, academicProgramsCount: e.target.value }
                })}
                placeholder="20+"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">Faculty & Theological Scholars</label>
              <input
                type="text"
                value={settings.stats.facultyCount}
                onChange={(e) => setSettings({
                  ...settings,
                  stats: { ...settings.stats, facultyCount: e.target.value }
                })}
                placeholder="30+"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">Nations & Mission Fields Reached</label>
              <input
                type="text"
                value={settings.stats.countriesReached}
                onChange={(e) => setSettings({
                  ...settings,
                  stats: { ...settings.stats, countriesReached: e.target.value }
                })}
                placeholder="20+"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Save Impact Statistics</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 5: CAMPUS & CONTACT */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif font-bold text-lg text-slate-900">Campus Location, Hours & Social Media</h3>
            <p className="text-xs text-slate-500">Contact coordinates displayed on the footer and public /contact directory.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-2">Campus Physical Address</label>
              <input
                type="text"
                required
                value={settings.contact.address}
                onChange={(e) => setSettings({
                  ...settings,
                  contact: { ...settings.contact, address: e.target.value }
                })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">Main Phone Numbers</label>
              <input
                type="text"
                required
                value={settings.contact.phone}
                onChange={(e) => setSettings({
                  ...settings,
                  contact: { ...settings.contact, phone: e.target.value }
                })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">Admissions & General Email</label>
              <input
                type="email"
                required
                value={settings.contact.email}
                onChange={(e) => setSettings({
                  ...settings,
                  contact: { ...settings.contact, email: e.target.value }
                })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">Registrar Office Hours</label>
              <input
                type="text"
                required
                value={settings.contact.officeHours}
                onChange={(e) => setSettings({
                  ...settings,
                  contact: { ...settings.contact, officeHours: e.target.value }
                })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">Facebook Page URL</label>
              <input
                type="url"
                value={settings.socialLinks.facebook || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                })}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">YouTube Channel URL</label>
              <input
                type="url"
                value={settings.socialLinks.youtube || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                })}
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">LinkedIn Page URL</label>
              <input
                type="url"
                value={settings.socialLinks.linkedin || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, linkedin: e.target.value }
                })}
                placeholder="https://linkedin.com/school/..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Save Contact Coordinates</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 6: NEWS & ARTICLES */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">Theological News & Publications</h3>
              <p className="text-xs text-slate-500">Publish articles, institutional press releases, faculty research, and theological essays.</p>
            </div>
            <button
              onClick={() => setEditingArticle({
                id: 'art-' + Date.now(),
                title: 'New Theological Publication',
                slug: 'new-theological-publication',
                category: 'Academic',
                author: 'Faculty of Theology',
                date: new Date().toISOString().split('T')[0],
                readTime: '5 min read',
                featuredImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
                summary: 'Brief overview of the theological treatise or institutional development.',
                content: 'Full content of the theological article or faculty release goes here.',
                isFeatured: false,
                published: true
              })}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create News Article</span>
            </button>
          </div>

          {editingArticle && (
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-serif font-bold text-base text-amber-400">Edit News Article</h4>
                <button
                  onClick={() => setEditingArticle(null)}
                  className="text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Article Headline</label>
                  <input
                    type="text"
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-serif text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Institutional News">Institutional News</option>
                    <option value="Academic">Academic</option>
                    <option value="Ministry">Ministry</option>
                    <option value="Student Life">Student Life</option>
                    <option value="Events">Events</option>
                    <option value="Research">Research</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Author Name / Department</label>
                  <input
                    type="text"
                    value={editingArticle.author}
                    onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Featured Banner Image URL</label>
                  <input
                    type="url"
                    value={editingArticle.featuredImage}
                    onChange={(e) => setEditingArticle({ ...editingArticle, featuredImage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Summary / Excerpt</label>
                  <textarea
                    rows={2}
                    value={editingArticle.summary}
                    onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Full Article Text</label>
                  <textarea
                    rows={6}
                    value={editingArticle.content}
                    onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveArticle(editingArticle)}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Save Article
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsList.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase">
                      {art.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{art.date}</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-slate-900 line-clamp-2">{art.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-3">{art.summary}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">By {art.author}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingArticle(art)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(art.id)}
                      className="p-1.5 text-rose-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: PUBLIC EVENTS */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">Conferences, Chapels & Seminary Events</h3>
              <p className="text-xs text-slate-500">Public academic symposiums, revival weeks, and commencement ceremonies.</p>
            </div>
            <button
              onClick={() => setEditingEvent({
                id: 'evt-' + Date.now(),
                title: 'Annual Bible & Theological Conference',
                date: '2026-10-20',
                time: '9:00 AM – 4:00 PM',
                venue: 'Covenant Chapel Auditorium',
                category: 'Conference',
                description: 'Keynote lectures and workshops led by international theologians.',
                imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
                registrationLink: '/apply',
                isUpcoming: true
              })}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Event</span>
            </button>
          </div>

          {editingEvent && (
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-serif font-bold text-base text-amber-400">Edit Public Event</h4>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Event Title</label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-serif text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Time</label>
                  <input
                    type="text"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    placeholder="9:30 AM – 1:00 PM"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Venue / Hall</label>
                  <input
                    type="text"
                    value={editingEvent.venue}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    placeholder="Covenant Chapel / Campus Auditorium"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={editingEvent.category}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Conference">Conference</option>
                    <option value="Chapel">Chapel</option>
                    <option value="Admissions">Admissions Open Day</option>
                    <option value="Lecture">Theological Lecture</option>
                    <option value="Graduation">Graduation & Ordination</option>
                    <option value="Seminar">Pastoral Seminar</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Image Banner URL</label>
                  <input
                    type="url"
                    value={editingEvent.imageUrl}
                    onChange={(e) => setEditingEvent({ ...editingEvent, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Registration or Info Link</label>
                  <input
                    type="text"
                    value={editingEvent.registrationLink || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, registrationLink: e.target.value })}
                    placeholder="/apply or https://..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveEvent(editingEvent)}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Save Event
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventsList.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-900 px-2.5 py-0.5 rounded-full uppercase">
                      {evt.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">{evt.date}</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-slate-900">{evt.title}</h4>
                  <div className="text-xs text-slate-500 font-medium">
                    📍 {evt.venue} • 🕒 {evt.time}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{evt.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-md">
                    Upcoming
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingEvent(evt)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="p-1.5 text-rose-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">Alumni Voices & Student Testimonials</h3>
              <p className="text-xs text-slate-500">Shepherd testimonies showing ministry impact and classical theological training.</p>
            </div>
            <button
              onClick={() => setEditingTestimonial({
                id: 't-' + Date.now(),
                name: 'Pastor / Graduate Name',
                graduationYear: '2024',
                program: 'Master of Divinity (M.Div.)',
                currentRole: 'Senior Pastor, Grace Community Church',
                testimonial: 'Grace Seminary grounded my theology in biblical truth and pastoral tenderness. My flock benefits every single Sunday.',
                photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
                order: testimonialsList.length + 1,
                isActive: true
              })}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Testimonial</span>
            </button>
          </div>

          {editingTestimonial && (
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-serif font-bold text-base text-amber-400">Edit Testimonial</h4>
                <button
                  onClick={() => setEditingTestimonial(null)}
                  className="text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Full Name & Title</label>
                  <input
                    type="text"
                    value={editingTestimonial.name}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Current Ministry Role / Church</label>
                  <input
                    type="text"
                    value={editingTestimonial.currentRole}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, currentRole: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Program Studied</label>
                  <input
                    type="text"
                    value={editingTestimonial.program}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, program: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Class / Graduation Year</label>
                  <input
                    type="text"
                    value={editingTestimonial.graduationYear}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, graduationYear: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Portrait Photo URL</label>
                  <input
                    type="url"
                    value={editingTestimonial.photoUrl}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, photoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Testimonial Quote</label>
                  <textarea
                    rows={4}
                    value={editingTestimonial.testimonial}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, testimonial: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveTestimonial(editingTestimonial)}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Save Testimonial
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonialsList.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{t.testimonial}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.photoUrl}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      onError={(e) => {
                        (e.target as any).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                      }}
                    />
                    <div>
                      <div className="font-serif font-bold text-xs text-slate-900">{t.name}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{t.currentRole}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingTestimonial(t)}
                      className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Super Admin Quick Customizer Drawer */}
      <WebsiteCustomizerModal
        isOpen={isQuickDrawerOpen}
        onClose={() => setIsQuickDrawerOpen(false)}
        onSettingsUpdated={(newSettings) => setSettings(newSettings)}
        onEnterErp={() => setIsQuickDrawerOpen(false)}
      />
    </div>
  );
};
