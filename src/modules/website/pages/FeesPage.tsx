import React, { useState } from 'react';
import { DollarSign, ShieldCheck, CheckCircle2, ArrowRight, Heart, CreditCard, Building, BookOpen, Layers, Check } from 'lucide-react';
import { erpService } from '../../../services/erpService';
import { FeeStructure } from '../../../types';

interface FeesPageProps {
  onNavigate: (route: string) => void;
}

export const FeesPage: React.FC<FeesPageProps> = ({ onNavigate }) => {
  const [feeStructures] = useState<FeeStructure[]>(() => {
    const list = erpService.getFeeStructures();
    return list.filter(f => f.publishedToWebsite !== false);
  });

  const settings = erpService.getSettings();
  const programs = erpService.getPrograms();

  // Find sample ancillary rates from first fee structure or default
  const sampleFee = feeStructures[0] || {
    currency: 'KES',
    registrationFee: 2500,
    libraryFee: 3000,
    examinationFee: 2000,
    activityFee: 1500
  };

  const curr = sampleFee.currency || 'KES';

  // Compile ancillary fees
  const ancillaryFees = [
    { item: 'Registration Fee (Per Semester)', amount: `${curr} ${(sampleFee.registrationFee || 2500).toLocaleString()}` },
    { item: 'Theological Library & Digital Database Access', amount: `${curr} ${(sampleFee.libraryFee || 3000).toLocaleString()}` },
    { item: 'Examination & Moderator Assessment', amount: `${curr} ${(sampleFee.examinationFee || 2000).toLocaleString()}` },
    { item: 'Student Welfare & Chapel Ministry Guild', amount: `${curr} ${(sampleFee.activityFee || 1500).toLocaleString()}` },
    { item: 'ICT Infrastructure & Campus High-Speed Wi-Fi', amount: `${curr} 2,000` },
    { item: 'Medical First Aid & Insurance Cover', amount: `${curr} 2,000` },
  ];

  const hostelRates = [
    { hall: 'Luther Hall (Men’s Dormitory)', occupancy: 'Shared 4-Person Room', fee: `${curr} 15,000 per semester` },
    { hall: 'Calvin Hall (Women’s Dormitory)', occupancy: 'Shared 4-Person Room', fee: `${curr} 15,000 per semester` },
    { hall: 'Spurgeon Suites (Postgraduate / Married)', occupancy: 'Private Self-Contained', fee: `${curr} 32,000 per semester` },
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              Financial Transparency & Stewardship
            </div>
            <h1 className="font-serif font-black text-4xl sm:text-5xl text-white tracking-tight mb-4">
              Tuition, Housing & Financial Aid
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              We are committed to providing affordable theological education so that financial barriers never hinder God’s servants from receiving biblical training.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-12">
        {/* Dynamic Tuition Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Board of Trustees Approved Schedule</span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-slate-950">
                Official Tuition & Fee Schedule
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Rates currently active for the 2026/2027 Academic Session
              </p>
            </div>
            <button
              onClick={() => onNavigate('/apply')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 self-start transition-colors cursor-pointer shadow-sm"
            >
              <span>Apply for Admission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-4">
            {feeStructures.length > 0 ? (
              feeStructures.map(fee => {
                const c = fee.currency || 'KES';
                return (
                  <div key={fee.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                          {fee.semester}
                        </span>
                        <h3 className="font-bold text-base text-slate-950 mt-1">
                          {fee.programName || fee.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">Total Fee</div>
                        <div className="font-mono font-black text-amber-800 text-base">
                          {c} {fee.totalAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5">
                      <div className="flex justify-between text-slate-600">
                        <span>Base Tuition:</span>
                        <span className="font-mono font-bold text-slate-800">{c} {fee.tuitionFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Ancillary & Fees:</span>
                        <span className="font-mono text-slate-700">{c} {(fee.totalAmount - fee.tuitionFee).toLocaleString()}</span>
                      </div>
                    </div>

                    {fee.customItems && fee.customItems.length > 0 && (
                      <div className="text-[11px] text-amber-800 flex flex-wrap gap-1">
                        {fee.customItems.map(ci => (
                          <span key={ci.id} className="px-2 py-0.5 bg-amber-50 rounded-md border border-amber-200 font-medium">
                            + {ci.name} ({c} {ci.amount.toLocaleString()})
                          </span>
                        ))}
                      </div>
                    )}

                    {fee.notes && (
                      <p className="text-[11px] text-slate-500 italic">
                        {fee.notes}
                      </p>
                    )}

                    <button
                      onClick={() => onNavigate('/apply')}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Apply for this Program</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                Fee schedule is currently being updated by the Bursar's Office.
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Academic Program</th>
                  <th className="py-3.5 px-4">Period / Semester</th>
                  <th className="py-3.5 px-4">Tuition Only</th>
                  <th className="py-3.5 px-4">Total Package (w/ Ancillary)</th>
                  <th className="py-3.5 px-4">Remarks & Inclusions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {feeStructures.length > 0 ? (
                  feeStructures.map(fee => {
                    const c = fee.currency || 'KES';
                    return (
                      <tr key={fee.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-900">
                          <div className="font-bold text-sm text-slate-900">
                            {fee.programName || fee.name}
                          </div>
                          {fee.customItems && fee.customItems.length > 0 && (
                            <div className="text-[10px] text-amber-700 mt-0.5 flex flex-wrap gap-1">
                              {fee.customItems.map(ci => (
                                <span key={ci.id} className="px-1.5 py-0.2 bg-amber-50 rounded border border-amber-200">
                                  + {ci.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-600">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {fee.semester}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-amber-800">
                          {c} {fee.tuitionFee.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-slate-950 text-sm">
                          {c} {fee.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-slate-500 text-[11px] max-w-xs">
                          {fee.notes || 'Full academic instruction and theological research access'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Fee schedule is currently being updated by the Bursar's Office.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ancillary and Housing Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ancillary Fees */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md">
            <h3 className="font-serif font-bold text-xl text-slate-950 mb-2">
              Semester Ancillary Fees
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Covers campus infrastructure, digital library subscriptions, student welfare, and exams.
            </p>

            <div className="space-y-3">
              {ancillaryFees.map((fee, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-slate-100 last:border-0">
                  <span className="text-slate-600">{fee.item}</span>
                  <span className="font-mono font-bold text-slate-900">{fee.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hostel Boarding Rates */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md">
            <h3 className="font-serif font-bold text-xl text-slate-950 mb-2">
              Campus Housing & Dormitories
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Secure on-campus residential halls fostering Christian fellowship, prayer, and study.
            </p>

            <div className="space-y-4">
              {hostelRates.map((h, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-serif font-bold text-sm text-slate-900">{h.hall}</h4>
                    <span className="font-mono text-xs font-bold text-amber-800">{h.fee}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{h.occupancy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scholarships and Financial Aid */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-3xl p-8 border border-amber-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-md">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-amber-950 mb-2">
                Pastoral Scholarships & Need-Based Ministry Aid
              </h3>
              <p className="text-xs text-amber-900/80 leading-relaxed mb-4 max-w-2xl">
                {settings.institutionName || 'Grace Theological Seminary'} operates a generous endowment fund supported by partner churches worldwide. Scholarships covering up to 50% of tuition are awarded each semester to full-time pastors from economically disadvantaged rural congregations and missionary church planters.
              </p>
              <button
                onClick={() => onNavigate('/contact')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Inquire About Financial Aid
              </button>
            </div>
          </div>
        </div>

        {/* Official Payment Methods */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl">
          <h3 className="font-serif font-bold text-xl text-white mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-400" />
            <span>Authorized Fee Payment Channels</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
              <span className="font-bold text-emerald-400 block uppercase tracking-wider mb-2">
                M-Pesa Mobile Paybill
              </span>
              <p className="text-slate-300 mb-1"><span className="text-slate-400">Business Number:</span> <span className="font-mono font-bold text-white">400200</span></p>
              <p className="text-slate-300 mb-1"><span className="text-slate-400">Account Number:</span> <span className="font-mono font-bold text-white">STUDENT-ID or APP-NUMBER</span></p>
              <p className="text-slate-400 text-[11px] mt-2">Instant automatic reconciliation into the Seminary ERP ledger.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
              <span className="font-bold text-blue-400 block uppercase tracking-wider mb-2">
                Bank Wire / Direct Deposit
              </span>
              <p className="text-slate-300 mb-1"><span className="text-slate-400">Bank:</span> <span className="font-bold text-white">Standard Chartered Bank / KCB</span></p>
              <p className="text-slate-300 mb-1"><span className="text-slate-400">Account Name:</span> <span className="font-bold text-white">{settings.institutionName || 'Grace Theological Seminary'}</span></p>
              <p className="text-slate-300 mb-1"><span className="text-slate-400">A/C Number:</span> <span className="font-mono font-bold text-white">0102049583900</span></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
