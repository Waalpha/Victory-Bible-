import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

interface FaqPageProps {
  onNavigate: (route: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is Victory International Apostolic Biblical Institute accredited?',
      a: 'Yes. Grace Seminary holds full institutional accreditation from the Association for Christian Theological Education in Africa (ACTEA) and is chartered by the Ministry of Education. Our degrees are recognized globally by evangelical theological networks.'
    },
    {
      q: 'What is the doctrinal position of the Seminary?',
      a: 'We are historic evangelical and reformed in our theological commitments, adhering to the absolute authority and inerrancy of Holy Scripture, the Five Solas of the Protestant Reformation, and the Lausanne Covenant for world evangelization.'
    },
    {
      q: 'Can I study while continuing full-time pastoral work?',
      a: 'Yes! We offer Modular Intensive Block sessions (one-week intensive residential modules in January and May) as well as evening and hybrid options tailored specifically for active church pastors and bivocational ministers.'
    },
    {
      q: 'What financial aid or scholarships are available?',
      a: 'Through the Grace Seminary Ministry Endowment, need-based tuition waivers covering up to 50% are awarded to full-time pastors of low-income rural churches and frontier church planters. Applications open before each semester.'
    },
    {
      q: 'Do you require knowledge of Greek and Hebrew prior to enrollment?',
      a: 'For Bachelor of Theology candidates, no prior language study is required; Greek and Hebrew are taught from foundational alphabet up. For Master of Divinity candidates, a preliminary summer grammar workshop is provided if needed.'
    },
    {
      q: 'Are on-campus hostel accommodations guaranteed for admitted students?',
      a: 'Accommodations in Luther Hall (men) and Calvin Hall (women) are allocated on a first-come, first-served basis upon receipt of the admission acceptance deposit. Ample vetted private student housing is also located within walking distance of the Karen campus.'
    }
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              Frequently Asked Questions
            </div>
            <h1 className="font-serif font-black text-4xl sm:text-5xl text-white tracking-tight mb-4">
              Answers for Prospective Students
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Find clear answers regarding admissions criteria, doctrinal commitments, accreditation, financial aid, and campus accommodations.
            </p>
          </div>
        </div>
      </section>

      {/* Accordion List */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-slate-950">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-amber-600 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-8 rounded-3xl bg-slate-900 text-white text-center border border-slate-800">
          <h3 className="font-serif font-bold text-xl text-white mb-2">Still have questions?</h3>
          <p className="text-xs text-slate-300 mb-6">Our admissions advisors are ready to walk you through any step.</p>
          <button
            onClick={() => onNavigate('/contact')}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center gap-2"
          >
            <span>Talk to Admissions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
