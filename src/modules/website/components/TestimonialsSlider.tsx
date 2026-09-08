import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Testimonial } from '../../../types';

interface TestimonialsSliderProps {
  testimonials: Testimonial[];
}

export const TestimonialsSlider: React.FC<TestimonialsSliderProps> = ({ testimonials }) => {
  const activeList = testimonials.filter(t => t.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (activeList.length === 0) return null;

  const current = activeList[currentIndex] || activeList[0];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + activeList.length) % activeList.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeList.length);
  };

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-3">
            Voices of Our Alumni
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-white tracking-tight">
            Transformed to Serve the Global Church
          </h2>
        </div>

        {/* Featured Testimonial Card */}
        <div className="max-w-4xl mx-auto bg-slate-800/90 rounded-3xl p-8 sm:p-12 border border-slate-700/80 shadow-2xl relative">
          <Quote className="w-12 h-12 text-amber-500/30 absolute top-8 left-8 sm:left-12 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <img
              src={current.photoUrl}
              alt={current.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-amber-500/30 shrink-0 shadow-lg"
              referrerPolicy="no-referrer"
            />

            <div className="flex-1">
              <div className="flex items-center justify-center md:justify-start gap-1 mb-3 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <blockquote className="font-serif italic text-lg sm:text-xl text-slate-100 leading-relaxed mb-6">
                "{current.testimonial}"
              </blockquote>

              <div>
                <h4 className="font-serif font-bold text-lg text-white">
                  {current.name}
                </h4>
                <p className="text-xs font-semibold text-amber-400">
                  {current.currentRole}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {current.program} • Class of {current.graduationYear}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/60">
            <div className="text-xs font-mono text-slate-400">
              Testimonial {currentIndex + 1} of {activeList.length}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous Testimonial"
                className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Testimonial"
                className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
