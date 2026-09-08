import React, { useState } from 'react';
import { 
  Search, BookOpen, GraduationCap, Clock, Award, 
  ArrowRight, CheckCircle2, ChevronRight, X, UserCheck 
} from 'lucide-react';
import { erpService } from '../../../services/erpService';
import { Program } from '../../../types';

interface ProgramsPageProps {
  initialProgramId?: string | null;
  onNavigate: (route: string) => void;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({ initialProgramId, onNavigate }) => {
  const allPrograms = erpService.getPrograms();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAward, setSelectedAward] = useState<string>('ALL');
  const [detailProgramId, setDetailProgramId] = useState<string | null>(initialProgramId || null);

  const awardTypes = ['ALL', 'Certificate', 'Diploma', 'Bachelor', 'Master', 'Doctorate'];

  const filteredPrograms = allPrograms.filter(prog => {
    const matchesSearch = prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prog.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prog.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prog.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAward = selectedAward === 'ALL' || prog.awardType === selectedAward;
    return matchesSearch && matchesAward;
  });

  const selectedProgram = allPrograms.find(p => p.id === detailProgramId);

  return (
    <div className="w-full bg-slate-50 text-slate-900 min-h-screen">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              Academic Catalogue
            </div>
            <h1 className="font-serif font-black text-4xl sm:text-5xl text-white tracking-tight mb-4">
              Theological Programs & Degrees
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Explore our accredited certificates, diplomas, bachelor degrees, and graduate programs designed to prepare you for faithful pulpit and cross-cultural ministry.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Award Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {awardTypes.map((award) => (
                <button
                  key={award}
                  onClick={() => setSelectedAward(award)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedAward === award
                      ? 'bg-slate-900 text-amber-400 shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {award === 'ALL' ? 'All Degrees' : `${award}s`}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by degree, code, major..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold text-slate-500">
            Showing <span className="font-bold text-slate-900">{filteredPrograms.length}</span> accredited programs
          </p>
        </div>

        {filteredPrograms.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-slate-800 mb-1">No programs found</h3>
            <p className="text-xs text-slate-500 mb-4">Try clearing your search query or selecting a different award level.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedAward('ALL'); }}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                      {prog.awardType}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {prog.code}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-slate-950 mb-2 group-hover:text-amber-800 transition-colors leading-snug">
                    {prog.name}
                  </h3>

                  <p className="text-xs font-semibold text-amber-700 mb-3">
                    {prog.department}
                  </p>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-6">
                    {prog.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-6 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Duration</span>
                      <span className="font-bold text-slate-800">{prog.durationYears} {prog.durationYears === 1 ? 'Year' : 'Years'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Credits</span>
                      <span className="font-bold text-slate-800">{prog.creditRequirements} hrs</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setDetailProgramId(prog.id)}
                    className="text-xs font-bold text-slate-700 hover:text-slate-950 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Curriculum</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onNavigate(`/apply?prog=${prog.id}`)}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 relative rounded-t-3xl border-b border-slate-800">
              <button
                onClick={() => setDetailProgramId(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedProgram.awardType}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Code: {selectedProgram.code}
                </span>
              </div>

              <h2 className="font-serif font-black text-2xl sm:text-3xl text-white mb-2">
                {selectedProgram.name}
              </h2>
              <p className="text-amber-400 text-xs font-semibold">
                {selectedProgram.department} • {selectedProgram.durationYears} {selectedProgram.durationYears === 1 ? 'Year' : 'Years'} • {selectedProgram.creditRequirements} Credit Hours
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="font-serif font-bold text-base text-slate-900 mb-2">Program Overview</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {selectedProgram.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    Entry Prerequisites
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• Secondary Certificate / Prior theological credits</li>
                    <li>• Recommendation letter from home church pastor</li>
                    <li>• Personal testimony of Christian faith and calling</li>
                  </ul>
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    Career & Ministry Outcomes
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• Senior Pastor / Associate Minister</li>
                    <li>• Cross-Cultural Missionary / Church Planter</li>
                    <li>• Bible College Lecturer / Academic Tutor</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-base text-slate-900 mb-2">Core Curricular Modules</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Biblical Hermeneutics & Exegesis</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Systematic Theology I & II</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Old & New Testament Survey</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Expository Preaching Practicum</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Church History & Reformed Thought</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Pastoral Counseling & Care</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => setDetailProgramId(null)}
                  className="px-5 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100"
                >
                  Close Catalogue
                </button>

                <button
                  onClick={() => {
                    setDetailProgramId(null);
                    onNavigate(`/apply?prog=${selectedProgram.id}`);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
                >
                  <span>Apply for this Program</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
