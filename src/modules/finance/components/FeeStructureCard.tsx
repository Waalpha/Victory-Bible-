import React, { useState } from 'react';
import { 
  Calculator, 
  Edit3, 
  Copy, 
  Trash2, 
  Receipt, 
  Printer, 
  CheckCircle2, 
  Globe, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Users,
  Check
} from 'lucide-react';
import { FeeStructure } from '../../../types';

interface FeeStructureCardProps {
  fee: FeeStructure;
  studentCount: number;
  onEdit: (fee: FeeStructure) => void;
  onDuplicate: (fee: FeeStructure) => void;
  onDelete: (id: string) => void;
  onGenerateInvoices: (id: string) => void;
  onPrint: (fee: FeeStructure) => void;
}

export const FeeStructureCard: React.FC<FeeStructureCardProps> = ({
  fee,
  studentCount,
  onEdit,
  onDuplicate,
  onDelete,
  onGenerateInvoices,
  onPrint
}) => {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const currency = fee.currency || 'KES';

  const ancillarySum = 
    (fee.registrationFee || 0) + 
    (fee.libraryFee || 0) + 
    (fee.examinationFee || 0) + 
    (fee.activityFee || 0);

  const customItemsSum = (fee.customItems || []).reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      {/* Card Header */}
      <div className="p-6 border-b border-slate-100 bg-linear-to-b from-slate-50/50 to-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-slate-900 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                {fee.academicYear} • {fee.semester}
              </span>
              {fee.publishedToWebsite !== false ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <Globe className="w-3 h-3" />
                  <span>Public Website</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                  Internal Draft
                </span>
              )}
            </div>

            <h3 className="font-serif font-black text-lg text-slate-900 leading-snug">
              {fee.name || fee.programName || 'Degree Fee Structure'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>{fee.programName || 'Target Academic Program'}</span>
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Package</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-950">
              <span className="text-xs text-amber-600 font-bold mr-1">{currency}</span>
              {fee.totalAmount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
          <span className="text-[10px] text-slate-400 font-bold block">Tuition</span>
          <span className="font-mono font-bold text-slate-900">
            {currency} {fee.tuitionFee.toLocaleString()}
          </span>
        </div>
        <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
          <span className="text-[10px] text-slate-400 font-bold block">Ancillary</span>
          <span className="font-mono font-bold text-slate-900">
            {currency} {ancillarySum.toLocaleString()}
          </span>
        </div>
        <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
          <span className="text-[10px] text-slate-400 font-bold block">Hostel</span>
          <span className="font-mono font-bold text-slate-900">
            {fee.hostelFee ? `${currency} ${fee.hostelFee.toLocaleString()}` : 'Optional (0)'}
          </span>
        </div>
        <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
          <span className="text-[10px] text-slate-400 font-bold block">Custom Items</span>
          <span className="font-mono font-bold text-slate-900">
            {customItemsSum > 0 ? `${currency} ${customItemsSum.toLocaleString()}` : 'None'}
          </span>
        </div>
      </div>

      {/* Expandable Full Breakdown Table */}
      {expanded && (
        <div className="px-6 py-4 border-b border-slate-100 bg-white animate-fade-in text-xs">
          <h4 className="font-bold text-slate-900 mb-2 uppercase text-[10px] tracking-wider text-slate-500">
            Complete Line Item Schedule
          </h4>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex justify-between py-2 px-3 bg-slate-50 font-bold text-slate-800">
              <span>Tuition Credits & Instruction</span>
              <span className="font-mono">{currency} {fee.tuitionFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 px-3 text-slate-600">
              <span>Registration & Matriculation Fee</span>
              <span className="font-mono">{currency} {fee.registrationFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 px-3 text-slate-600">
              <span>Theological Library & Digital Journals</span>
              <span className="font-mono">{currency} {fee.libraryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 px-3 text-slate-600">
              <span>Examination & External Moderation</span>
              <span className="font-mono">{currency} {fee.examinationFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 px-3 text-slate-600">
              <span>Chapel Ministry & Student Welfare Guild</span>
              <span className="font-mono">{currency} {fee.activityFee.toLocaleString()}</span>
            </div>
            {fee.hostelFee ? (
              <div className="flex justify-between py-2 px-3 text-slate-600">
                <span>Campus Residential Hall / Dormitory</span>
                <span className="font-mono">{currency} {fee.hostelFee.toLocaleString()}</span>
              </div>
            ) : null}

            {/* Custom items */}
            {fee.customItems && fee.customItems.map(item => (
              <div key={item.id} className="flex justify-between py-2 px-3 text-amber-900 bg-amber-50/40">
                <span className="flex items-center gap-1.5 font-medium">
                  <span>{item.name}</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded">
                    {item.category || 'Special'}
                  </span>
                </span>
                <span className="font-mono font-bold">{currency} {item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {fee.notes && (
            <p className="mt-3 text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
              <strong>Notes:</strong> {fee.notes}
            </p>
          )}
        </div>
      )}

      {/* Card Actions & Billing Controls */}
      <div className="p-4 sm:p-6 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Hide Breakdown</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>View Breakdown ({5 + (fee.hostelFee ? 1 : 0) + (fee.customItems?.length || 0)} items)</span>
              </>
            )}
          </button>

          <button
            onClick={() => onPrint(fee)}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Print Official Fee Schedule"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDuplicate(fee)}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Duplicate fee structure for another session"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={() => onEdit(fee)}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Edit fee structure"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {confirmDelete ? (
            <div className="flex items-center gap-1 animate-fade-in">
              <button
                onClick={() => onDelete(fee.id)}
                className="px-2 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs font-bold text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete fee structure"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Generate Invoices Button */}
        <button
          onClick={() => onGenerateInvoices(fee.id)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
        >
          <Receipt className="w-3.5 h-3.5 text-amber-400" />
          <span>Bill Students ({studentCount} Enrolled)</span>
        </button>
      </div>
    </div>
  );
};
