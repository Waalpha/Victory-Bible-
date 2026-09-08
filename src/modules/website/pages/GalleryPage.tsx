import React, { useState } from 'react';
import { Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryPageProps {
  onNavigate: (route: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  const images = [
    {
      url: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=1200',
      title: 'Covenant Chapel Morning Worship',
      category: 'Chapel & Worship'
    },
    {
      url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200',
      title: 'Greek Exegesis Seminar in Progress',
      category: 'Academic Life'
    },
    {
      url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200',
      title: 'Theological Library Research Stacks',
      category: 'Scholarship'
    },
    {
      url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200',
      title: 'Luther Hall Residential Courtyard',
      category: 'Campus Living'
    },
    {
      url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200',
      title: 'Community Soccer Tournament',
      category: 'Student Life'
    },
    {
      url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200',
      title: 'Annual Commencement Procession',
      category: 'Graduation'
    }
  ];

  const categories = ['ALL', 'Chapel & Worship', 'Academic Life', 'Scholarship', 'Campus Living', 'Graduation'];

  const filtered = images.filter(img => activeCategory === 'ALL' || img.category === activeCategory);

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              Visual Tour
            </div>
            <h1 className="font-serif font-black text-4xl sm:text-5xl text-white tracking-tight mb-4">
              Campus Photographic Gallery
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Explore the daily life, academic vigor, worship, and residential community at Victory International Apostolic Biblical Institute.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <div className="bg-white border-b border-slate-200 py-4 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                activeCategory === cat
                  ? 'bg-slate-900 text-amber-400'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Photos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(img)}
              className="group relative h-72 rounded-3xl overflow-hidden shadow-md cursor-pointer border border-slate-200"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <span className="text-[10px] uppercase font-bold text-amber-400 font-mono block mb-1">
                  {img.category}
                </span>
                <h4 className="font-serif font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                  {img.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-4xl w-full relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-amber-400 p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="mt-4 text-center text-white">
              <span className="text-xs text-amber-400 font-mono uppercase">{selectedImage.category}</span>
              <h3 className="font-serif font-bold text-lg mt-1">{selectedImage.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
