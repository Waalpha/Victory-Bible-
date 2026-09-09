import React, { useState } from 'react';
import { BookOpen, Layers, Calendar, CheckSquare, Award } from 'lucide-react';
import { erpService } from '../../services/erpService';

export const AcademicsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'programs' | 'departments' | 'courses' | 'timetable' | 'attendance' | 'assignments'>('programs');
  
  const programs = erpService.getPrograms();
  const departments = erpService.getDepartments();
  const courses = erpService.getCourses();
  const timetable = erpService.getTimetable();
  const assignments = erpService.getAssignments();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Academics & Theological Curriculum</h2>
          <p className="text-xs text-slate-500">Manage theological programs, departments, courses, timetables, and faculty assignments.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto">
          {[
            { id: 'programs', label: 'Programs' },
            { id: 'departments', label: 'Departments' },
            { id: 'courses', label: 'Courses' },
            { id: 'timetable', label: 'Timetable' },
            { id: 'assignments', label: 'Assignments' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'programs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map(prog => (
            <div key={prog.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-700 font-bold rounded-lg font-mono text-[10px]">{prog.code}</span>
                  <span className="text-xs font-semibold text-slate-500">{prog.durationYears} Year(s)</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{prog.name}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{prog.description}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                <span>{prog.creditRequirements} Credits Req.</span>
                <span className="font-semibold text-emerald-600">{prog.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map(dept => (
            <div key={dept.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg font-mono text-xs">{dept.code}</span>
                <span className="text-xs font-semibold text-emerald-600">{dept.status}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{dept.name}</h3>
              <p className="text-xs text-slate-600">{dept.description}</p>
              <div className="pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-400">Head of Department: </span>
                <span className="font-semibold text-slate-900">{dept.headOfDepartment}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                <th className="p-4">Code</th>
                <th className="p-4">Course Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Credit Hours</th>
                <th className="p-4">Lecturer</th>
                <th className="p-4">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {courses.map(c => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono font-bold text-slate-900">{c.code}</td>
                  <td className="p-4 font-bold text-slate-900">{c.title}</td>
                  <td className="p-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md">{c.category}</span></td>
                  <td className="p-4 font-mono">{c.creditHours} Credits</td>
                  <td className="p-4 text-slate-900 font-medium">{c.lecturerName || 'TBA'}</td>
                  <td className="p-4 text-slate-500">{c.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                <th className="p-4">Day</th>
                <th className="p-4">Time</th>
                <th className="p-4">Course</th>
                <th className="p-4">Lecturer</th>
                <th className="p-4">Venue</th>
                <th className="p-4">Program</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {timetable.map(t => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-emerald-700">{t.day}</td>
                  <td className="p-4 font-mono">{t.startTime} - {t.endTime}</td>
                  <td className="p-4 font-bold text-slate-900">{t.courseCode}: {t.courseTitle}</td>
                  <td className="p-4">{t.lecturerName}</td>
                  <td className="p-4 font-mono text-slate-600">{t.room}</td>
                  <td className="p-4 text-slate-500">{t.program}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map(a => (
            <div key={a.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-slate-900 text-white font-mono rounded-lg text-[10px] font-bold">{a.courseCode}</span>
                <span className="text-xs font-semibold text-rose-600">Deadline: {a.deadline}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{a.title}</h3>
              <p className="text-xs text-slate-600">{a.description}</p>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400">Max Marks: {a.maxMarks}</span>
                <span className="font-semibold text-emerald-700">Published</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
