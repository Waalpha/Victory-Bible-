import React from 'react';
import { BookOpen, Award, Users, Church, Heart, Globe, ArrowRight } from 'lucide-react';

interface WhyStudySectionProps {
  onNavigate: (route: string) => void;
}

export const WhyStudySection: React.FC<WhyStudySectionProps> = ({ onNavigate }) => {
  const pillars = [
    {
      icon: BookOpen,
      title: 'Biblical Authority & Depth',
      description: 'An unwavering commitment to the inerrancy, authority, and theological richness of Scripture, studied with Greek and Hebrew tools.',
      tag: 'Doctrine'
    },
    {
      icon: Award,
      title: 'Rigorous Academic Scholarship',
      description: 'Accredited degree and diploma curricula designed to challenge your mind and develop critical theological discernment.',
      tag: 'Academics'
    },
    {
      icon: Users,
      title: 'Experienced Pastor-Scholars',
      description: 'Learn directly from resident faculty who hold advanced degrees and bring decades of pastoral and church planting wisdom.',
      tag: 'Faculty'
    },
    {
      icon: Church,
      title: 'Integrated Practical Ministry',
      description: 'Ministry is not just studied in books; every student engages in local church attachments, preaching practicums, and evangelism.',
      tag: 'Practice'
    },
    {
      icon: Heart,
      title: 'Holistic Spiritual Formation',
      description: 'Daily chapel services, mentoring partnerships, and residential fellowship cultivate authentic Christlike character.',
      tag: 'Spiritual'
    },
    {
      icon: Globe,
      title: 'Global Great Commission Vision',
      description: 'Equipping men and women for cross-cultural missions, urban church planting, and theological education across Africa and the globe.',
      tag: 'Missions'
    }
  ];

  return (
    <section className="py-20 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
            Why Grace Theological Seminary
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-slate-900 tracking-tight mb-4">
            Faithful Preparation for Fruitful Gospel Ministry
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Our mission is not merely to confer academic credentials, but to cultivate faithful servants of Christ grounded in biblical truth, spiritual integrity, and ministry competence.
          </p>
        </div>

        {/* 6 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-slate-200/80 hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-slate-900 mb-3 group-hover:text-amber-800 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-amber-700 group-hover:text-amber-800">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
