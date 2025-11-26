
import React from 'react';
import { MessageSquareText, Plus, Settings, History, Flame } from 'lucide-react';
import { AccentColor, ViewMode } from '../types';

interface HeaderProps {
  onNewChat: () => void;
  onOpenSettings: () => void;
  onToggleHistory: () => void;
  onToggleView: (mode: ViewMode) => void;
  currentView: ViewMode;
  accentColor: AccentColor;
}

const accentGradients: Record<AccentColor, string> = {
  blue: 'from-blue-600 to-blue-700',
  emerald: 'from-emerald-600 to-emerald-700',
  violet: 'from-violet-600 to-violet-700',
  amber: 'from-amber-500 to-amber-600',
  rose: 'from-rose-600 to-rose-700',
};

export const Header: React.FC<HeaderProps> = ({ 
  onNewChat, 
  onOpenSettings, 
  onToggleHistory, 
  onToggleView,
  currentView,
  accentColor 
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onToggleView('chat')}
          >
            <div className={`bg-gradient-to-br ${accentGradients[accentColor]} p-2 rounded-lg text-white shadow-md transition-colors duration-300 group-hover:scale-105`}>
               <MessageSquareText size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none font-serif">VN News Bot</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans font-medium">Trợ lý tin tức 24/7</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {/* View Toggles */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 mr-2">
               <button
                 onClick={() => onToggleView('chat')}
                 className={`p-1.5 rounded-full transition-all ${currentView === 'chat' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                 title="Chat"
               >
                 <MessageSquareText size={18} />
               </button>
               <button
                 onClick={() => onToggleView('trending')}
                 className={`p-1.5 rounded-full transition-all ${currentView === 'trending' ? 'bg-white dark:bg-slate-700 shadow-sm text-rose-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                 title="Tin nóng"
               >
                 <Flame size={18} />
               </button>
            </div>

            <button 
              onClick={onToggleHistory}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all sm:hidden"
              title="Lịch sử chat"
            >
              <History size={20} />
            </button>
            <button 
              onClick={onToggleHistory}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-sm font-medium transition-all"
              title="Lịch sử chat"
            >
              <History size={18} />
              <span>Lịch sử</span>
            </button>
            
            <button 
              onClick={onOpenSettings}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
              title="Cài đặt"
            >
              <Settings size={20} />
            </button>
            
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

            <button 
              onClick={onNewChat}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-sm font-medium transition-all active:scale-95"
              title="Bắt đầu cuộc trò chuyện mới"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Đoạn chat mới</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
