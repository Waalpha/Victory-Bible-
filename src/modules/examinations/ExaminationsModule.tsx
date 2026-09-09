import React, { useState } from 'react';
import { Award, FileText, CheckCircle, Printer, QrCode } from 'lucide-react';
import { erpService } from '../../services/erpService';

export const ExaminationsModule: React.FC = () => {
  const [activeSub, setActiveSub] = useState<'results' | 'transcript' | 'certificates'>('results');
  const results = erpService.getResults();
  const students = erpService.getStudents();
  const settings = erpService.getSettings();

  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const targetStudent = students.find(s => s.id === selectedStudentId) || students[0];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Examinations, Results & Academic Transcripts</h2>
          <p className="text-xs text-slate-500">Configure grading rules, grade exams, generate official academic transcripts and secure certificates.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'results', label: 'Results Approval Workflow' },
            { id: 'transcript', label: 'Transcript Generator' },
            { id: 'certificates', label: 'Certificate Generator' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSub(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeSub === tab.id ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeSub === 'results' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">Examination Results Approval Queue</h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">Dean Review & Registrar Publishing</span>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                <th className="p-4">Student Name</th>
                <th className="p-4">Course</th>
                <th className="p-4">Marks</th>
                <th className="p-4">Grade</th>
                <th className="p-4">Grade Point</th>
                <th className="p-4">Workflow Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {results.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{r.studentName}</td>
                  <td className="p-4 font-mono">{r.courseCode}</td>
                  <td className="p-4 font-mono font-bold">{r.marksObtained} / {r.maxMarks}</td>
                  <td className="p-4 font-bold text-emerald-600 font-mono text-sm">{r.grade}</td>
                  <td className="p-4 font-mono">{r.gradePoint}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-semibold text-[10px]">
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-emerald-700 font-semibold inline-flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Published</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSub === 'transcript' && targetStudent && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <label className="text-xs font-bold text-slate-700">Select Student:</label>
              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.fullName} ({s.studentNumber})</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Transcript</span>
            </button>
          </div>

          {/* Official Academic Transcript Document View */}
          <div className="bg-white p-12 rounded-3xl border border-slate-300 shadow-xl max-w-4xl mx-auto space-y-8 font-serif text-slate-900">
            {/* Header */}
            <div className="text-center space-y-2 border-b-2 border-slate-900 pb-6">
              <h1 className="text-2xl font-extrabold tracking-widest uppercase">{settings.institutionName}</h1>
              <p className="text-xs font-sans text-slate-600 font-medium">{settings.address} • Tel: {settings.phone}</p>
              <h2 className="text-lg font-bold text-emerald-800 uppercase tracking-wide pt-2">Official Academic Transcript</h2>
            </div>

            {/* Student Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs font-sans bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-500 block">Student Name:</span>
                <span className="font-bold text-slate-900 text-sm">{targetStudent.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Student Number:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{targetStudent.studentNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Program of Study:</span>
                <span className="font-bold text-slate-900">{targetStudent.programName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Department:</span>
                <span className="font-bold text-slate-900">{targetStudent.department}</span>
              </div>
            </div>

            {/* Courses Table */}
            <div className="space-y-4">
              <h3 className="font-sans font-bold text-sm text-slate-900 uppercase">Academic Record — Semester 1, 2026/2027</h3>
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="p-3">Course Code</th>
                    <th className="p-3">Course Title</th>
                    <th className="p-3">Credits</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Grade Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-mono font-bold">OT101</td>
                    <td className="p-3 font-semibold">Pentateuch & Historical Books</td>
                    <td className="p-3">3</td>
                    <td className="p-3 font-bold text-emerald-800">A</td>
                    <td className="p-3 font-mono">4.0</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold">THEO201</td>
                    <td className="p-3 font-semibold">Systematic Theology I</td>
                    <td className="p-3">4</td>
                    <td className="p-3 font-bold text-emerald-800">A</td>
                    <td className="p-3 font-mono">4.0</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold">HOM301</td>
                    <td className="p-3 font-semibold">Biblical Preaching & Homiletics</td>
                    <td className="p-3">3</td>
                    <td className="p-3 font-bold text-emerald-800">B+</td>
                    <td className="p-3 font-mono">3.5</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* GPA Summary */}
            <div className="flex justify-between items-center bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200 font-sans text-xs">
              <div>
                <span className="text-slate-600">Semester GPA: <strong className="font-mono text-slate-900 text-sm">3.85</strong></span>
              </div>
              <div>
                <span className="text-slate-600">Cumulative GPA (CGPA): <strong className="font-mono text-emerald-800 text-sm">{targetStudent.cgpa}</strong></span>
              </div>
              <div>
                <span className="text-slate-600">Classification: <strong className="text-slate-900">First Class Honors</strong></span>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-12 grid grid-cols-2 gap-8 font-sans text-xs">
              <div className="space-y-2 border-t border-slate-400 pt-3">
                <p className="font-bold text-slate-900">Registrar Signature</p>
                <p className="text-slate-500">{settings.institutionName}</p>
              </div>
              <div className="space-y-2 border-t border-slate-400 pt-3 text-right">
                <p className="font-bold text-slate-900">Official Institution Stamp</p>
                <p className="text-slate-500 font-mono text-[10px]">Verification Code: GRC-VER-99281</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSub === 'certificates' && targetStudent && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <label className="text-xs font-bold text-slate-700">Select Graduate:</label>
              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.fullName} ({s.programName})</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-[#15803D] hover:bg-[#14532D] text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Secure Certificate</span>
            </button>
          </div>

          {/* Certificate View */}
          <div className="bg-emerald-50/25 p-16 rounded-3xl border-8 border-double border-emerald-600/60 shadow-2xl max-w-4xl mx-auto text-center space-y-8 font-serif">
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-emerald-700 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                ✝
              </div>
              <h2 className="text-2xl font-extrabold uppercase tracking-widest text-slate-900">{settings.institutionName}</h2>
              <p className="text-xs font-sans tracking-widest text-emerald-800 uppercase font-bold">Behold the Word of Truth</p>
            </div>

            <div className="space-y-4 py-4">
              <p className="text-sm italic text-slate-600">This is to certify that</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-wide font-serif underline decoration-emerald-600/60 decoration-1 underline-offset-8">
                {targetStudent.fullName}
              </h1>
              <p className="text-sm italic text-slate-600 pt-2">having successfully completed the prescribed course of study and fulfilled all academic and spiritual formation requirements has been conferred the award of</p>
              <h3 className="text-2xl font-bold text-emerald-900 uppercase tracking-wide pt-2">
                {targetStudent.programName}
              </h3>
              <p className="text-xs font-sans text-slate-500">with all the rights, honors, and privileges appertaining thereto.</p>
            </div>

            <div className="pt-12 grid grid-cols-3 gap-4 items-center font-sans text-xs">
              <div className="text-left space-y-1 border-t border-slate-400 pt-3">
                <p className="font-bold text-slate-900">Academic Dean</p>
                <p className="text-slate-500">Victory International Apostolic Biblical Institute Seminary</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-700 font-bold text-xs">
                  SEAL
                </div>
                <span className="text-[10px] text-slate-400 mt-1 font-mono">Cert #: GRC-2026-8801</span>
              </div>
              <div className="text-right space-y-1 border-t border-slate-400 pt-3">
                <p className="font-bold text-slate-900">President</p>
                <p className="text-slate-500">{settings.institutionName}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
