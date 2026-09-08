import React from 'react';
import { Church, Compass, Users, HeartHandshake, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';

interface MinistryPageProps {
  onNavigate: (route: string) => void;
}

export const MinistryPage: React.FC<MinistryPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              Applied Theology
            </div>
            <h1 className="font-serif font-black text-4xl sm:text-5xl text-white tracking-tight mb-4">
              Ministry Formation & Practical Field Work
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              We do not produce ivory-tower theologians. From day one, your classroom learning is tested and refined through supervised field ministry in local churches and pioneer mission fields.
            </p>
          </div>
        </div>
      </section>

      {/* Main Pillars */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-2">Core Component</span>
            <h2 className="font-serif font-black text-3xl text-slate-950 mb-4">
              The 300-Hour Supervised Church Attachment
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Every candidate enrolled in Diploma, Bachelor, or Master programs is assigned to a partnering gospel church in Nairobi or rural counties. Under the direct oversight of an experienced Senior Pastor, students lead services, preach sermons, teach Sunday school, counsel parishioners, and conduct home visitations.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 mb-6">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Formal weekly ministry logbooks reviewed by our Director of Field Education</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Mid-term and final evaluative visits by resident seminary faculty</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Pastoral mentoring conferences each semester</span>
              </li>
            </ul>
            <button
              onClick={() => onNavigate('/apply')}
              className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
            >
              Apply to Begin Ministry
            </button>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=800"
              alt="Pastoral ministry in local church"
              className="w-full h-80 object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Missions Practicum */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-3 inline-block">
                Frontier Missions
              </span>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white mb-3">
                Annual Seminary Evangelistic Missions Week
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mb-6">
                Each academic year, classes are suspended for two full weeks as faculty, staff, and the entire student body deploy into unreached rural territories, pastoralist regions, and urban informal settlements. Together, we conduct open-air gospel preaching, medical outreach camps, youth seminars, and church planting surveys.
              </p>
              <div className="flex items-center gap-6 text-xs text-amber-400">
                <div><span className="font-bold text-xl block text-white">45+</span> Church Plants Supported</div>
                <div className="w-px h-8 bg-slate-700" />
                <div><span className="font-bold text-xl block text-white">12,000+</span> Persons Heard the Gospel</div>
              </div>
            </div>

            <div className="lg:col-span-4 text-center lg:text-right">
              <button
                onClick={() => onNavigate('/contact')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
              >
                Partner With Our Missions
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
