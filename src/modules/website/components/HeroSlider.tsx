import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen, GraduationCap, Pause, Play } from 'lucide-react';
import { HeroSlide } from '../../../types';

interface HeroSliderProps {
  slides: HeroSlide[];
  onNavigate: (route: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ slides, onNavigate }) => {
  const activeSlides = slides.filter(s => s.isActive).sort((a, b) => a.order - b.order);
  const validSlides = activeSlides.length > 0 ? activeSlides : [
    {
      id: 'fallback-1',
      eyebrow: 'THEOLOGICAL EDUCATION FOR A LIFE OF PURPOSE',
      title: 'Prepare Your Mind. Strengthen Your Faith. Serve Your Calling.',
      description: 'Receive rigorous theological training, practical ministry preparation and spiritual formation in a community committed to serving Christ and the world.',
      imageUrl: '',
      primaryButtonText: 'EXPLORE PROGRAMS',
      primaryButtonLink: '/programs',
      secondaryButtonText: 'APPLY NOW',
      secondaryButtonLink: '/apply',
      order: 1,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const timerRef = useRef<any>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % validSlides.length);
  }, [validSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + validSlides.length) % validSlides.length);
  }, [validSlides.length]);

  // Auto-advance timer (6 seconds)
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  const currentSlide = validSlides[currentIndex] || validSlides[0];

  return (
    <section 
      aria-label="Seminary Hero Showcase"
      className="relative w-full h-[78vh] min-h-[500px] max-h-[760px] lg:h-[82vh] bg-slate-950 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Background Images with smooth crossfade */}
      {validSlides.map((slide, idx) => {
        const isCurrent = idx === currentIndex;
        return (
          <div
            key={slide.id || idx}
            aria-hidden={!isCurrent}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000 ease-out"
              referrerPolicy="no-referrer"
            />
            {/* Light, clean vignette & subtle gradient for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-slate-950/20 sm:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          </div>
        );
      })}

      {/* Slide Content Frame */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-3xl pt-4 pb-14 sm:pt-8 sm:pb-16">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs font-bold font-mono tracking-wider sm:tracking-widest uppercase mb-3 sm:mb-6 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-full">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="truncate">{currentSlide.eyebrow}</span>
          </div>

          {/* Large Headline */}
          <h1 className="font-serif font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] mb-3 sm:mb-6 drop-shadow-md animate-in fade-in slide-in-from-bottom-3 duration-700">
            {currentSlide.title}
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-base md:text-xl text-slate-200 font-normal leading-relaxed mb-6 sm:mb-8 max-w-2xl drop-shadow-xs animate-in fade-in slide-in-from-bottom-4 duration-800 line-clamp-3 sm:line-clamp-none">
            {currentSlide.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-4 animate-in fade-in slide-in-from-bottom-5 duration-900">
            <button
              onClick={() => onNavigate(currentSlide.primaryButtonLink || '/programs')}
              className="w-full xs:w-auto px-5 py-3 sm:px-6 sm:py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide rounded-xl shadow-xl hover:shadow-amber-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 shrink-0" />
              <span className="truncate">{currentSlide.primaryButtonText || 'EXPLORE PROGRAMS'}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            </button>

            <button
              onClick={() => onNavigate(currentSlide.secondaryButtonLink || '/apply')}
              className="w-full xs:w-auto px-5 py-3 sm:px-6 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm tracking-wide rounded-xl border border-white/25 backdrop-blur-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-white/40 active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="truncate">{currentSlide.secondaryButtonText || 'APPLY NOW'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slider Bottom Navigation Bar */}
      <div className="absolute bottom-3 sm:bottom-6 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Slide Indicator & Numbers */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="font-mono text-[11px] sm:text-xs font-bold text-amber-400 tracking-wider">
              {String(currentIndex + 1).padStart(2, '0')} <span className="text-slate-500">/</span> {String(validSlides.length).padStart(2, '0')}
            </div>

            {/* Dots / Progress Bars */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {validSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex 
                      ? 'w-6 sm:w-8 bg-amber-400 shadow-xs' 
                      : 'w-1.5 sm:w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Auto-play pause toggle */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Left / Right Chevron Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer active:scale-90"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer active:scale-90"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
