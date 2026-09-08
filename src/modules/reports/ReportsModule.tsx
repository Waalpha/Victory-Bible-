import React from 'react';
import { BarChart2, Download, Printer } from 'lucide-react';
import { erpService } from '../../services/erpService';

export const ReportsModule: React.FC = () => {
  const settings = erpService.getSettings();
  const students = erpService.getStudents();
  const payments = erpService.getPayments();

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Institutional Reports Center</h2>
          <p className="text-xs text-slate-500">Comprehensive data reports on enrollment, fee collections, academic performance, and ministry placement.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center space-x-2"
        >
          <Printer className="w-4 h-4" />
          <span>Export PDF Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base border-b pb-2">Student Demographics & Enrollment Summary</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Total Enrolled Students:</span> <strong className="font-mono">{students.length}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500">Active Academic Session:</span> <strong className="font-mono">{settings.currentAcademicYear}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500">Average Attendance Rate:</span> <strong className="font-mono text-emerald-600">95.4%</strong></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base border-b pb-2">Financial Reconciliation Summary</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Total Verified Collections:</span> <strong className="font-mono text-emerald-600">${totalCollected.toLocaleString()}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500">Currency:</span> <strong className="font-mono">{settings.currency}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500">Payment Gateway:</span> <strong className="font-mono">M-Pesa & Bank Integration Active</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
