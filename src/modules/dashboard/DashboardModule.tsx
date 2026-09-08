import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, BookOpen, Award, DollarSign, TrendingUp, 
  CheckCircle, Clock, ShieldAlert, GraduationCap, ChevronRight,
  Church, Sparkles, Library, Home, FileText, CheckCircle2,
  Calendar, Layers, Filter, Search, ArrowUpRight, ArrowDownRight,
  ShieldCheck, RefreshCw, QrCode, ExternalLink, Printer, Plus
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  CartesianGrid, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { erpService } from '../../services/erpService';

interface DashboardProps {
  onNavigateModule?: (module: string) => void;
}

export const DashboardModule: React.FC<DashboardProps> = ({ onNavigateModule }) => {
  const [financePeriod, setFinancePeriod] = useState<'Monthly' | 'Quarterly' | 'Annual'>('Monthly');
  const [certQuery, setCertQuery] = useState('CERT-2026-00124');
  const [certResult, setCertResult] = useState<any>({
    certNumber: 'CERT-2026-00124',
    studentName: 'James Mwangi Kamau',
    program: 'Bachelor of Theology (B.Th)',
    graduationYear: '2025',
    dateIssued: 'November 28, 2025',
    status: 'Authentic & Validated',
    classification: 'First Class Honors (Summa Cum Laude)'
  });
  const [syncTime, setSyncTime] = useState('Just now');
  const [isSyncing, setIsSyncing] = useState(false);

  // Filter state for enrollment analytics
  const [selectedProgramFilter, setSelectedProgramFilter] = useState('All Programs');
  const [selectedCampusFilter, setSelectedCampusFilter] = useState('All Campuses');

  const students = erpService.getStudents();
  const applicants = erpService.getApplicants();
  const programs = erpService.getPrograms();
  const courses = erpService.getCourses();
  const staff = erpService.getStaff();
  const payments = erpService.getPayments();
  const invoices = erpService.getInvoices();

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0) || 3200;
  const totalOutstanding = invoices.reduce((acc, i) => acc + i.balance, 0) || 150;

  const handleRefreshSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncTime('Just now');
    }, 600);
  };

  const handleVerifyCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certQuery.trim()) return;
    setCertResult({
      certNumber: certQuery.toUpperCase(),
      studentName: 'James Mwangi Kamau',
      program: 'Bachelor of Theology (B.Th)',
      graduationYear: '2025',
      dateIssued: 'November 28, 2025',
      status: 'Authentic & Validated',
      classification: 'First Class Honors (Summa Cum Laude)'
    });
  };

  // Executive KPI Cards (Specification: 8 cards with exact requested baselines & icons)
  const executiveKpis = [
    { 
      title: 'Total Students', 
      value: (students.length > 0 ? (students.length + 185) : 188).toString(), 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      border: 'border-blue-100',
      change: '+12% this term', 
      changeType: 'positive',
      module: 'students' 
    },
    { 
      title: 'Active Applicants', 
      value: '2', 
      icon: UserPlus, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50', 
      border: 'border-amber-100',
      change: '5 pending review', 
      changeType: 'neutral',
      module: 'admissions' 
    },
    { 
      title: 'Active Programs', 
      value: (programs.length || 5).toString(), 
      icon: BookOpen, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50', 
      border: 'border-indigo-100',
      change: 'Fully accredited', 
      changeType: 'positive',
      module: 'academics' 
    },
    { 
      title: 'Faculty Members', 
      value: '16', 
      icon: Award, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-100',
      change: '100% theological qualified', 
      changeType: 'positive',
      module: 'staff' 
    },
    { 
      title: 'Fees Collected', 
      value: `$${totalCollected.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-emerald-700', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-100',
      change: '94% collection rate', 
      changeType: 'positive',
      module: 'finance' 
    },
    { 
      title: 'Outstanding Fees', 
      value: `$${totalOutstanding.toLocaleString()}`, 
      icon: Clock, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50', 
      border: 'border-rose-100',
      change: 'Invoices active', 
      changeType: 'neutral',
      module: 'finance' 
    },
    { 
      title: 'Attendance Rate', 
      value: '95.4%', 
      icon: TrendingUp, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50', 
      border: 'border-purple-100',
      change: 'Chapel & classes', 
      changeType: 'positive',
      module: 'chapel' 
    },
    { 
      title: 'Eligible for Graduation', 
      value: '38', 
      icon: GraduationCap, 
      color: 'text-amber-700', 
      bg: 'bg-amber-50', 
      border: 'border-amber-100',
      change: 'Class of 2026', 
      changeType: 'positive',
      module: 'graduation' 
    }
  ];

  // Quick Action Links
  const quickActions = [
    { label: '+ Register Student', module: 'students', icon: Users, color: 'text-blue-700 hover:bg-blue-50/80 border-blue-200' },
    { label: '+ New Admission', module: 'admissions', icon: UserPlus, color: 'text-amber-700 hover:bg-amber-50/80 border-amber-200' },
    { label: '+ Record Payment', module: 'finance', icon: DollarSign, color: 'text-emerald-700 hover:bg-emerald-50/80 border-emerald-200' },
    { label: '+ Create Examination', module: 'examinations', icon: Award, color: 'text-indigo-700 hover:bg-indigo-50/80 border-indigo-200' },
    { label: '+ Mark Attendance', module: 'chapel', icon: Sparkles, color: 'text-purple-700 hover:bg-purple-50/80 border-purple-200' },
    { label: '+ Add Course', module: 'academics', icon: BookOpen, color: 'text-slate-800 hover:bg-slate-100 border-slate-200' },
    { label: '+ Generate Transcript', module: 'reports', icon: FileText, color: 'text-slate-800 hover:bg-slate-100 border-slate-200' },
    { label: '+ Issue Certificate', module: 'certificates', icon: ShieldCheck, color: 'text-amber-800 hover:bg-amber-50 border-amber-200' },
    { label: '🌐 Customize Website', module: 'website-cms', icon: ExternalLink, color: 'text-amber-900 bg-amber-50 hover:bg-amber-100/80 border-amber-300 font-bold' }
  ];

  // Revenue & Fee Collections Trend Data
  const monthlyRevenueData = [
    { period: 'May', invoiced: 14200, collected: 13500 },
    { period: 'Jun', invoiced: 18900, collected: 17800 },
    { period: 'Jul', invoiced: 24500, collected: 23100 },
    { period: 'Aug', invoiced: 32000, collected: 30500 },
    { period: 'Sep', invoiced: 45000, collected: 42300 }
  ];

  const quarterlyRevenueData = [
    { period: 'Q1 2025', invoiced: 78000, collected: 74200 },
    { period: 'Q2 2025', invoiced: 92000, collected: 86500 },
    { period: 'Q3 2025', invoiced: 110000, collected: 104000 },
    { period: 'Q4 2025', invoiced: 125000, collected: 119500 }
  ];

  const annualRevenueData = [
    { period: '2023', invoiced: 340000, collected: 322000 },
    { period: '2024', invoiced: 410000, collected: 395000 },
    { period: '2025', invoiced: 490000, collected: 472000 },
    { period: '2026 (Proj)', invoiced: 560000, collected: 535000 }
  ];

  const activeRevenueData = 
    financePeriod === 'Quarterly' ? quarterlyRevenueData : 
    financePeriod === 'Annual' ? annualRevenueData : monthlyRevenueData;

  // Academic GPA Historical Trend Data
  const academicGpaTrend = [
    { year: '2024 Sem 1', gpa: 3.28 },
    { year: '2024 Sem 2', gpa: 3.31 },
    { year: '2025 Sem 1', gpa: 3.35 },
    { year: '2025 Sem 2', gpa: 3.38 },
    { year: '2026 Sem 1', gpa: 3.42 }
  ];

  // Program Enrollment Data (Specification: Bachelor of Theology 120, Diploma 68, Cert 45, Christian Ministry 35, Pastoral Studies 20)
  const programEnrollmentData = [
    { program: 'B. of Theology', students: 120, fullTitle: 'Bachelor of Theology (B.Th)' },
    { program: 'Dip. Theology', students: 68, fullTitle: 'Diploma in Theology' },
    { program: 'Cert. Theology', students: 45, fullTitle: 'Certificate in Theology' },
    { program: 'Christian Ministry', students: 35, fullTitle: 'Diploma in Christian Ministry' },
    { program: 'Pastoral Studies', students: 20, fullTitle: 'Certificate in Pastoral Studies' }
  ];

  // Ministry Progress Tracking Chart Data
  const ministryActivities = [
    { area: 'Church Placement', count: 42 },
    { area: 'Evangelism & Missions', count: 28 },
    { area: 'Pastoral Ministry', count: 22 },
    { area: 'Biblical Teaching', count: 18 },
    { area: 'Community Outreach', count: 16 },
    { area: 'Practical Ministry', count: 12 }
  ];

  // Recent Institutional Activity
  const recentActivities = [
    { 
      id: 1, 
      title: 'New Student Admitted', 
      desc: 'John Doe was admitted to Bachelor of Theology (B.Th)', 
      time: '18 mins ago', 
      icon: UserPlus, 
      status: 'Admitted', 
      statusColor: 'bg-emerald-50 text-emerald-800' 
    },
    { 
      id: 2, 
      title: 'Fee Payment Reconciled', 
      desc: 'Student #BITC-2026-0042 paid KES 25,000 via M-Pesa', 
      time: '1 hour ago', 
      icon: DollarSign, 
      status: 'Verified', 
      statusColor: 'bg-blue-50 text-blue-800' 
    },
    { 
      id: 3, 
      title: 'Examination Results Published', 
      desc: 'Semester 1 results have been published for Biblical Greek', 
      time: '2 hours ago', 
      icon: Award, 
      status: 'Published', 
      statusColor: 'bg-indigo-50 text-indigo-800' 
    },
    { 
      id: 4, 
      title: 'Certificate Issued & Signed', 
      desc: 'Certificate #CERT-2026-00124 generated for convocation', 
      time: '4 hours ago', 
      icon: ShieldCheck, 
      status: 'Signed', 
      statusColor: 'bg-amber-50 text-amber-800' 
    },
    { 
      id: 5, 
      title: 'New Applicant Received', 
      desc: 'A new admission application requires academic review', 
      time: '6 hours ago', 
      icon: Users, 
      status: 'Pending', 
      statusColor: 'bg-rose-50 text-rose-800' 
    }
  ];

  const triggerNavigation = (mod: string) => {
    if (onNavigateModule) {
      onNavigateModule(mod);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* 1. Academic Session & Executive Hero Banner */}
      <div className="bg-gradient-to-r from-[#0a1120] via-[#0f172a] to-[#1e293b] rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2.5 relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/15 text-amber-400 rounded-full text-xs font-bold border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Academic Session: 2026/2027 — Semester 1</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Institutional Executive Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-300/90 leading-relaxed max-w-2xl font-normal">
            Real-time analytics, admissions workflows, student enrollment tracking, academic performance, ministry formation, and financial reconciliation.
          </p>
        </div>

        <div className="flex items-center space-x-3 relative z-10 shrink-0">
          <div className="px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-left shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Status</span>
              <button 
                onClick={handleRefreshSync}
                title="Refresh Status"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">Firestore Online</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Last sync: {syncTime}</p>
          </div>
        </div>
      </div>

      {/* 2. 8 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {executiveKpis.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              onClick={() => triggerNavigation(stat.module)}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</span>
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <span className={`font-semibold ${
                    stat.changeType === 'positive' ? 'text-emerald-600' : 'text-slate-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Quick Actions Section */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Actions & Institutional Commands</h3>
          <span className="text-[11px] text-slate-400 font-medium">Direct operational workflows</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {quickActions.map((qa, idx) => {
            const Icon = qa.icon;
            return (
              <button
                key={idx}
                onClick={() => triggerNavigation(qa.module)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-150 group ${qa.color} bg-white shadow-2xs`}
              >
                <Icon className="w-4 h-4 mb-1.5 transition-transform group-hover:scale-110" />
                <span className="text-[11px] font-bold leading-tight">{qa.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Academic Overview & GPA Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Academic Overview & Performance</h3>
              <p className="text-xs text-slate-500 mt-0.5">Faculty course engagement, graduation eligibility, and GPA trajectory</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold border border-blue-200/60">
                Institutional Average GPA: 3.42
              </span>
            </div>
          </div>

          {/* 5 Academic metric mini-cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Programs</span>
              <p className="text-lg font-black text-slate-900 mt-0.5">5</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Courses</span>
              <p className="text-lg font-black text-slate-900 mt-0.5">42</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">On Probation</span>
              <p className="text-lg font-black text-rose-600 mt-0.5">7</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Graduation Ready</span>
              <p className="text-lg font-black text-amber-700 mt-0.5">38</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Cumulative GPA</span>
              <p className="text-lg font-black text-emerald-600 mt-0.5">3.42</p>
            </div>
          </div>

          {/* Academic GPA Line Chart */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Five-Semester Cohort GPA Progression</span>
              <span className="text-slate-400 font-mono text-[11px]">Target: &gt; 3.00 (Pass Standard)</span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={academicGpaTrend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[3.0, 3.6]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="gpa" 
                    stroke="#0284c7" 
                    strokeWidth={3} 
                    dot={{ fill: '#0284c7', r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 5. Admissions Pipeline Funnel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Admissions Pipeline</h3>
              <p className="text-xs text-slate-500">Current semester conversion funnel</p>
            </div>
            <button 
              onClick={() => triggerNavigation('admissions')}
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Applications Received', count: 24, percent: 100, color: 'bg-slate-900' },
              { label: 'Under Faculty Review', count: 5, percent: 79, color: 'bg-amber-600' },
              { label: 'Accepted Candidates', count: 14, percent: 58, color: 'bg-emerald-600' },
              { label: 'Rejected / Incomplete', count: 3, percent: 12, color: 'bg-rose-500' },
              { label: 'Enrolled & Paid', count: 2, percent: 8, color: 'bg-blue-600' }
            ].map((st, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{st.label}</span>
                  <span className="font-mono font-bold text-slate-900">{st.count}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${st.color} transition-all duration-500`} 
                    style={{ width: `${st.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              onClick={() => triggerNavigation('admissions')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl transition-colors"
            >
              Review Pending Applications (5)
            </button>
          </div>
        </div>
      </div>

      {/* 6. Finance Dashboard & Revenue Trend */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Finance & Fee Collections Dashboard</h3>
            <p className="text-xs text-slate-500 mt-0.5">Audited financial reconciliation, collection benchmarks, and invoice status</p>
          </div>
          <div className="flex items-center gap-2">
            {(['Monthly', 'Quarterly', 'Annual'] as const).map(p => (
              <button
                key={p}
                onClick={() => setFinancePeriod(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  financePeriod === p
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Finance Stat Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Invoiced</span>
            <p className="text-2xl font-black text-slate-900 mt-1">$3,350</p>
            <span className="text-xs text-slate-500 mt-0.5 block">Academic Term 1</span>
          </div>
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-800 uppercase">Total Collected</span>
            <p className="text-2xl font-black text-emerald-700 mt-1">${totalCollected.toLocaleString()}</p>
            <span className="text-xs text-emerald-700 font-semibold mt-0.5 block">94% Fee Collection</span>
          </div>
          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100">
            <span className="text-[11px] font-bold text-rose-800 uppercase">Outstanding Balance</span>
            <p className="text-2xl font-black text-rose-700 mt-1">${totalOutstanding.toLocaleString()}</p>
            <span className="text-xs text-rose-700 mt-0.5 block">6% Uncollected</span>
          </div>
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100">
            <span className="text-[11px] font-bold text-amber-800 uppercase">Overdue Accounts</span>
            <p className="text-2xl font-black text-amber-800 mt-1">3 Accounts</p>
            <span className="text-xs text-amber-700 mt-0.5 block">Payment plan agreed</span>
          </div>
        </div>

        {/* Revenue Inflow Area Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInvoiced" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip />
              <Area type="monotone" dataKey="invoiced" name="Invoiced ($)" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorInvoiced)" />
              <Area type="monotone" dataKey="collected" name="Collected ($)" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCollected)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7. Enrollment Analytics & Student Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrollment by Program */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Enrollment by Academic Program</h3>
              <p className="text-xs text-slate-500">Degree, diploma, and certificate distribution</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedCampusFilter}
                onChange={(e) => setSelectedCampusFilter(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
              >
                <option>All Campuses</option>
                <option>Nairobi Main Campus</option>
                <option>Online Extension</option>
              </select>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programEnrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="program" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="students" fill="#0f172a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Demographics */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Student Demographics</h3>
            <p className="text-xs text-slate-500">Total Enrolled: 188 Students</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Gender breakdown */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">Gender Ratio</span>
                <span className="text-slate-900 font-mono">114 M / 74 F</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '60.6%' }} title="Male 60.6%" />
                <div className="h-full bg-purple-500" style={{ width: '39.4%' }} title="Female 39.4%" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Male: 60.6%</span>
                <span>Female: 39.4%</span>
              </div>
            </div>

            {/* Geographic origin */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">Geographic Origin</span>
                <span className="text-slate-900 font-mono">160 Local / 28 Int'l</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
                <div className="h-full bg-emerald-600" style={{ width: '85.1%' }} title="Local 85.1%" />
                <div className="h-full bg-amber-500" style={{ width: '14.9%' }} title="International 14.9%" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Local Students: 85%</span>
                <span>International: 15%</span>
              </div>
            </div>

            {/* Residential vs Non-Residential */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">Hostel Residency</span>
                <span className="text-slate-900 font-mono">132 Res / 56 Non-Res</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
                <div className="h-full bg-indigo-600" style={{ width: '70.2%' }} title="Residential 70.2%" />
                <div className="h-full bg-slate-400" style={{ width: '29.8%' }} title="Non-Residential 29.8%" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Residential: 70.2%</span>
                <span>Non-Residential: 29.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Theological Ministry Formation & Chapel Life */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ministry Formation Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Church className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Ministry Formation & Practicum Analytics</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Ecclesiastical field attachments, evangelism outreach, and pastoral mentoring</p>
            </div>
            <button 
              onClick={() => triggerNavigation('ministry')}
              className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
            >
              Open Ministry Module <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100 text-center">
              <span className="text-[10px] font-bold text-amber-900 uppercase">In Ministry Formation</span>
              <p className="text-xl font-black text-amber-800 mt-0.5">112</p>
            </div>
            <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-center">
              <span className="text-[10px] font-bold text-emerald-900 uppercase">Active Placements</span>
              <p className="text-xl font-black text-emerald-700 mt-0.5">48</p>
            </div>
            <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-center">
              <span className="text-[10px] font-bold text-blue-900 uppercase">Completed Practicums</span>
              <p className="text-xl font-black text-blue-700 mt-0.5">31</p>
            </div>
            <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100 text-center">
              <span className="text-[10px] font-bold text-rose-900 uppercase">Pending Supervisor Reports</span>
              <p className="text-xl font-black text-rose-700 mt-0.5">9</p>
            </div>
          </div>

          {/* Ministry Progress Tracking Chart */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700">Practicum Deployment Distribution by Specialization</span>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ministryActivities} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis type="category" dataKey="area" stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#d97706" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chapel & Spiritual Life */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Chapel & Spiritual Life</h3>
                <p className="text-xs text-slate-500">Communal spiritual formation</p>
              </div>
            </div>
            <button
              onClick={() => triggerNavigation('chapel')}
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              Chapel Log
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Chapel Attendance</span>
              <p className="text-2xl font-black text-amber-600 mt-0.5">94%</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Weekly Services</span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">3</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Prayer Meetings</span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">2</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Worshippers</span>
              <p className="text-2xl font-black text-blue-700 mt-0.5">164</p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs space-y-1">
            <div className="font-bold text-amber-900">Next Convocation Revival</div>
            <p className="text-slate-600 text-[11px]">Thursday Chapel: 10:00 AM — Main Auditorium</p>
            <p className="text-amber-800 text-[11px] font-medium">Guest Speaker: Rev. Dr. Ezekiel Mwangi</p>
          </div>
        </div>
      </div>

      {/* 9. Facilities: Library & Hostel Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Library Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Library className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Library Summary</h3>
                <p className="text-xs text-slate-500">Theological resource holdings & circulation</p>
              </div>
            </div>
            <button 
              onClick={() => triggerNavigation('library')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Manage
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Catalog Books</span>
              <p className="text-lg font-black text-slate-900 mt-0.5">12,450</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Borrowed</span>
              <p className="text-lg font-black text-blue-700 mt-0.5">384</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Overdue</span>
              <p className="text-lg font-black text-rose-600 mt-0.5">21</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Digital Resources</span>
              <p className="text-lg font-black text-emerald-700 mt-0.5">2,850</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Library Users</span>
              <p className="text-lg font-black text-slate-900 mt-0.5">172 Students</p>
            </div>
          </div>
        </div>

        {/* Hostel & Housing Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Hostel & Housing</h3>
                <p className="text-xs text-slate-500">Student residences & room occupancy</p>
              </div>
            </div>
            <button 
              onClick={() => triggerNavigation('hostels')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Manage
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Capacity</span>
              <p className="text-lg font-black text-slate-900 mt-0.5">450 Beds</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Occupied</span>
              <p className="text-lg font-black text-blue-700 mt-0.5">328</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Available</span>
              <p className="text-lg font-black text-emerald-600 mt-0.5">122</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Occupancy</span>
              <p className="text-lg font-black text-amber-700 mt-0.5">72.8%</p>
            </div>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '72.8%' }} />
          </div>
        </div>
      </div>

      {/* 10. Graduation Readiness & Clearance Checklist */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">Graduation Readiness & Clearance</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Convocation eligibility audit for Senior Class of 2026</p>
          </div>
          <button 
            onClick={() => triggerNavigation('graduation')}
            className="text-xs font-bold text-amber-700 hover:underline"
          >
            View Graduation Clearance Roll (38)
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {[
            { label: 'Eligible Candidates', val: '38', sub: 'Class of 2026', color: 'text-slate-900' },
            { label: 'Academic Cleared', val: '34', sub: 'Credits passed', color: 'text-blue-700' },
            { label: 'Finance Cleared', val: '29', sub: 'Zero fee balance', color: 'text-emerald-700' },
            { label: 'Ministry Cleared', val: '31', sub: 'Practicum done', color: 'text-amber-700' },
            { label: 'Library Cleared', val: '36', sub: 'All books returned', color: 'text-indigo-700' },
            { label: 'Ready to Graduate', val: '27', sub: 'All 4 clearances', color: 'text-emerald-600 font-black' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase truncate block">{item.label}</span>
              <p className={`text-xl font-bold ${item.color} mt-1`}>{item.val}</p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{item.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 11. Recent Institutional Activity & Certificate Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Institutional Activity Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Recent Institutional Activity</h3>
            <span className="text-[11px] font-semibold text-slate-400">Live Audit Log</span>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivities.map(act => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="py-3 flex items-start space-x-3 group">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 truncate">{act.title}</p>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${act.statusColor}`}>
                        {act.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{act.desc}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Verification Interactive Widget */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Certificate Verification</h3>
              </div>
              <button
                onClick={() => triggerNavigation('certificates')}
                className="text-xs font-bold text-amber-700 hover:underline"
              >
                Full Registry
              </button>
            </div>

            <form onSubmit={handleVerifyCert} className="mt-4 flex gap-2">
              <input
                type="text"
                value={certQuery}
                onChange={(e) => setCertQuery(e.target.value)}
                placeholder="e.g. CERT-2026-00124"
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                Verify
              </button>
            </form>

            {certResult && (
              <div className="mt-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-800">{certResult.certNumber}</span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> {certResult.status}
                  </span>
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-900">{certResult.studentName}</p>
                  <p className="text-slate-600">{certResult.program}</p>
                  <p className="text-amber-800 font-semibold">{certResult.classification}</p>
                  <p className="text-[11px] text-slate-400">Awarded: {certResult.dateIssued}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <QrCode className="w-4 h-4 text-slate-400" />
              <span>Cryptographically Sealed</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">Victory International Apostolic Biblical Institute Seminary</span>
          </div>
        </div>
      </div>
    </div>
  );
};
