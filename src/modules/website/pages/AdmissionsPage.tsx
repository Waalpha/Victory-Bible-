import React from 'react';
import { 
  GraduationCap, Calendar, FileText, CheckCircle2, 
  DollarSign, ArrowRight, BookOpen, Clock, ShieldCheck 
} from 'lucide-react';
import { erpService } from '../../../services/erpService';

interface AdmissionsPageProps {
  onNavigate: (route: string) => void;
}

export const AdmissionsPage: React.FC<AdmissionsPageProps> = ({ onNavigate }) => {
  const steps = [
    {
      num: '01',
      title: 'Choose Your Degree Program',
      description: 'Review our accredited certificates, diplomas, bachelor, master, and doctoral offerings to discern the program aligned with your calling.'
    },
    {
      num: '02',
      title: 'Gather Academic & Pastoral Documents',
      description: 'Prepare high school or university transcripts, national identity card/passport, and pastoral recommendation letter from your home church.'
    },
    {
      num: '03',
      title: 'Submit Online Application Form',
      description: 'Complete our secure 10-minute online admissions form and attach your Christian faith testimony and ministry background.'
    },
    {
      num: '04',
      title: 'Faculty Interview & Acceptance',
      description: 'Participate in a brief pastoral and academic interview with our faculty admissions committee to receive your official letter of admission.'
    }
  ];

  const intakes = [
    {
      name: 'September Main Intake 2026/2027',
      status: 'Open for Applications',
      deadline: 'August 15, 2026',
      commencement: 'September 7, 2026',
      badge: 'Main Academic Term'
    },
    {
      name: 'January Intake 2027',
      status: 'Accepting Early Applications',
      deadline: 'December 10, 2026',
      commencement: 'January 11, 2027',
      badge: 'Spring Term'
    },
    {
      name: 'May Modular Intensive 2027',
      status: 'Advance Registration',
      deadline: 'April 20, 2027',
      commencement: 'May 3, 2027',
      badge: 'In-Service Pastors'
    }
  ];

  return (
    <div className="w-full bg-slate-50 text-slate-900 min-h-screen">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              Admissions Portal
            </div>
            <h1 className="font-serif font-black text-4xl sm:text-5xl text-white tracking-tight mb-4">
              Your Journey to Gospel Leadership Begins Here
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              We welcome applications from men and women possessing a sincere confession of faith in Christ and an evident calling to Christian ministry.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Step Journey */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif font-black text-3xl text-slate-950 tracking-tight mb-3">
              Simple 4-Step Application Pathway
            </h2>
            <p className="text-slate-600 text-base">
              Our streamlined admissions process helps you transition smoothly into seminary study.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group hover:border-amber-500/40 hover:shadow-lg transition-all"
              >
                <div className="font-mono font-black text-4xl text-amber-500/30 mb-3 group-hover:text-amber-500 transition-colors">
                  {step.num}
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('/apply')}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg inline-flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Proceed to Online Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Intakes and Key Dates */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
              Academic Calendar
            </div>
            <h2 className="font-serif font-black text-3xl text-slate-950 tracking-tight">
              Upcoming Enrollment Intakes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {intakes.map((intake, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 mb-4 inline-block">
                    {intake.badge}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-slate-900 mb-3">
                    {intake.name}
                  </h3>
                  <div className="space-y-2 text-xs text-slate-600 mb-6">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-400">Application Deadline:</span>
                      <span className="font-bold text-slate-800">{intake.deadline}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-400">Classes Begin:</span>
                      <span className="font-bold text-slate-800">{intake.commencement}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-400">Status:</span>
                      <span className="font-bold text-emerald-600">{intake.status}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('/apply')}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Apply for this Intake</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards to Requirements & Fees */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              onClick={() => onNavigate('/requirements')}
              className="p-8 rounded-2xl bg-amber-50/50 border border-amber-200/80 hover:border-amber-500/60 hover:shadow-md transition-all cursor-pointer group"
            >
              <FileText className="w-8 h-8 text-amber-700 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif font-bold text-xl text-slate-900 mb-2 group-hover:text-amber-800">
                Admission Requirements & Prerequisites
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Detailed entry criteria for Certificate, Diploma, Bachelor of Theology, Master of Divinity, and Doctor of Ministry programs.
              </p>
              <div className="text-xs font-bold text-amber-700 flex items-center gap-1">
                <span>View All Requirements</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div 
              onClick={() => onNavigate('/fees')}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-500/60 hover:shadow-md transition-all cursor-pointer group"
            >
              <DollarSign className="w-8 h-8 text-amber-700 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif font-bold text-xl text-slate-900 mb-2 group-hover:text-amber-800">
                Tuition & Fees Schedule
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Transparent breakdown of tuition per semester, hostel boarding rates, scholarship opportunities, and church sponsorship programs.
              </p>
              <div className="text-xs font-bold text-amber-700 flex items-center gap-1">
                <span>View Fee Schedules</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
