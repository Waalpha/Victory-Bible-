import React, { useState } from 'react';
import { BookOpen, Search, Clock, ExternalLink, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { erpService } from '../../../services/erpService';

interface LibraryPageProps {
  onNavigate: (route: string) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ onNavigate }) => {
  const books = erpService.getBooks();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.isbn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              Theological Repository
            </div>
            <h1 className="font-serif font-black text-4xl sm:text-5xl text-white tracking-tight mb-4">
              The John Owen Theological Library
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              A premier research library housing over 25,000 print volumes, rare Puritan works, patristic writings, biblical language lexicons, and 100,000+ digital scholarly journals.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Catalogue Search Strip */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md">
          <div className="max-w-2xl mb-6">
            <h2 className="font-serif font-bold text-2xl text-slate-950 mb-2">
              Online Public Access Catalogue (OPAC)
            </h2>
            <p className="text-xs text-slate-500">
              Search our physical catalog for commentaries, systematic theologies, Greek and Hebrew lexicons.
            </p>
          </div>

          <div className="relative mb-6">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, author (e.g. Calvin, Grudem, Carson), category, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">Author</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Call Number</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredBooks.slice(0, 5).map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-900">{book.title}</td>
                    <td className="py-3 px-3">{book.author}</td>
                    <td className="py-3 px-3">{book.category}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{book.shelfLocation}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        book.availableCopies > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {book.availableCopies > 0 ? `${book.availableCopies} Copies Available` : 'Checked Out'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Digital Resources & Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h3 className="font-serif font-bold text-xl text-slate-950 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>Library Operating Hours</span>
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>Monday – Thursday:</span>
                <span className="font-bold text-slate-900">8:00 AM – 10:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>Friday:</span>
                <span className="font-bold text-slate-900">8:00 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>Saturday:</span>
                <span className="font-bold text-slate-900">9:00 AM – 5:00 PM</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Sunday & Public Holidays:</span>
                <span className="font-bold text-amber-800">Closed for Lord's Day Worship</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl">
            <h3 className="font-serif font-bold text-xl text-white mb-4">
              Electronic Research Databases
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              All enrolled students receive full off-campus proxy access to the ATLA Religion Database with ATLASerials, JSTOR Theological Collection, and EBSCOhost Digital Library.
            </p>
            <button
              onClick={() => onNavigate('/login')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <span>Access Digital Library (Student Login)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
