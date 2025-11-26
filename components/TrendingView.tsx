
import React, { useEffect, useState } from 'react';
import { TrendingNewsItem, AccentColor } from '../types';
import { getTrendingNews } from '../services/geminiService';
import { Loader2, MessageSquare, TrendingUp, Calendar, ExternalLink, RefreshCw } from 'lucide-react';

interface TrendingViewProps {
  onChatAbout: (item: TrendingNewsItem) => void;
  accentColor: AccentColor;
}

const accentStyles: Record<AccentColor, string> = {
  blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30',
  emerald: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30',
  violet: 'text-violet-600 bg-violet-50 hover:bg-violet-100 dark:bg-violet-900/20 dark:hover:bg-violet-900/30',
  amber: 'text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30',
  rose: 'text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/30',
};

export const TrendingView: React.FC<TrendingViewProps> = ({ onChatAbout, accentColor }) => {
  const [news, setNews] = useState<TrendingNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTrendingNews();
      setNews(data);
    } catch (err) {
      setError("Không thể tải tin tức mới nhất. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
        <Loader2 size={40} className={`animate-spin ${accentStyles[accentColor].split(' ')[0]}`} />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Đang quét tin tức nóng hổi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full text-red-500">
          <TrendingUp size={32} />
        </div>
        <p className="text-slate-600 dark:text-slate-300 font-medium">{error}</p>
        <button 
          onClick={fetchData}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${accentStyles[accentColor]}`}
        >
          <RefreshCw size={16} /> Thử lại
        </button>
      </div>
    );
  }

  const [mainNews, ...otherNews] = news;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${accentStyles[accentColor]} bg-opacity-20`}>
          <TrendingUp size={24} />
        </div>
        <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white">Xu hướng hôm nay</h2>
      </div>

      {/* Hero Card */}
      {mainNews && (
        <div className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <TrendingUp size={120} />
          </div>
          <div className="p-6 sm:p-8 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${accentStyles[accentColor]}`}>
                {mainNews.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar size={12} /> {mainNews.timeAgo || 'Mới nhất'}
              </span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight font-serif group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {mainNews.title}
            </h3>
            
            <p className="text-slate-600 dark:text-slate-300 text-lg mb-6 leading-relaxed max-w-3xl">
              {mainNews.summary}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                <img 
                   src={`https://www.google.com/s2/favicons?domain=${mainNews.source.toLowerCase().replace(/\s/g, '')}.vn&sz=32`}
                   className="w-4 h-4 rounded-sm opacity-70"
                   onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                   alt=""
                />
                {mainNews.source}
              </div>
              
              <div className="flex-1"></div>

              <button
                onClick={() => onChatAbout(mainNews)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:scale-105 active:scale-95 ${accentStyles[accentColor]}`}
              >
                <MessageSquare size={16} />
                Hỏi chi tiết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherNews.map((item, index) => (
          <div 
            key={index}
            className="flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 group"
          >
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                  {item.timeAgo}
                </span>
              </div>
              
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 line-clamp-3 font-serif group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </h4>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {item.summary}
              </p>
            </div>

            <div className="px-5 py-4 border-t border-slate-50 dark:border-slate-700/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 rounded-b-xl">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-500 flex items-center gap-1.5">
                 <img 
                   src={`https://www.google.com/s2/favicons?domain=${item.source.toLowerCase().replace(/\s/g, '')}.vn&sz=16`}
                   className="w-3 h-3 rounded-sm opacity-60"
                   onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                   alt=""
                />
                {item.source}
              </span>
              
              <button
                onClick={() => onChatAbout(item)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Hỏi thêm <ExternalLink size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
