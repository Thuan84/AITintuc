import React from 'react';
import { ChatSession, AccentColor } from '../types';
import { X, MessageSquare, Trash2, Clock } from 'lucide-react';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  accentColor: AccentColor;
}

const accentStyles: Record<AccentColor, string> = {
  blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
  violet: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800',
  amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  rose: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800',
};

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  accentColor
}) => {
  // Sort sessions by last modified desc
  const sortedSessions = [...sessions].sort((a, b) => b.lastModified - a.lastModified);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h2 className="font-serif font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Clock size={18} />
              Lịch sử trò chuyện
            </h2>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {sortedSessions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                <p className="text-sm">Chưa có cuộc trò chuyện nào được lưu.</p>
              </div>
            ) : (
              sortedSessions.map((session) => (
                <div 
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`
                    group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border
                    ${session.id === currentSessionId 
                      ? `${accentStyles[accentColor]} border` 
                      : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent hover:border-slate-100 dark:hover:border-slate-800 text-slate-600 dark:text-slate-300'}
                  `}
                >
                  <MessageSquare size={16} className={`mt-1 shrink-0 ${session.id === currentSessionId ? '' : 'opacity-50'}`} />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium truncate ${session.id === currentSessionId ? 'font-semibold' : ''}`}>
                      {session.title}
                    </h3>
                    <p className="text-[11px] opacity-60 mt-1 truncate">
                      {new Date(session.lastModified).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <button
                    onClick={(e) => onDeleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                    title="Xóa"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};