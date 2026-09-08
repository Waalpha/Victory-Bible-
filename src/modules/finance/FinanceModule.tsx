import React, { useState } from 'react';
import { 
  Calculator, 
  Plus, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Printer, 
  Layers, 
  Receipt, 
  CreditCard, 
  DollarSign, 
  Search, 
  Filter, 
  Globe, 
  AlertCircle,
  ExternalLink,
  Sparkles,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { erpService } from '../../services/erpService';
import { FeeStructure, PaymentRecord, Invoice, Program, Student } from '../../types';
import { FeeStructureModal } from './components/FeeStructureModal';
import { FeeStructureCard } from './components/FeeStructureCard';
import { FeeSchedulePrintModal } from './components/FeeSchedulePrintModal';

export const FinanceModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'structures' | 'invoices' | 'payments'>('structures');
  
  // Data from erpService
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(erpService.getFeeStructures());
  const [payments, setPayments] = useState<PaymentRecord[]>(erpService.getPayments());
  const [invoices, setInvoices] = useState<Invoice[]>(erpService.getInvoices());
  const [students, setStudents] = useState<Student[]>(erpService.getStudents());
  const programs: Program[] = erpService.getPrograms();
  const settings = erpService.getSettings();

  // Notification state
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fee Structure Modals state
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [editingFeeStructure, setEditingFeeStructure] = useState<FeeStructure | null>(null);
  const [printingFee, setPrintingFee] = useState<FeeStructure | null>(null);
  const [feeProgramFilter, setFeeProgramFilter] = useState<string>('ALL');

  // Payment Recording Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payForm, setPayForm] = useState({
    studentId: students[0]?.id || '',
    amount: 25000,
    paymentMethod: 'M-Pesa' as const,
    referenceNumber: '',
    bankName: 'Standard Chartered',
    notes: 'Semester 1 fee installment'
  });

  // Selected receipt for printing
  const [printingReceipt, setPrintingReceipt] = useState<PaymentRecord | null>(null);

  // Invoices search / filter
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string>('ALL');

  // KPI calculations
  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalInvoiced = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalOutstanding = invoices.reduce((acc, i) => acc + i.balance, 0);

  // Handlers for Fee Structures
  const handleSaveFeeStructure = (fee: FeeStructure) => {
    const exists = feeStructures.some(f => f.id === fee.id);
    let updated: FeeStructure[];
    if (exists) {
      updated = feeStructures.map(f => f.id === fee.id ? fee : f);
      erpService.updateFeeStructure(fee.id, fee);
      showToast(`Fee structure "${fee.name}" updated successfully!`);
    } else {
      updated = [fee, ...feeStructures];
      erpService.addFeeStructure(fee);
      showToast(`New fee structure "${fee.name}" created and saved!`);
    }
    setFeeStructures(updated);
    setShowFeeModal(false);
    setEditingFeeStructure(null);
  };

  const handleDuplicateFeeStructure = (fee: FeeStructure) => {
    const duplicated: FeeStructure = {
      ...fee,
      id: 'fee-' + Date.now(),
      name: `${fee.name || fee.programName} (Copy)`,
      semester: fee.semester === 'Semester 1' ? 'Semester 2' : 'Semester 1',
      createdAt: new Date().toISOString().substring(0, 10),
      updatedAt: new Date().toISOString().substring(0, 10)
    };
    const updated = [duplicated, ...feeStructures];
    erpService.addFeeStructure(duplicated);
    setFeeStructures(updated);
    showToast(`Duplicated fee structure as "${duplicated.name}". You can now edit its rates.`);
  };

  const handleDeleteFeeStructure = (id: string) => {
    const fee = feeStructures.find(f => f.id === id);
    const updated = feeStructures.filter(f => f.id !== id);
    setFeeStructures(updated);
    erpService.deleteFeeStructure(id);
    showToast(`Deleted fee structure "${fee?.name || id}".`);
  };

  const handleGenerateInvoices = (feeId: string) => {
    const result = erpService.generateInvoicesFromFeeStructure(feeId);
    const fee = feeStructures.find(f => f.id === feeId);
    if (result.generated > 0) {
      setInvoices(erpService.getInvoices());
      setStudents(erpService.getStudents());
      showToast(`Generated ${result.generated} new invoices for enrolled students in ${fee?.programName || 'program'}!`);
      setActiveTab('invoices');
    } else if (result.studentCount === 0) {
      showToast(`No active students are currently enrolled in this program to bill.`, 'info');
    } else {
      showToast(`All active students in this program already have invoices for this semester.`, 'info');
    }
  };

  // Payment Recording Handler
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === payForm.studentId);
    if (!st) return;

    const recorded = erpService.recordPayment({
      studentId: st.id,
      studentName: st.fullName,
      amount: Number(payForm.amount),
      paymentMethod: payForm.paymentMethod,
      referenceNumber: payForm.referenceNumber || 'MPESA-' + Math.floor(10000000 + Math.random() * 90000000),
      bankName: payForm.bankName,
      recordedBy: 'Finance Officer (Jane)',
      notes: payForm.notes,
      date: new Date().toISOString().substring(0, 10)
    });

    // Deduct student fee balance
    st.feeBalance = Math.max(0, (st.feeBalance || 0) - Number(payForm.amount));
    erpService.updateStudent(st.id, { feeBalance: st.feeBalance });

    // Update pending invoices
    const studentInvoices = invoices.filter(inv => inv.studentId === st.id && inv.balance > 0);
    if (studentInvoices.length > 0) {
      let remainingPayment = Number(payForm.amount);
      const updatedInvoices = invoices.map(inv => {
        if (inv.studentId === st.id && remainingPayment > 0 && inv.balance > 0) {
          const deduct = Math.min(inv.balance, remainingPayment);
          const newBalance = inv.balance - deduct;
          remainingPayment -= deduct;
          const newPaid = inv.paidAmount + deduct;
          return {
            ...inv,
            paidAmount: newPaid,
            balance: newBalance,
            status: (newBalance === 0 ? 'Paid' : 'Partial') as any
          };
        }
        return inv;
      });
      erpService.saveInvoices(updatedInvoices);
      setInvoices(updatedInvoices);
    }

    setPayments([recorded, ...payments]);
    setStudents([...students]);
    setShowPaymentModal(false);
    showToast(`Payment of KES ${recorded.amount.toLocaleString()} recorded for ${st.fullName}. Receipt #${recorded.receiptNumber}`);
  };

  // Filtered fee structures
  const filteredFeeStructures = feeStructures.filter(f => {
    if (feeProgramFilter !== 'ALL' && f.programId !== feeProgramFilter) return false;
    return true;
  });

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => {
    if (invoiceStatusFilter !== 'ALL' && inv.status !== invoiceStatusFilter) return false;
    if (invoiceSearch.trim()) {
      const q = invoiceSearch.toLowerCase();
      return (
        inv.studentName.toLowerCase().includes(q) ||
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.academicYear.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16 text-slate-800">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold animate-fade-in ${
          notification.type === 'success'
            ? 'bg-emerald-900 text-white border-emerald-700'
            : notification.type === 'error'
            ? 'bg-rose-900 text-white border-rose-700'
            : 'bg-slate-900 text-white border-slate-700'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Module Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-amber-600" />
              <span>Seminary Bursar & Finance Portal</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            Fee Structures, Invoicing & Student Accounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Create custom program fee schedules, ancillary breakdown line items, tuition rates, and generate student invoices synced with the public website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setEditingFeeStructure(null);
              setShowFeeModal(true);
            }}
            className="px-5 py-3 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Fee Structure</span>
          </button>

          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Financial KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Fee Structures</span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {feeStructures.length} <span className="text-xs font-normal text-slate-500">Program Schedules</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">Published to Website & ERP</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Billed to Students</span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            KES {totalInvoiced.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Academic Year 2026/2027</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Collections Verified</span>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            KES {totalCollected.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">{payments.length} Verified Receipts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Outstanding Student Arrears</span>
          <div className="text-2xl font-black text-rose-600 font-mono">
            KES {totalOutstanding.toLocaleString()}
          </div>
          <p className="text-[11px] text-rose-600 font-medium">Pending invoice settlements</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('structures')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'structures'
                ? 'bg-slate-900 text-amber-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Fee Structures & Rates ({feeStructures.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-slate-900 text-amber-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Student Invoices ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-slate-900 text-amber-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment Receipts ({payments.length})</span>
          </button>
        </div>

        {/* Public Website Sync Indicator */}
        <div className="hidden md:flex items-center gap-2 pr-3 text-[11px] font-medium text-slate-500">
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span>Synced with Public Website (<code className="text-amber-700 font-bold">/fees</code>)</span>
        </div>
      </div>

      {/* TAB 1: FEE STRUCTURES & SCHEDULE */}
      {activeTab === 'structures' && (
        <div className="space-y-6">
          {/* Public Website Live Sync Banner */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/10 border border-amber-300/80 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-md">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-950 text-base">
                  Live Public Website Fees Integration
                </h3>
                <p className="text-xs text-amber-950/80 mt-1 max-w-2xl leading-relaxed">
                  Every fee structure you create or customize here with the <strong>"Publish to Public Website"</strong> toggle enabled is dynamically displayed to prospective students and sponsors on the public website's <strong>Tuition & Fees page (<code className="font-mono font-bold text-amber-900">/fees</code>)</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingFeeStructure(null);
                setShowFeeModal(true);
              }}
              className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-black shrink-0 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Create New Structure</span>
            </button>
          </div>

          {/* Program Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Filter by Program:</span>
              <select
                value={feeProgramFilter}
                onChange={e => setFeeProgramFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
              >
                <option value="ALL">All Programs ({feeStructures.length})</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs text-slate-500">
              Showing {filteredFeeStructures.length} of {feeStructures.length} fee structures
            </span>
          </div>

          {/* Fee Structures Grid */}
          {filteredFeeStructures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFeeStructures.map(fee => {
                const enrolledCount = students.filter(s => 
                  (s.programId === fee.programId || s.programName?.toLowerCase() === fee.programName?.toLowerCase()) &&
                  s.status === 'Active'
                ).length;

                return (
                  <FeeStructureCard
                    key={fee.id}
                    fee={fee}
                    studentCount={enrolledCount}
                    onEdit={f => {
                      setEditingFeeStructure(f);
                      setShowFeeModal(true);
                    }}
                    onDuplicate={handleDuplicateFeeStructure}
                    onDelete={handleDeleteFeeStructure}
                    onGenerateInvoices={handleGenerateInvoices}
                    onPrint={f => setPrintingFee(f)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <Calculator className="w-12 h-12 text-slate-300 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-slate-800">No fee structures match this filter</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Create a new fee structure to configure tuition and ancillary costs for this academic program.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingFeeStructure(null);
                  setShowFeeModal(true);
                }}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Fee Structure Now</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: STUDENT INVOICES */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {/* Filter / Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={invoiceSearch}
                onChange={e => setInvoiceSearch(e.target.value)}
                placeholder="Search by student name, invoice #, or academic year..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-bold">Status:</span>
              <select
                value={invoiceStatusFilter}
                onChange={e => setInvoiceStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              >
                <option value="ALL">All Invoices</option>
                <option value="Unpaid">Unpaid Only</option>
                <option value="Partial">Partial Payments</option>
                <option value="Paid">Fully Paid</option>
              </select>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Total Billed</th>
                  <th className="py-3 px-4">Paid</th>
                  <th className="py-3 px-4">Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{inv.studentName}</td>
                    <td className="py-3.5 px-4 text-slate-500">{inv.academicYear} • {inv.semester}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">KES {inv.totalAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">KES {inv.paidAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-600">KES {inv.balance.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inv.status === 'Partial'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{inv.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT RECEIPTS */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Recorded Fee Receipts & Reconciliation</h3>
                <p className="text-xs text-slate-500">Official cash, M-Pesa, and bank transactions reconciled into the Seminary ledger.</p>
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 self-start transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record New Payment</span>
              </button>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Reference / Trans ID</th>
                  <th className="py-3 px-4">Recorded By</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {payments.map(pay => (
                  <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{pay.receiptNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{pay.studentName}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">KES {pay.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md font-bold text-[10px]">
                        {pay.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{pay.referenceNumber}</td>
                    <td className="py-3.5 px-4 text-slate-500">{pay.recordedBy || 'Finance Office'}</td>
                    <td className="py-3.5 px-4 text-slate-500">{pay.date}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setPrintingReceipt(pay)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold inline-flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fee Structure Modal (Create / Edit) */}
      <FeeStructureModal
        isOpen={showFeeModal}
        onClose={() => {
          setShowFeeModal(false);
          setEditingFeeStructure(null);
        }}
        onSave={handleSaveFeeStructure}
        initialData={editingFeeStructure}
        programs={programs}
      />

      {/* Fee Schedule Print Modal */}
      <FeeSchedulePrintModal
        isOpen={!!printingFee}
        onClose={() => setPrintingFee(null)}
        fee={printingFee}
        settings={settings}
      />

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 space-y-6 shadow-2xl animate-scale-up border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900">Record Student Fee Payment</h3>
                <p className="text-xs text-slate-500">Direct credit against student tuition invoices and balance ledger</p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Matriculated Student</label>
                <select
                  value={payForm.studentId}
                  onChange={e => setPayForm({ ...payForm, studentId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.studentNumber}) — {s.programName || 'Program'} [Balance: KES {(s.feeBalance || 0).toLocaleString()}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Amount (KES)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={payForm.amount}
                    onChange={e => setPayForm({ ...payForm, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Channel</label>
                  <select
                    value={payForm.paymentMethod}
                    onChange={e => setPayForm({ ...payForm, paymentMethod: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  >
                    <option value="M-Pesa">M-Pesa Mobile Paybill</option>
                    <option value="Bank Transfer">Bank Wire / Deposit</option>
                    <option value="Cash">Cash at Bursar's Office</option>
                    <option value="Paybill">Government / Sponsor Voucher</option>
                    <option value="Credit Card">Debit / Credit Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Transaction Ref / Receipt No.</label>
                <input
                  type="text"
                  required
                  value={payForm.referenceNumber}
                  onChange={e => setPayForm({ ...payForm, referenceNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  placeholder="e.g., MPESA-QG89234190 or Bank Slip #098123"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Ledger Allocation</label>
                <input
                  type="text"
                  value={payForm.notes}
                  onChange={e => setPayForm({ ...payForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Semester 1 tuition and library installment"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl cursor-pointer shadow-md transition-all"
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {printingReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl border border-slate-200 text-xs text-slate-800">
            <div className="border-b-2 border-slate-900 pb-4 text-center">
              <h2 className="font-serif font-black text-lg text-slate-950">{settings.institutionName || 'Victory International Apostolic Biblical Institute'}</h2>
              <p className="text-[11px] text-slate-500">Official Student Bursary Fee Receipt</p>
              <span className="inline-block mt-2 font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                {printingReceipt.receiptNumber}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <strong className="text-slate-900">{printingReceipt.studentName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Date:</span>
                <strong className="font-mono">{printingReceipt.date}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <strong className="text-slate-900">{printingReceipt.paymentMethod}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reference:</span>
                <strong className="font-mono text-slate-900">{printingReceipt.referenceNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Authorized By:</span>
                <strong className="text-slate-900">{printingReceipt.recordedBy}</strong>
              </div>
              <div className="flex justify-between py-2 border-t border-b border-slate-200 font-bold text-sm">
                <span>Amount Paid:</span>
                <span className="font-mono text-emerald-700 text-base">KES {printingReceipt.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPrintingReceipt(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
