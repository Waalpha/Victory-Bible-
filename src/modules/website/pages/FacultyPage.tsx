import React, { useState } from 'react';
import { Search, Mail, BookOpen, Award, GraduationCap, X, ChevronRight, Phone } from 'lucide-react';
import { erpService } from '../../../services/erpService';
import { Staff } from '../../../types';

interface FacultyPageProps {
  onNavigate: (route: string) => void;
}

export const FacultyPage: React.FC<FacultyPageProps> = ({ onNavigate }) => {
  const staffMembers = erpService.getStaff();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [activeBioMember, setActiveBioMember] = useState<Staff | null>(null);

  const departments = ['ALL', 'Biblical Studies', 'Systematic Theology', 'Pastoral Studies', 'Missions & Intercultural', 'Church History'];

  const filteredFaculty = staffMembers.filter(member => {
    const matchesSearch = member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || member.department.toLowerCase().includes(selectedDept.toLowerCase());
    return matchesSearch && matchesDept;
  });

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              Academic Mentorship
            </div>
            <h1 className="font-serif font-black text-4xl sm:text-5xl text-white tracking-tight mb-4">
              Our Faculty of Pastor-Scholars
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Meet the godly men and women who bring rigorous scholarship, genuine pastoral warmth, and decades of ministry experience to the classroom.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Department Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedDept === dept
                      ? 'bg-slate-900 text-amber-400 shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dept === 'ALL' ? 'All Faculty' : dept}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search faculty by name, field..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFaculty.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="h-64 overflow-hidden relative bg-slate-100">
                  <img
                    src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
                    alt={member.fullName}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-400 border border-amber-500/30 font-mono">
                    {member.department}
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                    {member.position}
                  </span>
                  <h3 className="font-serif font-bold text-xl text-slate-950 group-hover:text-amber-800 transition-colors mb-2">
                    {member.fullName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 font-mono mb-3">
                    {member.qualifications}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {member.specialization}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {member.email}
                </span>
                <button
                  onClick={() => setActiveBioMember(member)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Profile</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Faculty Bio Modal */}
      {activeBioMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden relative">
            <button
              onClick={() => setActiveBioMember(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 pb-6 mb-6">
                <img
                  src={activeBioMember.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                  alt={activeBioMember.fullName}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-amber-500/20 shadow-md shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                    {activeBioMember.position} • {activeBioMember.department}
                  </span>
                  <h2 className="font-serif font-black text-2xl text-slate-950 mt-1 mb-1">
                    {activeBioMember.fullName}
                  </h2>
                  <p className="text-xs font-mono font-bold text-slate-500 mb-2">
                    {activeBioMember.qualifications}
                  </p>
                  <p className="text-xs text-slate-600">
                    <span className="font-bold">Focus Area:</span> {activeBioMember.specialization}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                <h4 className="font-serif font-bold text-sm text-slate-900">Academic & Pastoral Biography</h4>
                <p>
                  {activeBioMember.fullName} serves with distinction on the faculty of Victory International Apostolic Biblical Institute. With over a decade of dedicated teaching and pastoral shepherding, they mentor candidates across bachelor, master, and doctoral cohorts.
                </p>
                <p>
                  Their scholarly research focuses on {activeBioMember.specialization}, with numerous publications in evangelical theological journals and monographs presented at ACTEA theological colloquiums.
                </p>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[11px] text-slate-500"><span className="font-bold">Email:</span> {activeBioMember.email}</p>
                    <p className="text-[11px] text-slate-500"><span className="font-bold">Phone:</span> {activeBioMember.phone}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveBioMember(null);
                      onNavigate('/contact');
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
                  >
                    Schedule Office Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
