import React, { useState } from 'react';
import { Search, Calendar, User, Clock, ArrowRight, X, ChevronRight } from 'lucide-react';
import { erpService } from '../../../services/erpService';
import { NewsArticle } from '../../../types';

interface NewsPageProps {
  initialArticleId?: string | null;
  onNavigate: (route: string) => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({ initialArticleId, onNavigate }) => {
  const articles = erpService.getNewsArticles();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(initialArticleId || null);

  const categories = ['ALL', 'Academic', 'Chapel', 'Missions', 'Commencement', 'Faculty'];

  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const activeArticle = articles.find(a => a.id === activeArticleId);

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              Institutional News
            </div>
            <h1 className="font-serif font-black text-4xl sm:text-5xl text-white tracking-tight mb-4">
              Seminary News & Theological Articles
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Read the latest dispatches, academic research publications, chapel sermons, and faculty reflections from Grace Seminary.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-amber-400 shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? 'All Articles' : cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => setActiveArticleId(art.id)}
              className="bg-white rounded-3xl border border-slate-200 hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="h-52 overflow-hidden bg-slate-100">
                  <img
                    src={art.featuredImage}
                    alt={art.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-2">
                    <span>{art.category}</span>
                    <span>•</span>
                    <span className="text-slate-400 font-normal">{art.readTime}</span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-slate-950 group-hover:text-amber-800 transition-colors line-clamp-2 mb-3">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {art.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>{art.date}</span>
                <span className="font-bold text-amber-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setActiveArticleId(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1.5 rounded-xl hover:bg-slate-100 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-64 sm:h-80 overflow-hidden bg-slate-950 relative">
              <img
                src={activeArticle.featuredImage}
                alt={activeArticle.title}
                className="w-full h-full object-cover object-center opacity-85"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            <div className="p-6 sm:p-10">
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                  {activeArticle.category}
                </span>
                <span>{activeArticle.date}</span>
                <span>•</span>
                <span>{activeArticle.readTime}</span>
              </div>

              <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-950 leading-tight mb-4">
                {activeArticle.title}
              </h1>

              <div className="flex items-center gap-3 border-y border-slate-100 py-3 mb-6 text-xs text-slate-600">
                <User className="w-4 h-4 text-amber-600" />
                <span>Author: <strong className="text-slate-900">{activeArticle.author}</strong></span>
              </div>

              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 space-y-4">
                <p className="font-semibold text-slate-900 text-base leading-relaxed">
                  {activeArticle.summary}
                </p>
                <div className="whitespace-pre-line">
                  {activeArticle.content}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveArticleId(null)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
                >
                  Close Article
                </button>

                <button
                  onClick={() => {
                    setActiveArticleId(null);
                    onNavigate('/apply');
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Apply to Grace Seminary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
