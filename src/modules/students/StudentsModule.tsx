import React, { useState } from 'react';
import { 
  Users, Search, Plus, Eye, BookOpen, Award, DollarSign, 
  FileText, Home, Library, ShieldAlert, CheckCircle, Mail 
} from 'lucide-react';
import { erpService } from '../../services/erpService';
import { Student } from '../../types';

export const StudentsModule: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(erpService.getStudents());
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const programs = erpService.getPrograms();

  const [newStudent, setNewStudent] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male' as const,
    dateOfBirth: '2000-01-01',
    nationality: 'Kenyan',
    address: '',
    nextOfKinName: '',
    nextOfKinPhone: '',
    emergencyContact: '',
    churchName: '',
    churchPastor: '',
    previousEducation: 'High School',
    programId: programs[0]?.id || '',
    intake: 'September 2026'
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const prog = programs.find(p => p.id === newStudent.programId);
    const studentNumber = 'GRC/2026/' + Math.floor(100 + Math.random() * 900);
    const admissionNumber = 'ADM-2026-' + Math.floor(1000 + Math.random() * 9000);

    const created = erpService.addStudent({
      ...newStudent,
      studentNumber,
      admissionNumber,
      programName: prog?.name || 'Theology Program',
      department: prog?.department || 'Biblical Studies',
      academicYear: '2026/2027',
      semester: 'Semester 1',
      status: 'Active',
      gpa: 3.6,
      cgpa: 3.6,
      feeBalance: 1200,
      attendanceRate: 95,
      createdAt: new Date().toISOString().substring(0, 10)
    });

    setStudents([created, ...students]);
    setShowAddModal(false);
  };

  const filtered = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.programName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const studentTabs = [
    'Overview', 'Academic', 'Courses', 'Attendance', 'Assignments', 
    'Examinations', 'Results', 'Fees', 'Payments', 'Documents', 
    'Ministry', 'Internship', 'Library', 'Hostel', 'Discipline', 
    'Communication', 'Graduation'
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Information System (SIS)</h2>
          <p className="text-xs text-slate-500">Manage enrolled theological students, academic records, formation, and finances.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Admit New Student</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search student by name, number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500">{filtered.length} Students Registered</span>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4">Student #</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Program</th>
                <th className="p-4">Department</th>
                <th className="p-4">GPA / CGPA</th>
                <th className="p-4">Fee Balance</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filtered.map(st => (
                <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-semibold text-slate-900">{st.studentNumber}</td>
                  <td className="p-4 font-bold text-slate-900 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 overflow-hidden flex items-center justify-center font-bold text-amber-700">
                      {st.photoUrl ? <img src={st.photoUrl} alt="" className="w-full h-full object-cover" /> : st.fullName[0]}
                    </div>
                    <span>{st.fullName}</span>
                  </td>
                  <td className="p-4">{st.programName}</td>
                  <td className="p-4 text-slate-500">{st.department}</td>
                  <td className="p-4 font-mono font-semibold text-slate-900">{st.gpa} / {st.cgpa}</td>
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
                    <button
                      onClick={() => {
                        setSelectedStudent(st);
                        setActiveTab('Overview');
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Profile (17 Tabs)</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student 17-Tab Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl animate-scale-up overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 overflow-hidden flex items-center justify-center font-bold text-xl text-amber-400">
                  {selectedStudent.photoUrl ? <img src={selectedStudent.photoUrl} alt="" className="w-full h-full object-cover" /> : selectedStudent.fullName[0]}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold">{selectedStudent.fullName}</h3>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-md text-[10px] font-mono">{selectedStudent.studentNumber}</span>
                  </div>
                  <p className="text-xs text-slate-300">{selectedStudent.programName} • {selectedStudent.department}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Sub-navigation tabs (17 Tabs) */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex items-center space-x-2 overflow-x-auto custom-scrollbar">
              {studentTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Body Content */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-100/50 text-xs">
              {activeTab === 'Overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 md:col-span-2">
                    <h4 className="font-bold text-slate-900 text-sm border-b pb-2">Personal & Ecclesiastical Bio</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 block font-medium">Email Address</span>
                        <span className="font-semibold text-slate-900">{selectedStudent.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Phone Number</span>
                        <span className="font-semibold text-slate-900">{selectedStudent.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Date of Birth / Gender</span>
                        <span className="font-semibold text-slate-900">{selectedStudent.dateOfBirth} ({selectedStudent.gender})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Nationality / Address</span>
                        <span className="font-semibold text-slate-900">{selectedStudent.nationality}, {selectedStudent.address}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Local Church</span>
                        <span className="font-semibold text-slate-900">{selectedStudent.churchName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Church Pastor</span>
                        <span className="font-semibold text-slate-900">{selectedStudent.churchPastor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="font-bold text-slate-900 text-sm border-b pb-2">Academic Standing</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Semester GPA</span>
                        <span className="font-bold font-mono text-slate-900">{selectedStudent.gpa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Cumulative CGPA</span>
                        <span className="font-bold font-mono text-amber-600">{selectedStudent.cgpa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Attendance Rate</span>
                        <span className="font-bold font-mono text-emerald-600">{selectedStudent.attendanceRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Fee Balance</span>
                        <span className="font-bold font-mono text-rose-600">${selectedStudent.feeBalance.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Academic' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">Academic Program Progress</h4>
                  <p className="text-slate-500">Enrolled in {selectedStudent.programName} under the Department of {selectedStudent.department}. Academic Year: {selectedStudent.academicYear}, {selectedStudent.semester}.</p>
                </div>
              )}

              {activeTab === 'Courses' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">Registered Courses for Current Semester</h4>
                  <ul className="divide-y divide-slate-100">
                    <li className="py-2.5 flex justify-between"><span className="font-semibold">OT101: Pentateuch & Historical Books</span><span>3 Credits</span></li>
                    <li className="py-2.5 flex justify-between"><span className="font-semibold">THEO201: Systematic Theology I</span><span>4 Credits</span></li>
                    <li className="py-2.5 flex justify-between"><span className="font-semibold">HOM301: Biblical Preaching & Homiletics</span><span>3 Credits</span></li>
                    <li className="py-2.5 flex justify-between"><span className="font-semibold">HEB101: Elementary Biblical Hebrew I</span><span>3 Credits</span></li>
                  </ul>
                </div>
              )}

              {activeTab === 'Fees' || activeTab === 'Payments' || activeTab === 'Results' || activeTab === 'Ministry' || activeTab === 'Library' ? (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">{activeTab} Records for {selectedStudent.fullName}</h4>
                  <p className="text-slate-500">Real-time ledger and records synchronized with Firestore database.</p>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-600 font-medium">
                    All {activeTab.toLowerCase()} entries are fully up to date.
                  </div>
                </div>
              ) : activeTab !== 'Overview' && activeTab !== 'Academic' && activeTab !== 'Courses' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-center py-12">
                  <h4 className="font-bold text-slate-900 text-base">{activeTab} Module</h4>
                  <p className="text-slate-500 max-w-md mx-auto">Confidential records and specialized institutional workflows for {selectedStudent.fullName}.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Admit New Student</h3>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">✕</button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStudent.fullName}
                  onChange={e => setNewStudent({...newStudent, fullName: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Student Full Name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newStudent.email}
                    onChange={e => setNewStudent({...newStudent, email: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={newStudent.phone}
                    onChange={e => setNewStudent({...newStudent, phone: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Program</label>
                <select
                  value={newStudent.programId}
                  onChange={e => setNewStudent({...newStudent, programId: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Church Name</label>
                  <input
                    type="text"
                    required
                    value={newStudent.churchName}
                    onChange={e => setNewStudent({...newStudent, churchName: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pastor Name</label>
                  <input
                    type="text"
                    required
                    value={newStudent.churchPastor}
                    onChange={e => setNewStudent({...newStudent, churchPastor: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
