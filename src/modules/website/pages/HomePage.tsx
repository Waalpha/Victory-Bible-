import React from 'react';
import { 
  ArrowRight, BookOpen, GraduationCap, Users, Church, 
  Calendar, Award, CheckCircle2, ChevronRight, ShieldCheck, Sparkles 
} from 'lucide-react';
import { erpService } from '../../../services/erpService';
import { HeroSlider } from '../components/HeroSlider';
import { StatsSection } from '../components/StatsSection';
import { WhyStudySection } from '../components/WhyStudySection';
import { MinistryFormationSection } from '../components/MinistryFormationSection';
import { CampusLifeGrid } from '../components/CampusLifeGrid';
import { TestimonialsSlider } from '../components/TestimonialsSlider';

interface HomePageProps {
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const settings = erpService.getWebsiteSettings();
  const [slides, setSlides] = React.useState<any[]>(() => erpService.getHeroSlides());
  const programs = erpService.getPrograms();
  const news = erpService.getNewsArticles().slice(0, 3);
  const events = erpService.getPublicEvents().slice(0, 3);
  const staff = erpService.getStaff().slice(0, 4);
  const testimonials = erpService.getTestimonials();

  React.useEffect(() => {
    erpService.fetchHeroSlidesFromFirestore().then(remote => {
      if (remote && remote.length > 0) {
        setSlides(remote);
      }
    }).catch(() => {});
  }, []);

  // Featured programs
  const featuredPrograms = programs.slice(0, 4);

  return (
    <div className="w-full">
      {/* 1. Hero Section Photo Slider */}
      <HeroSlider slides={slides} onNavigate={onNavigate} />

      {/* 2. Institutional Statistics Bar */}
      <StatsSection settings={settings} />

      {/* 3. Welcome / Introduction Split Screen */}
      <section className="py-20 bg-white text-slate-900 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image Collage */}
            <div className="lg:col-span-6 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"
                  alt="Seminary Classroom Study"
                  className="w-full h-[420px] object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Overlapping Badge */}
              <div className="absolute -bottom-6 -right-6 z-20 bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 max-w-xs hidden sm:block">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    ✝
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-white">Biblically Rooted</h4>
                    <p className="text-[11px] text-amber-400">Since 1976</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Equipping students to rightly divide the Word of Truth and lead churches with integrity.
                </p>
              </div>
            </div>

            {/* Right Welcome Content */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-4">
                Welcome to Grace
              </div>
              <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-slate-950 tracking-tight leading-tight mb-6">
                Cultivating Minds. Shepherding Hearts. Transforming Nations.
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
                Victory International Apostolic Biblical Institute stands as a beacon of evangelical scholarship in Africa and beyond. For over half a century, we have remained anchored in the authority of Holy Scripture, providing deep theological study, rigorous academic degrees, and hands-on ministry apprenticeship.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed mb-8">
                Whether God is calling you to pastoral ordination, cross-cultural missions, biblical counseling, youth leadership, or theological scholarship, you will find here a praying faculty and a dedicated community walking alongside you.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('/about')}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider uppercase rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span>Our Theological Heritage</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  onClick={() => onNavigate('/admissions')}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs tracking-wider uppercase rounded-xl border border-slate-300 transition-colors cursor-pointer"
                >
                  Admissions Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Academic Programs Showcase */}
      <section className="py-20 bg-slate-50 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
                Degrees & Diplomas
              </div>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-slate-950 tracking-tight">
                Academic Programs Designed for Ministry Calling
              </h2>
              <p className="text-slate-600 text-base max-w-2xl mt-2">
                Accredited theological degrees spanning foundational certificates to advanced professional doctorates.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/programs')}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:border-amber-500 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-xs"
            >
              <span>View All Programs ({programs.length})</span>
              <ChevronRight className="w-4 h-4 text-amber-600" />
            </button>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                      {prog.awardType}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      {prog.durationYears} {prog.durationYears === 1 ? 'Year' : 'Years'}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-slate-900 mb-2 group-hover:text-amber-700 transition-colors">
                    {prog.name}
                  </h3>

                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-6">
                    {prog.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {prog.creditRequirements} Credit Hours
                  </span>
                  <button
                    onClick={() => onNavigate(`/programs/${prog.id}`)}
                    className="text-xs font-bold text-amber-700 group-hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Study With Us (6 Pillars) */}
      <WhyStudySection onNavigate={onNavigate} />

      {/* 6. Ministry Formation */}
      <MinistryFormationSection onNavigate={onNavigate} />

      {/* 7. Campus Life Photo Grid */}
      <CampusLifeGrid onNavigate={onNavigate} />

      {/* 8. Faculty Mentors Highlight */}
      <section className="py-20 bg-white text-slate-900 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
                Faculty of Scholars & Pastors
              </div>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-slate-950 tracking-tight">
                Mentorship Under Experienced Pastor-Theologians
              </h2>
              <p className="text-slate-600 text-base max-w-2xl mt-2">
                Our faculty unite world-class theological scholarship with deep pastoral hearts, mentoring you in and out of the classroom.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/faculty')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer"
            >
              <span>View Faculty Directory</span>
              <ChevronRight className="w-4 h-4 text-amber-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {staff.map((member) => (
              <div
                key={member.id}
                className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-500/40 hover:shadow-lg transition-all group"
              >
                <div className="h-56 overflow-hidden bg-slate-200">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.fullName}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-amber-400 font-serif font-black text-3xl">
                      {member.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-serif font-bold text-base text-slate-900 mb-1 group-hover:text-amber-700 transition-colors">
                    {member.fullName}
                  </h3>
                  <p className="text-xs font-semibold text-amber-700 mb-2">
                    {member.position} • {member.department}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {member.specialization} ({member.qualifications})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Testimonials Slider */}
      <TestimonialsSlider testimonials={testimonials} />

