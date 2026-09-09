import React, { useState } from 'react';
import { 
  Users, Search, Plus, Eye, BookOpen, Award, DollarSign, 
  FileText, Home, Library, ShieldAlert, CheckCircle, Mail, 
  Phone, PhoneCall, Copy, Check, Edit2, Trash2, AlertTriangle, 
  Printer, IdCard, ExternalLink, Calendar, MapPin, HeartHandshake,
  Church, GraduationCap, X, ChevronRight, Filter
} from 'lucide-react';
import { erpService } from '../../services/erpService';
import { Student, Invoice, PaymentRecord, ExamResult, MinistryPlacement } from '../../types';

export const StudentsModule: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() => erpService.getStudents());
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [showIdCardModal, setShowIdCardModal] = useState(false);

  const programs = erpService.getPrograms();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`Copied ${label}: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Helper generators for new student
  const generateAdmissionNumber = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `ADM-${year}-${rand}`;
  };

  const generateStudentNumber = () => {
    const year = new Date().getFullYear();
    const rand = String(students.length + 1).padStart(3, '0');
    return `GRC/${year}/${rand}`;
  };

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    admissionNumber: generateAdmissionNumber(),
    studentNumber: generateStudentNumber(),
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    dateOfBirth: '2001-05-15',
    nationality: 'Kenyan',
    address: 'P.O. Box 100, Nairobi',
    photoUrl: '',
    nextOfKinName: '',
    nextOfKinRelationship: 'Parent',
    nextOfKinPhone: '',
    nextOfKinEmail: '',
    emergencyContact: '',
    churchName: '',
    churchPastor: '',
    previousEducation: 'High School KCSE Aggregate B',
    programId: programs[0]?.id || 'prog-1',
    intake: 'September 2026',
    status: 'Active' as const,
    feeBalance: 0
  });

  const openAddModal = () => {
    setNewStudent({
      admissionNumber: generateAdmissionNumber(),
      studentNumber: generateStudentNumber(),
      fullName: '',
      email: '',
      phone: '',
      gender: 'Male',
      dateOfBirth: '2001-05-15',
      nationality: 'Kenyan',
      address: 'P.O. Box 100, Nairobi',
      photoUrl: '',
      nextOfKinName: '',
      nextOfKinRelationship: 'Parent',
      nextOfKinPhone: '',
      nextOfKinEmail: '',
      emergencyContact: '',
      churchName: '',
      churchPastor: '',
      previousEducation: 'High School KCSE Aggregate B',
      programId: programs[0]?.id || 'prog-1',
      intake: 'September 2026',
      status: 'Active',
      feeBalance: 0
    });
    setShowAddModal(true);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.fullName.trim() || !newStudent.email.trim() || !newStudent.admissionNumber.trim()) {
      alert('Please provide Full Name, Email, and Admission Number.');
      return;
    }

    const prog = programs.find(p => p.id === newStudent.programId);

    const created = erpService.addStudent({
      studentNumber: newStudent.studentNumber.trim() || generateStudentNumber(),
      admissionNumber: newStudent.admissionNumber.trim() || generateAdmissionNumber(),
      fullName: newStudent.fullName.trim(),
      email: newStudent.email.trim(),
      phone: newStudent.phone.trim() || '+254 700 000 000',
      gender: newStudent.gender,
      dateOfBirth: newStudent.dateOfBirth,
      nationality: newStudent.nationality.trim() || 'Kenyan',
      address: newStudent.address.trim() || 'N/A',
      photoUrl: newStudent.photoUrl.trim() || undefined,
      nextOfKinName: newStudent.nextOfKinName.trim() || 'Not Provided',
      nextOfKinRelationship: newStudent.nextOfKinRelationship.trim() || 'Guardian',
      nextOfKinPhone: newStudent.nextOfKinPhone.trim() || newStudent.phone.trim() || 'N/A',
      nextOfKinEmail: newStudent.nextOfKinEmail.trim() || undefined,
      emergencyContact: newStudent.emergencyContact.trim() || newStudent.nextOfKinPhone.trim() || newStudent.phone.trim() || 'N/A',
      churchName: newStudent.churchName.trim() || 'Community Church',
      churchPastor: newStudent.churchPastor.trim() || 'Pastor in Charge',
      previousEducation: newStudent.previousEducation.trim() || 'High School Certificate',
      programId: newStudent.programId,
      programName: prog?.name || 'Christian Ministry Program',
      department: prog?.department || 'Biblical Studies',
      intake: newStudent.intake,
      academicYear: '2026/2027',
      semester: 'Semester 1',
      status: newStudent.status,
      gpa: 3.5,
      cgpa: 3.5,
      feeBalance: Number(newStudent.feeBalance) || 0,
      attendanceRate: 95,
      createdAt: new Date().toISOString().substring(0, 10)
    });

    const updatedStudents = erpService.getStudents();
    setStudents(updatedStudents);
    setShowAddModal(false);
    setSelectedStudent(created);
    setActiveTab('Overview');
    showToast(`Student ${created.fullName} (${created.admissionNumber}) enrolled successfully!`);
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const prog = programs.find(p => p.id === editingStudent.programId);

    const updated = erpService.updateStudent(editingStudent.id, {
      ...editingStudent,
      fullName: editingStudent.fullName.trim(),
      admissionNumber: editingStudent.admissionNumber.trim(),
      studentNumber: editingStudent.studentNumber.trim(),
      email: editingStudent.email.trim(),
      phone: editingStudent.phone.trim(),
      nextOfKinName: editingStudent.nextOfKinName.trim(),
      nextOfKinRelationship: editingStudent.nextOfKinRelationship?.trim() || 'Guardian',
      nextOfKinPhone: editingStudent.nextOfKinPhone.trim(),
      nextOfKinEmail: editingStudent.nextOfKinEmail?.trim() || undefined,
      emergencyContact: editingStudent.emergencyContact.trim(),
      churchName: editingStudent.churchName.trim(),
      churchPastor: editingStudent.churchPastor.trim(),
      address: editingStudent.address.trim(),
      programName: prog?.name || editingStudent.programName,
      department: prog?.department || editingStudent.department,
      feeBalance: Number(editingStudent.feeBalance) || 0
    });

    if (updated) {
      const refreshed = erpService.getStudents();
      setStudents(refreshed);
      if (selectedStudent?.id === updated.id) {
        setSelectedStudent(updated);
      }
      setEditingStudent(null);
      showToast(`Profile for ${updated.fullName} successfully updated!`);
    }
  };

  const confirmDeleteStudent = () => {
    if (!deletingStudent) return;
    const name = deletingStudent.fullName;
    erpService.deleteStudent(deletingStudent.id);
    const refreshed = erpService.getStudents();
    setStudents(refreshed);
    setDeletingStudent(null);
    if (selectedStudent?.id === deletingStudent.id) {
      setSelectedStudent(null);
    }
    showToast(`Student ${name} removed from registry.`);
  };

  // Filter students
  const filtered = students.filter(s => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      s.fullName.toLowerCase().includes(term) || 
      s.studentNumber.toLowerCase().includes(term) ||
      (s.admissionNumber && s.admissionNumber.toLowerCase().includes(term)) ||
      s.email.toLowerCase().includes(term) ||
      s.programName.toLowerCase().includes(term) ||
      (s.nextOfKinName && s.nextOfKinName.toLowerCase().includes(term)) ||
      (s.churchName && s.churchName.toLowerCase().includes(term));

    const matchesProgram = selectedProgram === 'ALL' || s.programId === selectedProgram;
    const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;

    return matchesSearch && matchesProgram && matchesStatus;
  });

  const studentTabs = [
    'Overview', 'Academic', 'Courses', 'Attendance', 'Assignments', 
    'Examinations', 'Results', 'Fees', 'Payments', 'Documents', 
    'Ministry', 'Internship', 'Library', 'Hostel', 'Discipline', 
    'Communication', 'Graduation'
  ];

  // Associated records for currently selected student
  const studentInvoices: Invoice[] = selectedStudent 
    ? erpService.getInvoices().filter(inv => inv.studentId === selectedStudent.id)
    : [];

  const studentPayments: PaymentRecord[] = selectedStudent
    ? erpService.getPayments().filter(p => p.studentId === selectedStudent.id)
    : [];

  const studentExamResults: ExamResult[] = selectedStudent
    ? erpService.getResults().filter(r => r.studentId === selectedStudent.id)
    : [];

  const studentPlacements: MinistryPlacement[] = selectedStudent
    ? erpService.getMinistryPlacements().filter(p => p.studentId === selectedStudent.id)
    : [];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Student Information System (SIS)</h2>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-[11px] rounded-md font-mono">
              {students.length} Enrolled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete student profiles featuring official admission numbers, verified email addresses, next of kin contacts, and ministerial formation.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#15803D] hover:bg-[#14532D] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Admit New Student</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by student name, Admission No, Reg No, email, next of kin..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600">
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedProgram}
              onChange={e => setSelectedProgram(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="ALL">All Programs</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Deferred">Deferred</option>
              <option value="Suspended">Suspended</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Found <strong className="text-slate-900 font-semibold">{filtered.length}</strong> theological students</span>
          {(searchTerm || selectedProgram !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedProgram('ALL');
                setSelectedStatus('ALL');
              }}
              className="text-emerald-700 font-bold hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ================= MOBILE CARDS VIEW (Phone optimized) ================= */}
      <div className="block md:hidden space-y-4">
        {filtered.map(st => (
          <div 
            key={st.id} 
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
          >
            {/* Top row: Avatar, Name, Admission # */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 overflow-hidden flex items-center justify-center font-bold text-base text-emerald-700 shrink-0">
                  {st.photoUrl ? <img src={st.photoUrl} alt="" className="w-full h-full object-cover" /> : st.fullName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{st.fullName}</h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-900 font-mono font-bold text-[10px] rounded border border-emerald-200/60">
                      {st.admissionNumber || 'ADM-PENDING'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {st.studentNumber}
                    </span>
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {st.status}
              </span>
            </div>

            {/* Email & Program */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href={`mailto:${st.email}`} className="text-emerald-800 font-mono font-medium truncate underline">
                  {st.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{st.programName}</span>
              </div>
            </div>

            {/* Next of Kin highlight card on mobile */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <HeartHandshake className="w-3 h-3 text-emerald-600" /> Next of Kin
                </span>
                {st.nextOfKinRelationship && (
                  <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
                    {st.nextOfKinRelationship}
                  </span>
                )}
              </div>
              <div className="font-semibold text-slate-800">{st.nextOfKinName || 'Not designated'}</div>
              {st.nextOfKinPhone && (
                <a href={`tel:${st.nextOfKinPhone}`} className="text-[11px] text-slate-600 font-mono flex items-center gap-1 hover:text-emerald-700">
                  <Phone className="w-3 h-3 text-slate-400" /> {st.nextOfKinPhone}
                </a>
              )}
            </div>

            {/* Footer action buttons on mobile */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className={`text-xs font-mono font-bold ${st.feeBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                Bal: ${st.feeBalance.toLocaleString()}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingStudent(st)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                  title="Edit Student"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedStudent(st);
                    setActiveTab('Overview');
                  }}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE VIEW ================= */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Admission # & Reg #</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Email & Phone</th>
                <th className="p-4">Next of Kin</th>
                <th className="p-4">Program & Dept</th>
                <th className="p-4">GPA / CGPA</th>
                <th className="p-4">Fee Balance</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map(st => (
                <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 inline-block w-fit">
                        {st.admissionNumber || 'ADM-PENDING'}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 mt-1">
                        {st.studentNumber}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 overflow-hidden flex items-center justify-center font-bold text-emerald-700 shrink-0">
                        {st.photoUrl ? <img src={st.photoUrl} alt="" className="w-full h-full object-cover" /> : st.fullName[0]}
                      </div>
                      <span className="font-bold text-slate-900">{st.fullName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <a href={`mailto:${st.email}`} className="text-emerald-800 font-mono font-medium hover:underline block truncate max-w-[160px]">
                        {st.email}
                      </a>
                      <span className="text-slate-400 font-mono text-[11px] block">{st.phone}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900">{st.nextOfKinName}</span>
                        {st.nextOfKinRelationship && (
                          <span className="px-1 py-0.2 bg-emerald-50 text-emerald-800 text-[9px] font-bold rounded">
                            {st.nextOfKinRelationship}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 font-mono text-[11px] block">{st.nextOfKinPhone}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-0.5 max-w-[180px]">
                      <span className="font-semibold text-slate-900 block truncate">{st.programName}</span>
                      <span className="text-slate-500 text-[11px] block truncate">{st.department}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-semibold text-slate-900">
                    {st.gpa} / {st.cgpa}
                  </td>
                  <td className="p-4 font-mono">
                    <span className={st.feeBalance > 0 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                      ${st.feeBalance.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg font-semibold text-[10px] bg-emerald-100 text-emerald-800">
                      {st.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedStudent(st);
                          setActiveTab('Overview');
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold inline-flex items-center space-x-1"
                        title="View Full Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => setEditingStudent(st)}
                        className="p-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-lg"
                        title="Edit Student Profile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingStudent(st)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg"
                        title="Delete Student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: COMPLETE STUDENT PROFILE (17 TABS) ================= */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full h-[92vh] flex flex-col shadow-2xl animate-scale-up overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 overflow-hidden flex items-center justify-center font-bold text-2xl text-emerald-400 shrink-0">
                  {selectedStudent.photoUrl ? <img src={selectedStudent.photoUrl} alt="" className="w-full h-full object-cover" /> : selectedStudent.fullName[0]}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold">{selectedStudent.fullName}</h3>
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md text-xs font-mono font-bold flex items-center gap-1">
                      <span>ADM: {selectedStudent.admissionNumber || 'ADM-PENDING'}</span>
                      <button 
                        onClick={() => copyToClipboard(selectedStudent.admissionNumber, 'Admission Number')}
                        className="hover:text-white p-0.5"
                        title="Copy Admission Number"
                      >
                        {copiedField === 'Admission Number' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs font-mono">
                      REG: {selectedStudent.studentNumber}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                    <span className="text-emerald-200/90 font-medium">{selectedStudent.programName}</span>
                    <span>•</span>
                    <a href={`mailto:${selectedStudent.email}`} className="text-slate-300 hover:text-white font-mono flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {selectedStudent.email}
                    </a>
                    <span>•</span>
                    <a href={`tel:${selectedStudent.phone}`} className="text-slate-300 hover:text-white font-mono flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {selectedStudent.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => setShowIdCardModal(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                  title="View Student ID Badge"
                >
                  <IdCard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ID Badge</span>
                </button>
                <button
                  onClick={() => setEditingStudent(selectedStudent)}
                  className="px-3 py-1.5 bg-[#15803D] hover:bg-[#14532D] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Sub-navigation tabs (17 Tabs) */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center space-x-2 overflow-x-auto custom-scrollbar">
              {studentTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab ? 'bg-[#15803D] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Body Content */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-100/50 text-xs">
              {activeTab === 'Overview' && (
                <div className="space-y-6">
                  {/* Highlight Banner: Next of Kin & Primary Contact */}
                  <div className="bg-gradient-to-br from-emerald-50 via-emerald-50/30 to-white p-6 rounded-2xl border border-emerald-200/80 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-emerald-200/60 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                          <HeartHandshake className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Next of Kin & Emergency Contacts</h4>
                          <p className="text-[11px] text-slate-500">Designated family liaison and emergency response contacts on file</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs">
                        Emergency Contact Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Next of Kin Full Name</span>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedStudent.nextOfKinName || 'Not designated'}</div>
                        <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Relationship: {selectedStudent.nextOfKinRelationship || 'Guardian'}
                        </span>
                      </div>

                      <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Next of Kin Phone</span>
                        <a 
                          href={`tel:${selectedStudent.nextOfKinPhone}`} 
                          className="font-mono font-bold text-emerald-800 text-sm mt-0.5 flex items-center gap-1.5 hover:underline"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{selectedStudent.nextOfKinPhone || 'N/A'}</span>
                        </a>
                        <button 
                          onClick={() => copyToClipboard(selectedStudent.nextOfKinPhone, 'Kin Phone')}
                          className="text-[10px] text-slate-500 hover:text-slate-800 mt-1 block"
                        >
                          Click to Copy Phone
                        </button>
                      </div>

                      <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Next of Kin Email</span>
                        <div className="font-mono text-slate-800 text-xs mt-0.5 truncate">
                          {selectedStudent.nextOfKinEmail ? (
                            <a href={`mailto:${selectedStudent.nextOfKinEmail}`} className="text-emerald-800 hover:underline">
                              {selectedStudent.nextOfKinEmail}
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">Not provided</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">Family communications</span>
                      </div>

                      <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Secondary Emergency Line</span>
                        <a 
                          href={`tel:${selectedStudent.emergencyContact}`} 
                          className="font-mono font-bold text-slate-900 text-sm mt-0.5 flex items-center gap-1.5 hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5 text-rose-500" />
                          <span>{selectedStudent.emergencyContact || 'N/A'}</span>
                        </a>
                        <span className="text-[10px] text-rose-600 font-semibold mt-1 block">24/7 Rapid Response</span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Bio & Identification */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 md:col-span-2">
                      <h4 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center justify-between">
                        <span>Personal, Academic & Contact Identification</span>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">Registered {selectedStudent.createdAt}</span>
                      </h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-400 block font-medium">Official Admission Number</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {selectedStudent.admissionNumber || 'ADM-PENDING'}
                            </span>
                            <button 
                              onClick={() => copyToClipboard(selectedStudent.admissionNumber, 'Admission Number')}
                              className="text-slate-400 hover:text-slate-600 p-1"
                              title="Copy Admission Number"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Student Registration Number</span>
                          <span className="font-mono font-bold text-slate-900 block mt-0.5">{selectedStudent.studentNumber}</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Official Student Email</span>
                          <a href={`mailto:${selectedStudent.email}`} className="font-semibold text-emerald-800 hover:underline flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-emerald-600" />
                            <span>{selectedStudent.email}</span>
                          </a>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Student Phone Number</span>
                          <a href={`tel:${selectedStudent.phone}`} className="font-semibold text-slate-900 hover:text-emerald-800 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{selectedStudent.phone}</span>
                          </a>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Date of Birth & Gender</span>
                          <span className="font-semibold text-slate-900">{selectedStudent.dateOfBirth} ({selectedStudent.gender})</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Nationality & Residence</span>
                          <span className="font-semibold text-slate-900">{selectedStudent.nationality}, {selectedStudent.address}</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Home Church & Assembly</span>
                          <span className="font-semibold text-slate-900">{selectedStudent.churchName}</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Presiding Minister / Pastor</span>
                          <span className="font-semibold text-slate-900">{selectedStudent.churchPastor}</span>
                        </div>

                        <div className="col-span-2">
                          <span className="text-slate-400 block font-medium">Prior Educational Qualification</span>
                          <span className="font-semibold text-slate-900">{selectedStudent.previousEducation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Academic & Financial Status */}
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                        <h4 className="font-bold text-slate-900 text-sm border-b pb-2">Academic Standing</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Program</span>
                            <span className="font-bold text-slate-900 text-right truncate max-w-[150px]">{selectedStudent.programName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Semester GPA</span>
                            <span className="font-bold font-mono text-slate-900">{selectedStudent.gpa}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Cumulative CGPA</span>
                            <span className="font-bold font-mono text-emerald-600">{selectedStudent.cgpa}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Attendance Rate</span>
                            <span className="font-bold font-mono text-emerald-600">{selectedStudent.attendanceRate}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Current Status</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {selectedStudent.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                        <h4 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center justify-between">
                          <span>Financial Status</span>
                          <span className="text-[10px] text-slate-400">USD</span>
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Outstanding Fee Balance</span>
                            <span className={`font-bold font-mono text-base ${selectedStudent.feeBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                              ${selectedStudent.feeBalance.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Invoices Issued</span>
                            <span className="font-semibold text-slate-800">{studentInvoices.length} invoices</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Payments Recorded</span>
                            <span className="font-semibold text-slate-800">{studentPayments.length} receipts</span>
                          </div>
                          <button
                            onClick={() => setActiveTab('Fees')}
                            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-colors"
                          >
                            View Fee Ledger
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Academic' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">Curriculum & Academic Matriculation</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Student is matriculated under <strong className="text-slate-900">{selectedStudent.programName}</strong> in the Department of <strong className="text-slate-900">{selectedStudent.department}</strong>.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-slate-400 font-bold uppercase text-[10px]">Academic Year</div>
                      <div className="font-bold text-slate-900 text-base mt-1">{selectedStudent.academicYear}</div>
                      <div className="text-slate-500 text-[11px]">{selectedStudent.semester}</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-slate-400 font-bold uppercase text-[10px]">Admission Intake</div>
                      <div className="font-bold text-slate-900 text-base mt-1">{selectedStudent.intake}</div>
                      <div className="text-slate-500 text-[11px]">Matriculated</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-slate-400 font-bold uppercase text-[10px]">Cumulative Standing</div>
                      <div className="font-bold text-emerald-700 text-base mt-1">{selectedStudent.cgpa} CGPA</div>
                      <div className="text-emerald-600 font-semibold text-[11px]">Good Academic Standing</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Courses' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-sm">Registered Theological Courses ({selectedStudent.semester})</h4>
                    <span className="text-xs text-emerald-800 font-bold">13 Credit Hours Enrolled</span>
                  </div>
                  <ul className="divide-y divide-slate-100">
                    <li className="py-3 flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-emerald-900 mr-2">OT101</span>
                        <span className="font-semibold text-slate-900">Pentateuch & Historical Books</span>
                        <span className="text-slate-400 block text-[11px]">Lecturer: Dr. Jonathan Vance</span>
                      </div>
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg font-mono font-semibold">3 Credits</span>
                    </li>
                    <li className="py-3 flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-emerald-900 mr-2">THEO201</span>
                        <span className="font-semibold text-slate-900">Systematic Theology I</span>
                        <span className="text-slate-400 block text-[11px]">Lecturer: Dr. Sarah Kageni</span>
                      </div>
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg font-mono font-semibold">4 Credits</span>
                    </li>
                    <li className="py-3 flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-emerald-900 mr-2">HOM301</span>
                        <span className="font-semibold text-slate-900">Biblical Preaching & Homiletics</span>
                        <span className="text-slate-400 block text-[11px]">Lecturer: Rev. Dr. Samuel Okoro</span>
                      </div>
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg font-mono font-semibold">3 Credits</span>
                    </li>
                    <li className="py-3 flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-emerald-900 mr-2">HEB101</span>
                        <span className="font-semibold text-slate-900">Elementary Biblical Hebrew I</span>
                        <span className="text-slate-400 block text-[11px]">Lecturer: Dr. Rebecca Stern</span>
                      </div>
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg font-mono font-semibold">3 Credits</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'Fees' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Official Invoices & Fee Ledger</h4>
                      <p className="text-slate-500 text-[11px]">Institutional invoices issued to {selectedStudent.fullName}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Balance</span>
                      <span className={`font-mono text-base font-bold ${selectedStudent.feeBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        ${selectedStudent.feeBalance.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {studentInvoices.length === 0 ? (
                    <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-500">
                      No invoices currently logged for this student.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {studentInvoices.map(inv => (
                        <div key={inv.id} className="py-3 flex justify-between items-center">
                          <div>
                            <span className="font-mono font-bold text-slate-900 mr-2">{inv.invoiceNumber}</span>
                            <span className="text-slate-600">{inv.academicYear} • {inv.semester}</span>
                            <div className="text-[11px] text-slate-400">Due: {inv.dueDate}</div>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-slate-900 block">${inv.totalAmount.toLocaleString()}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {inv.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Ministry' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">Practical Ministry Practicum & Field Placement</h4>
                  {studentPlacements.length === 0 ? (
                    <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-600">
                      Field placement scheduled for Semester 2 ministry practicum block.
                    </div>
                  ) : (
                    studentPlacements.map(pl => (
                      <div key={pl.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{pl.churchOrOrganization}</span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">{pl.status}</span>
                        </div>
                        <p className="text-slate-600 text-xs">Supervisor: {pl.supervisorName} ({pl.supervisorPhone})</p>
                        <p className="text-slate-400 text-[11px]">Type: {pl.placementType} • {pl.startDate} to {pl.endDate}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab !== 'Overview' && activeTab !== 'Academic' && activeTab !== 'Courses' && activeTab !== 'Fees' && activeTab !== 'Ministry' && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-3 text-center py-12">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{activeTab} Records for {selectedStudent.fullName}</h4>
                  <p className="text-slate-500 max-w-md mx-auto text-xs">
                    Institutional ledger and verified ministerial records synchronized with Cloud Firestore database.
                  </p>
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 font-mono text-[11px] rounded-lg">
                    Student ID: {selectedStudent.admissionNumber}
                  </span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-xs text-slate-500">
                Next of Kin: <strong className="text-slate-800 font-semibold">{selectedStudent.nextOfKinName}</strong> ({selectedStudent.nextOfKinPhone})
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const toDelete = selectedStudent;
                    setDeletingStudent(toDelete);
                  }}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Student
                </button>
                <button
                  onClick={() => setEditingStudent(selectedStudent)}
                  className="px-4 py-2 bg-[#15803D] hover:bg-[#14532D] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                </button>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADMIT NEW STUDENT ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full my-8 p-6 sm:p-8 space-y-6 shadow-2xl animate-scale-up border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Admit New Theological Student</h3>
                  <p className="text-xs text-slate-500">Record complete bio, admission number, email, and next of kin</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              {/* Section 1: Identification */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
                <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider">Institutional Identification</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Admission Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newStudent.admissionNumber}
                      onChange={e => setNewStudent({ ...newStudent, admissionNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-emerald-900"
                      placeholder="ADM-2026-XXXX"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Student Reg Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newStudent.studentNumber}
                      onChange={e => setNewStudent({ ...newStudent, studentNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                      placeholder="GRC/2026/XXX"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Personal & Contact */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Student Contact Details</h4>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudent.fullName}
                    onChange={e => setNewStudent({ ...newStudent, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                    placeholder="e.g. Caleb Kiprop Koech"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Official Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={newStudent.email}
                      onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                      placeholder="student@gracetheo.edu"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newStudent.phone}
                      onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                    <select
                      value={newStudent.gender}
                      onChange={e => setNewStudent({ ...newStudent, gender: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={newStudent.dateOfBirth}
                      onChange={e => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nationality</label>
                    <input
                      type="text"
                      value={newStudent.nationality}
                      onChange={e => setNewStudent({ ...newStudent, nationality: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Residential / Postal Address</label>
                  <input
                    type="text"
                    value={newStudent.address}
                    onChange={e => setNewStudent({ ...newStudent, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    placeholder="e.g. P.O. Box 450, Eldoret"
                  />
                </div>
              </div>

              {/* Section 3: Next of Kin & Emergency Contacts */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  <HeartHandshake className="w-4 h-4 text-emerald-700" />
                  <span>Next of Kin & Emergency Contacts</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Next of Kin Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newStudent.nextOfKinName}
                      onChange={e => setNewStudent({ ...newStudent, nextOfKinName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium"
                      placeholder="e.g. Esther Koech"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Relationship to Student <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={newStudent.nextOfKinRelationship}
                      onChange={e => setNewStudent({ ...newStudent, nextOfKinRelationship: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium"
                    >
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Relative">Relative</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Next of Kin Phone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newStudent.nextOfKinPhone}
                      onChange={e => setNewStudent({ ...newStudent, nextOfKinPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                      placeholder="+254 722 000 111"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Next of Kin Email</label>
                    <input
                      type="email"
                      value={newStudent.nextOfKinEmail}
                      onChange={e => setNewStudent({ ...newStudent, nextOfKinEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                      placeholder="kin@example.com"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Secondary Emergency Line</label>
                    <input
                      type="text"
                      value={newStudent.emergencyContact}
                      onChange={e => setNewStudent({ ...newStudent, emergencyContact: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                      placeholder="+254 733 444 555"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Academic & Church */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Program of Study</label>
                  <select
                    value={newStudent.programId}
                    onChange={e => setNewStudent({ ...newStudent, programId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Home Church</label>
                  <input
                    type="text"
                    value={newStudent.churchName}
                    onChange={e => setNewStudent({ ...newStudent, churchName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    placeholder="e.g. Grace Baptist Church"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pastor Name</label>
                  <input
                    type="text"
                    value={newStudent.churchPastor}
                    onChange={e => setNewStudent({ ...newStudent, churchPastor: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    placeholder="e.g. Rev. James Mwangi"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Fee Balance ($)</label>
                  <input
                    type="number"
                    value={newStudent.feeBalance}
                    onChange={e => setNewStudent({ ...newStudent, feeBalance: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#15803D] hover:bg-[#14532D] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Admit Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT STUDENT PROFILE ================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full my-8 p-6 sm:p-8 space-y-6 shadow-2xl animate-scale-up border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit Student Profile</h3>
                  <p className="text-xs text-slate-500">Update admission number, email, and next of kin contacts</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingStudent(null)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="space-y-4 text-xs">
              {/* Identification */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission Number</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.admissionNumber}
                    onChange={e => setEditingStudent({ ...editingStudent, admissionNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-emerald-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Reg Number</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.studentNumber}
                    onChange={e => setEditingStudent({ ...editingStudent, studentNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.fullName}
                    onChange={e => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                    <input
                      type="email"
                      required
                      value={editingStudent.email}
                      onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={editingStudent.phone}
                      onChange={e => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Status</label>
                    <select
                      value={editingStudent.status}
                      onChange={e => setEditingStudent({ ...editingStudent, status: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                    >
                      <option value="Active">Active</option>
                      <option value="Deferred">Deferred</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Graduated">Graduated</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Fee Balance ($)</label>
                    <input
                      type="number"
                      value={editingStudent.feeBalance}
                      onChange={e => setEditingStudent({ ...editingStudent, feeBalance: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={editingStudent.address}
                    onChange={e => setEditingStudent({ ...editingStudent, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              {/* Next of Kin */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  <HeartHandshake className="w-4 h-4 text-emerald-700" />
                  <span>Next of Kin & Emergency Contacts</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Next of Kin Full Name</label>
                    <input
                      type="text"
                      required
                      value={editingStudent.nextOfKinName}
                      onChange={e => setEditingStudent({ ...editingStudent, nextOfKinName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Relationship</label>
                    <select
                      value={editingStudent.nextOfKinRelationship || 'Guardian'}
                      onChange={e => setEditingStudent({ ...editingStudent, nextOfKinRelationship: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium"
                    >
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Relative">Relative</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Next of Kin Phone</label>
                    <input
                      type="text"
                      required
                      value={editingStudent.nextOfKinPhone}
                      onChange={e => setEditingStudent({ ...editingStudent, nextOfKinPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Next of Kin Email</label>
                    <input
                      type="email"
                      value={editingStudent.nextOfKinEmail || ''}
                      onChange={e => setEditingStudent({ ...editingStudent, nextOfKinEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Emergency Contact</label>
                    <input
                      type="text"
                      value={editingStudent.emergencyContact}
                      onChange={e => setEditingStudent({ ...editingStudent, emergencyContact: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Church */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Home Church</label>
                  <input
                    type="text"
                    value={editingStudent.churchName}
                    onChange={e => setEditingStudent({ ...editingStudent, churchName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pastor Name</label>
                  <input
                    type="text"
                    value={editingStudent.churchPastor}
                    onChange={e => setEditingStudent({ ...editingStudent, churchPastor: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#15803D] hover:bg-[#14532D] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE STUDENT CONFIRMATION ================= */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-up border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Delete Student Record</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to permanently delete <strong className="text-slate-900">{deletingStudent.fullName}</strong>?
              </p>
              <div className="p-3 bg-rose-50 border border-rose-200/70 rounded-xl text-xs text-rose-800 text-left">
                <span className="font-bold block">Admission No: {deletingStudent.admissionNumber}</span>
                <span>Student ID: {deletingStudent.studentNumber}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingStudent(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteStudent}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Yes, Delete Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: STUDENT ID CARD PREVIEW ================= */}
      {showIdCardModal && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scale-up border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <IdCard className="w-4 h-4 text-emerald-600" /> Student Identification Card
              </h3>
              <button onClick={() => setShowIdCardModal(false)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                ✕
              </button>
            </div>

            {/* Visual Student Card */}
            <div className="bg-gradient-to-br from-[#0B1F17] via-[#133327] to-[#071711] text-white p-5 rounded-2xl border border-[#153F33]/80 shadow-xl space-y-4">
              <div className="flex justify-between items-start border-b border-[#153F33]/80 pb-3">
                <div>
                  <div className="text-[9px] uppercase font-bold text-emerald-400 tracking-widest">Victory International Apostolic Biblical Institute</div>
                  <div className="text-xs font-semibold text-slate-300">Official Student Identity Card</div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold rounded border border-emerald-500/40">
                  {selectedStudent.status}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-24 rounded-xl bg-slate-900/80 border border-emerald-700/50 overflow-hidden flex items-center justify-center text-emerald-400 font-bold text-3xl shrink-0 shadow-inner">
                  {selectedStudent.photoUrl ? (
                    <img src={selectedStudent.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    selectedStudent.fullName[0]
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="font-bold text-base text-white">{selectedStudent.fullName}</div>
                  <div className="text-emerald-300 text-[11px] font-medium leading-tight">{selectedStudent.programName}</div>
                  <div className="font-mono text-xs pt-1">
                    <span className="text-slate-400 text-[10px] block">Admission Number</span>
                    <span className="text-emerald-400 font-bold">{selectedStudent.admissionNumber || 'ADM-PENDING'}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-300">
                    Reg: {selectedStudent.studentNumber}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between text-[10px] text-slate-400">
                <div>
                  <span>Next of Kin: </span>
                  <span className="text-slate-200 font-medium">{selectedStudent.nextOfKinName}</span>
                </div>
                <span className="font-mono">Valid: 2026/2027</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" /> Print Card
              </button>
              <button
                onClick={() => setShowIdCardModal(false)}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
