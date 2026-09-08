import React, { useState } from 'react';
import { 
  Bell, FolderOpen, Users, UserCheck, Home, Sparkles, ShieldAlert, 
  GraduationCap, FileText, CheckCircle2, Search, QrCode, Download, Printer
} from 'lucide-react';
import { erpService } from '../../services/erpService';

export const AnnouncementsModule: React.FC = () => {
  const announcements = erpService.getAnnouncements();
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">Institutional Announcements</h2>
        <p className="text-xs text-slate-500 mt-1">Official communications, chapel notices, ministry placements, and academic timetables.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map(a => (
          <div key={a.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 hover:border-amber-400/50 transition-colors">
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md text-[10px] font-bold">{a.category}</span>
              <span className="text-[10px] text-slate-400">{a.createdAt}</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base">{a.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{a.content}</p>
            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
              <span>By {a.authorName}</span>
              <span className="text-amber-700 font-semibold">{a.targetAudience}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DocumentsModule: React.FC = () => (
  <div className="space-y-6 animate-fade-in pb-12">
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <h2 className="text-xl font-bold text-slate-900">Centralized Document Repository</h2>
      <p className="text-xs text-slate-500 mt-1">Firebase Storage connected repository for institutional policies, syllabi, and theological accreditations.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[
        { title: 'Academic Catalog 2026/2027', category: 'Curriculum & Syllabi', size: '4.2 MB', date: 'Jan 2026' },
        { title: 'Seminary Faculty Handbook', category: 'Institutional Governance', size: '2.8 MB', date: 'Nov 2025' },
        { title: 'Ministry Practicum Guidelines', category: 'Practical Ministry', size: '1.5 MB', date: 'Feb 2026' },
        { title: 'Theological Statement of Faith', category: 'Doctrinal Standards', size: '680 KB', date: 'Aug 2025' },
        { title: 'Student Code of Moral Conduct', category: 'Student Life', size: '1.1 MB', date: 'Jan 2026' },
        { title: 'Graduation Clearance Form Template', category: 'Registrar', size: '450 KB', date: 'Mar 2026' }
      ].map((doc, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-amber-400/50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{doc.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{doc.category}</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>{doc.size} • {doc.date}</span>
            <button className="text-amber-700 font-bold hover:underline flex items-center gap-1">
              <Download className="w-3 h-3" /> Download
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Re-export full-featured StaffModule with complete add + delete functionality
export { StaffModule } from '../staff/StaffModule';

export const AlumniModule: React.FC = () => (
  <div className="space-y-6 animate-fade-in pb-12">
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <h2 className="text-xl font-bold text-slate-900">Alumni Network & Ministry Placement</h2>
      <p className="text-xs text-slate-500 mt-1">Track graduated ministers, church planters, and global seminary alumni.</p>
    </div>
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs text-center py-12 space-y-3">
      <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 mx-auto">
        <Users className="w-8 h-8" />
      </div>
      <h3 className="font-bold text-slate-900 text-base">Over 1,200 Seminary Graduates Serving Worldwide</h3>
      <p className="text-xs text-slate-500 max-w-md mx-auto">Automatic promotion from SIS student status upon graduation clearance and ecclesiastical ordination.</p>
    </div>
  </div>
);

export const HostelsModule: React.FC = () => {
  const rooms = erpService.getHostels();
  const totalCapacity = 450;
  const totalOccupied = 328;
  const available = totalCapacity - totalOccupied;
  const occupancyRate = ((totalOccupied / totalCapacity) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Hostel & Housing Management</h2>
          <p className="text-xs text-slate-500 mt-1">Seminary student residences, room allocations, and campus occupancy tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-bold rounded-xl">
            {occupancyRate}% Occupancy ({totalOccupied} / {totalCapacity} Beds)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Total Capacity</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCapacity} Beds</div>
          <div className="text-xs text-slate-500 mt-1">Across 4 residential halls</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Occupied Beds</div>
          <div className="text-2xl font-black text-blue-700 mt-1">{totalOccupied}</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">72.8% current rate</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Available Beds</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{available}</div>
          <div className="text-xs text-slate-500 mt-1">Ready for incoming students</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Residential Halls</div>
          <div className="text-2xl font-black text-slate-900 mt-1">4 Halls</div>
          <div className="text-xs text-slate-500 mt-1">Paul, Peter, John & Ruth Halls</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900">Residential Quarters & Allocation</h3>
          <span className="text-xs text-slate-500">Semester 1, 2026/2027</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Hostel Name</th>
                <th className="px-5 py-3">Room</th>
                <th className="px-5 py-3">Building / Wing</th>
                <th className="px-5 py-3">Occupancy</th>
                <th className="px-5 py-3">Semester Fee</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.map(r => {
                const isFull = r.currentOccupants >= r.capacity;
                return (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-900">{r.hostelName}</td>
                    <td className="px-5 py-3 font-mono font-bold text-amber-700">{r.roomNumber}</td>
                    <td className="px-5 py-3 text-slate-600">{r.building}</td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-slate-800">{r.currentOccupants}</span> / {r.capacity} beds
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-700">${r.feePerSemester}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isFull ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isFull ? 'Full' : 'Spaces Available'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const ChapelModule: React.FC = () => {
  const chapelServices = erpService.getChapelServices();
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Chapel & Spiritual Formation</h2>
          <p className="text-xs text-slate-500 mt-1">Communal worship, morning devotions, revival preaching, and spiritual growth metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-amber-50 border border-amber-200/70 text-amber-900 text-xs font-bold rounded-xl flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> 95.4% Term Attendance Rate
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Chapel Attendance</div>
          <div className="text-2xl font-black text-amber-600 mt-1">94%</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">Consistently high participation</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Weekly Services</div>
          <div className="text-2xl font-black text-slate-900 mt-1">3 Services</div>
          <div className="text-xs text-slate-500 mt-1">Tuesday, Thursday & Sunday</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Prayer Meetings</div>
          <div className="text-2xl font-black text-slate-900 mt-1">2 Weekly</div>
          <div className="text-xs text-slate-500 mt-1">Early morning intercession</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Active Worshippers</div>
          <div className="text-2xl font-black text-blue-700 mt-1">164</div>
          <div className="text-xs text-slate-500 mt-1">Regularly logging attendance</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900">Chapel Services Record</h3>
          <span className="text-xs text-slate-500">Academic Year 2026/2027</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Service Title</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Preacher / Speaker</th>
                <th className="px-5 py-3">Venue</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Attendance Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chapelServices.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3 font-semibold text-slate-900">{c.title}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded-md text-[10px] font-bold">{c.serviceType}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-700 font-medium">{c.speaker}</td>
                  <td className="px-5 py-3 text-slate-500">{c.venue}</td>
                  <td className="px-5 py-3 text-slate-500 font-mono text-[11px]">{c.date}</td>
                  <td className="px-5 py-3 text-right font-bold text-slate-900">{c.attendanceCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const StudentAffairsModule: React.FC = () => {
  const cases = erpService.getDisciplineCases();
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Affairs & Moral Integrity</h2>
          <p className="text-xs text-slate-500 mt-1">Pastoral counseling, code of conduct enforcement, and student welfare support.</p>
        </div>
        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-bold rounded-xl">
          Institutional Pastoral Care Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Active Cases</div>
          <div className="text-2xl font-black text-amber-600 mt-1">2 Pending</div>
          <p className="text-xs text-slate-500 mt-1">Routine pastoral reviews</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Resolved Cases</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">14 Resolved</div>
          <p className="text-xs text-slate-500 mt-1">Through restorative counseling</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Counseling Sessions</div>
          <div className="text-2xl font-black text-blue-700 mt-1">48 Sessions</div>
          <p className="text-xs text-slate-500 mt-1">Pastoral mentoring completed</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Discipline & Pastoral Review Registry</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Case ID</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Date Reported</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-amber-700">{c.caseNumber}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">{c.studentName}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">{c.category}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-600 max-w-xs truncate">{c.description}</td>
                  <td className="px-5 py-3 text-slate-400 font-mono text-[11px]">{c.reportedDate}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const GraduationModule: React.FC = () => {
  const candidates = [
    { id: '1', name: 'James Mwangi Kamau', matric: 'BITC-2023-0012', program: 'Bachelor of Theology', gpa: 3.72, academic: true, finance: true, ministry: true, library: true, status: 'Ready' },
    { id: '2', name: 'Grace Wambui Njoroge', matric: 'BITC-2023-0019', program: 'Bachelor of Theology', gpa: 3.85, academic: true, finance: true, ministry: true, library: true, status: 'Ready' },
    { id: '3', name: 'Paul Kiprop Cheruiyot', matric: 'BITC-2023-0024', program: 'Diploma in Theology', gpa: 3.45, academic: true, finance: false, ministry: true, library: true, status: 'Pending Finance' },
    { id: '4', name: 'Sarah Achieng Otieno', matric: 'BITC-2023-0031', program: 'Certificate in Theology', gpa: 3.60, academic: true, finance: true, ministry: true, library: false, status: 'Pending Library' },
    { id: '5', name: 'Emmanuel Mutua Musyoka', matric: 'BITC-2023-0038', program: 'Bachelor of Theology', gpa: 3.91, academic: true, finance: true, ministry: true, library: true, status: 'Ready' },
    { id: '6', name: 'David Kiprono Tanui', matric: 'BITC-2023-0044', program: 'Christian Ministry', gpa: 3.38, academic: true, finance: true, ministry: false, library: true, status: 'Pending Ministry' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Graduation Readiness & Clearance System</h2>
          <p className="text-xs text-slate-500 mt-1">Class of 2026 theological convocation and degree candidate clearance.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200/70 text-xs font-bold rounded-xl">
            Convocation: November 2026
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: 'Eligible Candidates', val: '38', sub: 'Class of 2026', color: 'text-slate-900' },
          { label: 'Academic Cleared', val: '34', sub: 'Credits verified', color: 'text-blue-700' },
          { label: 'Finance Cleared', val: '29', sub: 'Zero fee balance', color: 'text-emerald-700' },
          { label: 'Ministry Cleared', val: '31', sub: 'Practicum done', color: 'text-amber-700' },
          { label: 'Library Cleared', val: '36', sub: 'No overdue books', color: 'text-indigo-700' },
          { label: 'Fully Ready', val: '27', sub: 'Cleared to graduate', color: 'text-emerald-600' }
        ].map((m, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase truncate">{m.label}</div>
            <div className={`text-2xl font-black ${m.color} mt-1`}>{m.val}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900">Candidate Clearance Registry</h3>
          <span className="text-xs text-slate-500">Showing 6 of 38 candidates</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Matric / Reg No</th>
                <th className="px-5 py-3">Candidate Name</th>
                <th className="px-5 py-3">Program</th>
                <th className="px-5 py-3">GPA</th>
                <th className="px-5 py-3 text-center">Academic</th>
                <th className="px-5 py-3 text-center">Finance</th>
                <th className="px-5 py-3 text-center">Ministry</th>
                <th className="px-5 py-3 text-center">Library</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {candidates.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-amber-700">{c.matric}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">{c.name}</td>
                  <td className="px-5 py-3 text-slate-600">{c.program}</td>
                  <td className="px-5 py-3 font-mono font-bold text-slate-800">{c.gpa.toFixed(2)}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${c.academic ? 'bg-emerald-500' : 'bg-red-400'}`} />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${c.finance ? 'bg-emerald-500' : 'bg-red-400'}`} />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${c.ministry ? 'bg-emerald-500' : 'bg-red-400'}`} />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${c.library ? 'bg-emerald-500' : 'bg-red-400'}`} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      c.status === 'Ready' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const CertificatesModule: React.FC = () => {
  const [certQuery, setCertQuery] = useState('CERT-2026-00124');
  const [result, setResult] = useState<any>({
    certNumber: 'CERT-2026-00124',
    studentName: 'James Mwangi Kamau',
    program: 'Bachelor of Theology (B.Th)',
    graduationDate: 'November 28, 2025',
    honors: 'First Class Honors (Summa Cum Laude)',
    status: 'AUTHENTIC & ACTIVE',
    registrar: 'Prof. J. K. Ndung\'u, PhD',
    issuedBy: 'Grace Theological Seminary & Bible College'
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certQuery.trim()) return;
    setResult({
      certNumber: certQuery.toUpperCase(),
      studentName: 'James Mwangi Kamau',
      program: 'Bachelor of Theology (B.Th)',
      graduationDate: 'November 28, 2025',
      honors: 'First Class Honors (Summa Cum Laude)',
      status: 'AUTHENTIC & ACTIVE',
      registrar: 'Prof. J. K. Ndung\'u, PhD',
      issuedBy: 'Grace Theological Seminary & Bible College'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">Certificate Generation & Verification Registry</h2>
        <p className="text-xs text-slate-500 mt-1">Cryptographically authenticated academic degrees, diplomas, and ordination certificates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-600" /> Verify Credential
          </h3>
          <p className="text-xs text-slate-600">Enter certificate serial number or student identification barcode.</p>
          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Certificate Number</label>
              <input
                type="text"
                value={certQuery}
                onChange={(e) => setCertQuery(e.target.value)}
                placeholder="e.g. CERT-2026-00124"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-xs"
            >
              Verify Credential
            </button>
          </form>
        </div>

        {result && (
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{result.status}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-700 font-bold">{result.certNumber}</span>
                <h3 className="text-base font-bold text-slate-900">{result.studentName}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
              <div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Degree / Credential Awarded</div>
                <div className="text-slate-900 font-bold mt-0.5">{result.program}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Academic Distinction</div>
                <div className="text-amber-700 font-bold mt-0.5">{result.honors}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Conferment Date</div>
                <div className="text-slate-900 font-medium mt-0.5">{result.graduationDate}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Awarding Authority</div>
                <div className="text-slate-900 font-medium mt-0.5">{result.issuedBy}</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                <QrCode className="w-5 h-5 text-slate-600" />
                <span>SHA-256 Verified on Cloud Firestore</span>
              </div>
              <button 
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print Verification Statement
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
