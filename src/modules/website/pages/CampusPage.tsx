import React from 'react';
import { Sparkles, Home, Heart, Shield, Compass, BookOpen, ArrowRight } from 'lucide-react';

interface CampusPageProps {
  onNavigate: (route: string) => void;
}

export const CampusPage: React.FC<CampusPageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Sparkles,
      title: 'Daily Chapel & Spiritual Devotions',
      desc: 'At 8:30 AM every weekday, all classes pause as faculty, staff, and students gather in Covenant Chapel for corporate expository preaching, hymnody, and intercessory prayer for the nations.'
    },
    {
      icon: Home,
      title: 'Residential Halls & Brotherhood',
      desc: 'Luther Hall (men) and Calvin Hall (women) provide serene, secure on-campus living with high-speed internet, private study desks, prayer lounges, and round-the-clock security.'
    },
    {
      icon: Heart,
      title: 'Dining & Community Fellowship',
      desc: 'Shared meals in the Spurgeon Dining Hall cultivate rich lifelong friendships across diverse nations, tribes, and church backgrounds.'
    },
    {
      icon: Shield,
      title: 'Campus Health & Medical Clinic',
      desc: 'Our resident registered nurse and medical clinic provide first-aid treatment, routine health screenings, and preventative care for all resident students.'
    },
    {
      icon: Compass,
      title: 'Sports, Wellness & Recreation',
      desc: 'A dedicated soccer pitch, basketball court, volleyball net, and scenic walking trails allow students to keep their bodies sound alongside rigorous mental study.'
    },
    {
      icon: BookOpen,
      title: 'Student Guild & Theological Societies',
      desc: 'Student leadership committees organize debating societies, book clubs, outreach concerts, and community service initiatives in surrounding villages.'
    }
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              Campus & Student Life
            </div>
            <h1 className="font-serif font-black text-4xl sm:text-5xl text-white tracking-tight mb-4">
              A Praying, Vibrant Theological Community
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Living and studying at Grace Seminary is a holistic experience of spiritual growth, lifelong ministerial brotherhood, and disciplined fellowship.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:border-amber-500/40 hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-slate-950 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Daily Schedule Highlight */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">A Day in the Life</span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-950 mt-1">
              The Daily Rhythm of Spiritual & Academic Formation
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-mono font-bold text-amber-800 text-sm block mb-1">07:00 AM</span>
              <h4 className="font-bold text-slate-900 mb-1">Morning Prayer & Breakfast</h4>
              <p className="text-slate-500">Personal devotions in residence followed by dining hall fellowship.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-mono font-bold text-amber-800 text-sm block mb-1">08:30 AM</span>
              <h4 className="font-bold text-slate-900 mb-1">Covenant Chapel</h4>
              <p className="text-slate-500">All-seminary corporate worship, scripture exposition, and prayer.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-mono font-bold text-amber-800 text-sm block mb-1">09:30 AM - 01:00 PM</span>
              <h4 className="font-bold text-slate-900 mb-1">Lectures & Seminars</h4>
              <p className="text-slate-500">Rigorous coursework in biblical Greek, Hebrew, theology, and history.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-mono font-bold text-amber-800 text-sm block mb-1">02:00 PM - 05:00 PM</span>
              <h4 className="font-bold text-slate-900 mb-1">Library Research & Ministry</h4>
              <p className="text-slate-500">Focused research carrels, preaching practicums, and mentoring circles.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigate('/apply')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-md"
            >
              <span>Join Our Residential Community</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
