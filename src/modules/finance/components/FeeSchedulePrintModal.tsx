import React from 'react';
import { X, Printer, Download, Building, ShieldCheck, Check } from 'lucide-react';
import { FeeStructure, SystemSettings } from '../../../types';

interface FeeSchedulePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  fee: FeeStructure | null;
  settings: SystemSettings;
}

export const FeeSchedulePrintModal: React.FC<FeeSchedulePrintModalProps> = ({
  isOpen,
  onClose,
  fee,
  settings
}) => {
  if (!isOpen || !fee) return null;

  const currency = fee.currency || 'KES';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Top Control Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-sm text-white">
              Official Seminary Fee Schedule Document
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="p-8 sm:p-12 text-slate-900 bg-white" id="printable-fee-schedule">
          {/* Institutional Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-6 mb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.institutionName}
                  className="w-16 h-16 object-contain rounded-xl border border-slate-200 p-1"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-serif font-black text-2xl">
                  G
                </div>
              )}
              <div>
                <h1 className="font-serif font-black text-2xl tracking-tight text-slate-950">
                  {settings.institutionName || 'Grace Theological Seminary'}
                </h1>
                <p className="text-xs text-slate-600 font-medium">{settings.tagline || 'Rooted in Scripture, Trained for Ministry'}</p>
                <p className="text-[11px] text-slate-500 mt-1">{settings.address || 'P.O. Box 45012-00100, Nairobi, Kenya'} • {settings.email || 'admissions@gracetheo.edu'}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded-lg font-mono text-[11px] font-bold text-slate-800">
                OFFICIAL SCHEDULE
              </span>
              <p className="text-[10px] text-slate-500 mt-1">Ref: {fee.id.toUpperCase()}</p>
            </div>
          </div>

          {/* Title and Academic Parameters */}
          <div className="mb-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Academic Program</span>
                <h2 className="font-serif font-bold text-xl text-slate-900">{fee.programName || fee.name}</h2>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Academic Period</span>
                <p className="font-mono font-bold text-sm text-slate-900">{fee.academicYear} • {fee.semester}</p>
              </div>
            </div>

            <div className="text-xs text-slate-600">
              <strong>Approved By:</strong> Seminary Board of Trustees & Academic Senate for all matriculated students.
            </div>
          </div>

          {/* Detailed Itemized Table */}
          <div className="mb-6 overflow-hidden rounded-xl border border-slate-300">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Description of Fee / Service</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Amount ({currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr>
                  <td className="py-3 px-4 font-mono font-bold">1</td>
                  <td className="py-3 px-4 font-bold">Tuition Fee (Core Lectures & Credits)</td>
                  <td className="py-3 px-4 text-slate-500">Academic Instruction</td>
                  <td className="py-3 px-4 font-mono font-bold text-right">{fee.tuitionFee.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold">2</td>
                  <td className="py-3 px-4">Registration & Matriculation Fee</td>
                  <td className="py-3 px-4 text-slate-500">Administration</td>
                  <td className="py-3 px-4 font-mono font-bold text-right">{fee.registrationFee.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold">3</td>
                  <td className="py-3 px-4">Theological Library & Digital Subscriptions</td>
                  <td className="py-3 px-4 text-slate-500">Research Facilities</td>
                  <td className="py-3 px-4 font-mono font-bold text-right">{fee.libraryFee.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold">4</td>
                  <td className="py-3 px-4">Examinations & External Moderation</td>
                  <td className="py-3 px-4 text-slate-500">Assessment</td>
                  <td className="py-3 px-4 font-mono font-bold text-right">{fee.examinationFee.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold">5</td>
                  <td className="py-3 px-4">Chapel Ministry & Student Welfare Guild</td>
                  <td className="py-3 px-4 text-slate-500">Spiritual Life</td>
                  <td className="py-3 px-4 font-mono font-bold text-right">{fee.activityFee.toLocaleString()}</td>
                </tr>
                {fee.hostelFee && fee.hostelFee > 0 ? (
                  <tr>
                    <td className="py-3 px-4 font-mono font-bold">6</td>
                    <td className="py-3 px-4">Campus Residential Hall / Dormitory</td>
                    <td className="py-3 px-4 text-slate-500">Housing & Boarding</td>
                    <td className="py-3 px-4 font-mono font-bold text-right">{fee.hostelFee.toLocaleString()}</td>
                  </tr>
                ) : null}

                {/* Custom items */}
                {fee.customItems && fee.customItems.map((ci, idx) => (
                  <tr key={ci.id} className="bg-amber-50/40">
                    <td className="py-3 px-4 font-mono font-bold">{7 + idx}</td>
                    <td className="py-3 px-4 font-semibold text-amber-950">{ci.name}</td>
                    <td className="py-3 px-4 text-amber-800">{ci.category || 'Specialized'}</td>
                    <td className="py-3 px-4 font-mono font-bold text-right">{ci.amount.toLocaleString()}</td>
                  </tr>
                ))}

                <tr className="bg-slate-100 font-bold text-sm">
                  <td colSpan={3} className="py-4 px-4 text-right uppercase tracking-wider text-slate-900">
                    Total Semester Billable Amount:
                  </td>
                  <td className="py-4 px-4 font-mono text-base font-black text-slate-950 text-right">
                    {currency} {fee.totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footnotes & Payment Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-slate-600 mb-8">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="block text-slate-900 font-bold mb-1">Fee Payment Policies:</strong>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                <li>All fees must be cleared by the 4th week of the semester.</li>
                <li>Installment arrangements require approval from the Finance Dean.</li>
                <li>Receipts are automatically issued upon M-Pesa or Bank confirmation.</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="block text-slate-900 font-bold mb-1">Official Payment Bank Details:</strong>
              <p>Bank: Standard Chartered / KCB Bank</p>
              <p>Account Name: Grace Theological Seminary</p>
              <p>M-Pesa Paybill: <strong>400200</strong> (A/C: Student ID)</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="border-b border-slate-400 w-48 mx-auto mb-2" />
              <p className="font-bold text-slate-900">Rev. Prof. John Owen, Ph.D.</p>
              <p className="text-[10px] text-slate-500">Seminary Academic Dean</p>
            </div>
            <div>
              <div className="border-b border-slate-400 w-48 mx-auto mb-2" />
              <p className="font-bold text-slate-900">Mrs. Jane Wanjiru, CPA(K)</p>
              <p className="text-[10px] text-slate-500">Chief Finance Officer / Bursar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
