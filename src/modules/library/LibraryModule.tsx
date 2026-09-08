import React from 'react';
import { Library, BookOpen } from 'lucide-react';
import { erpService } from '../../services/erpService';

export const LibraryModule: React.FC = () => {
  const books = erpService.getLibraryBooks();
  const loans = erpService.getLibraryLoans();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Theological Library & Resource Center</h2>
          <p className="text-xs text-slate-500">Manage theological book catalogs, commentaries, Greek/Hebrew lexicons, and student loans.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 font-bold text-slate-900">Book Catalog</div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
              <th className="p-4">ISBN</th>
              <th className="p-4">Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">Publisher</th>
              <th className="p-4">Category</th>
              <th className="p-4">Available / Total</th>
              <th className="p-4">Shelf Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {books.map(b => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono font-bold">{b.isbn}</td>
                <td className="p-4 font-bold text-slate-900">{b.title}</td>
                <td className="p-4">{b.author}</td>
                <td className="p-4 text-slate-500">{b.publisher}</td>
                <td className="p-4"><span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md">{b.category}</span></td>
                <td className="p-4 font-mono font-bold text-emerald-600">{b.availableCopies} / {b.totalCopies}</td>
                <td className="p-4 font-mono text-slate-600">{b.shelfLocation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
