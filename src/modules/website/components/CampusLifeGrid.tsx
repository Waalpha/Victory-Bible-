import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CampusLifeGridProps {
  onNavigate: (route: string) => void;
}

export const CampusLifeGrid: React.FC<CampusLifeGridProps> = ({ onNavigate }) => {
  const items = [
    {
      title: 'Covenant Chapel',
      subtitle: 'Daily morning devotions, praise, and communion services',
      imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=800',
      category: 'Spiritual Life',
      colSpan: 'lg:col-span-8'
    },
    {
      title: 'Theological Library',
      subtitle: '25,000+ volumes, ancient commentaries, and digital study suites',
      imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
      category: 'Scholarship',
      colSpan: 'lg:col-span-4'
    },
    {
      title: 'Academic Lecture Halls',
      subtitle: 'Interactive seminars fostering vigorous exegetical inquiry',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
      category: 'Academics',
      colSpan: 'lg:col-span-4'
    },
    {
      title: 'Residential Hostels & Fellowship',
      subtitle: 'Luther & Calvin residential halls nurturing lifelong ministerial brotherhood',
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
      category: 'Community',
      colSpan: 'lg:col-span-4'
    },
    {
      title: 'Sports, Recreation & Dining',
      subtitle: 'Healthy body, sound mind, fellowship meals, and community sports leagues',
      imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800',
      category: 'Student Life',
      colSpan: 'lg:col-span-4'
    }
  ];

  return (
    <section className="py-20 bg-slate-100 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
              Campus Environment
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
              A Community Rooted in Grace and Scholarship
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mt-2">
              Our scenic campus provides a peaceful setting dedicated to focused study, vibrant worship, and lifelong community bonds.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/campus')}
            className="px-5 py-2.5 bg-white border border-slate-300 hover:border-amber-500 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-xs"
          >
            <span>Explore Campus Life</span>
            <ArrowRight className="w-4 h-4 text-amber-600" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl h-72 ${item.colSpan} shadow-md`}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              
              <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 mb-1">
                  {item.category}
                </span>
                <h3 className="font-serif font-bold text-xl text-white mb-1 group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-300 text-xs line-clamp-2 max-w-xl">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
