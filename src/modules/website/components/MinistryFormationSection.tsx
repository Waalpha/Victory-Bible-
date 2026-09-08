import React from 'react';
import { Church, Users, Shield, Compass, HeartHandshake, BookOpen, ArrowRight } from 'lucide-react';

interface MinistryFormationSectionProps {
  onNavigate: (route: string) => void;
}

export const MinistryFormationSection: React.FC<MinistryFormationSectionProps> = ({ onNavigate }) => {
  const tracks = [
    {
      title: 'Pastoral Ministry & Preaching',
      description: 'Hands-on expository preaching labs, pastoral care counseling, liturgical leadership, and local church administration.',
      badge: 'Core Track'
    },
    {
      title: 'Missions & Church Planting',
      description: 'Cross-cultural field immersion, frontier evangelism, contextual theological studies, and church planting strategies.',
      badge: 'Field Practicum'
    },
    {
      title: 'Biblical Counseling & Care',
      description: 'Gospel-centered care for broken families, hospital clinical chaplaincy, and pastoral counseling under supervision.',
      badge: 'Clinical Care'
    },
    {
      title: 'Youth & Discipleship',
      description: 'Equipping leaders to reach generation next, campus fellowships, discipleship curriculum design, and family ministry.',
      badge: 'Discipleship'
    }
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              Ministry Formation
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-5">
              Theology That Lives in the Local Church and Mission Field
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-8">
              At Victory International Apostolic Biblical Institute, theological education is inseparable from active ministry. Every student is paired with a seasoned pastoral supervisor and placed in a partnering local church.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">300+ Supervised Ministry Hours</h4>
                  <p className="text-xs text-slate-400">Regular weekend preaching, teaching, and evangelism reports evaluated by faculty.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Annual Evangelistic Missions Week</h4>
                  <p className="text-xs text-slate-400">The entire seminary deploys across unreached areas and church plants for two weeks.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/ministry')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <span>Explore Ministry Formation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tracks.map((track, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 hover:border-amber-500/40 transition-all hover:bg-slate-800 flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 rounded-md mb-4">
                    {track.badge}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-white mb-2">
                    {track.title}
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed mb-4">
                    {track.description}
                  </p>
                </div>
                <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                  <span>View curriculum</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