      {/* 10. News & Events Split Showcase */}
      <section className="py-20 bg-slate-50 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Latest News */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Seminary News</span>
                  <h3 className="font-serif font-black text-2xl text-slate-900">Articles & Institutional Updates</h3>
                </div>
                <button
                  onClick={() => onNavigate('/news')}
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>All News</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-6">
                {news.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onNavigate(`/news/${item.id}`)}
                    className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-500/40 hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 cursor-pointer group"
                  >
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      className="w-full sm:w-36 h-28 object-cover rounded-xl shrink-0 group-hover:scale-102 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1.5">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span className="text-slate-400 font-normal">{item.readTime}</span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-2 mb-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {item.summary}
                        </p>
                      </div>
                      <div className="text-[11px] text-slate-400 pt-2 flex items-center justify-between">
                        <span>{item.date}</span>
                        <span className="font-semibold text-amber-700 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Upcoming Events */}
            <div className="lg:col-span-5">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Calendar</span>
                  <h3 className="font-serif font-black text-2xl text-slate-900">Upcoming Events</h3>
                </div>
                <button
                  onClick={() => onNavigate('/events')}
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>All Events</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => onNavigate(`/events/${evt.id}`)}
                    className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-500/40 hover:shadow-md transition-all flex items-start gap-4 cursor-pointer group"
                  >
                    <div className="w-14 h-16 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] uppercase font-bold text-amber-700">
                        {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="font-serif font-black text-xl leading-none">
                        {new Date(evt.date).getDate()}
                      </span>
                    </div>

                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm">
                        {evt.category}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-2 mt-1 mb-1">
                        {evt.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {evt.time} • {evt.venue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Bold Call To Action Banner */}
      <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-2xl mx-auto mb-6 shadow-xl">
            ✝
          </div>

          <h2 className="font-serif font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight mb-6">
            Your Calling Deserves Faithful Preparation.
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Take the step toward deeper biblical understanding, personal holiness, and ministerial effectiveness. Admissions for the 2027 academic year are now open.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/apply')}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide rounded-xl shadow-xl hover:shadow-amber-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <GraduationCap className="w-5 h-5 text-slate-950" />
              <span>START ONLINE APPLICATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/contact')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide rounded-xl border border-white/25 backdrop-blur-md transition-all cursor-pointer"
            >
              TALK WITH ADMISSIONS ADVISOR
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
