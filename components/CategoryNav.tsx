import React from 'react';
import { Sparkles, Hash } from 'lucide-react';
import { AccentColor, NewsCategory } from '../types';

interface QuickPromptsProps {
  onPromptClick: (text: string) => void;
  disabled: boolean;
  accentColor: AccentColor;
}

const SUGGESTIONS = [
  "Tin nóng 24h qua",
  "Giá vàng & Tỷ giá hôm nay",
  "Kết quả bóng đá mới nhất",
  "Tình hình thời tiết",
  "Tin tức công nghệ AI",
  "Thị trường chứng khoán"
];

const colorStyles: Record<AccentColor, string> = {
  blue: 'hover:text-blue-700 hover:border-blue-200 dark:hover:border-blue-800 dark:hover:text-blue-300',
  emerald: 'hover:text-emerald-700 hover:border-emerald-200 dark:hover:border-emerald-800 dark:hover:text-emerald-300',
  violet: 'hover:text-violet-700 hover:border-violet-200 dark:hover:border-violet-800 dark:hover:text-violet-300',
  amber: 'hover:text-amber-700 hover:border-amber-200 dark:hover:border-amber-800 dark:hover:text-amber-300',
  rose: 'hover:text-rose-700 hover:border-rose-200 dark:hover:border-rose-800 dark:hover:text-rose-300',
};

export const QuickPrompts: React.FC<QuickPromptsProps> = ({ onPromptClick, disabled, accentColor }) => {
  return (
    <div className="py-2 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 min-w-max px-1">
        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 mr-2">
          <Sparkles size={16} />
          <span className="text-xs font-medium uppercase tracking-wider">Gợi ý:</span>
        </div>
        {SUGGESTIONS.map((text) => (
          <button
            key={text}
            onClick={() => !disabled && onPromptClick(text)}
            disabled={disabled}
            className={`
              px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm transition-colors border border-transparent 
              whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed
              hover:bg-white dark:hover:bg-slate-700
              ${colorStyles[accentColor]}
            `}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};

interface CategoryListProps {
  onCategorySelect: (category: string) => void;
  disabled: boolean;
  accentColor: AccentColor;
}

export const CategoryList: React.FC<CategoryListProps> = ({ onCategorySelect, disabled, accentColor }) => {
  const categories = Object.values(NewsCategory);

  // Map accent colors to specific active/hover styles for categories
  const activeStyles: Record<AccentColor, string> = {
    blue: 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 dark:hover:bg-blue-900/20 dark:hover:text-blue-300 dark:hover:border-blue-800',
    emerald: 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-300 dark:hover:border-emerald-800',
    violet: 'hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 dark:hover:bg-violet-900/20 dark:hover:text-violet-300 dark:hover:border-violet-800',
    amber: 'hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 dark:hover:bg-amber-900/20 dark:hover:text-amber-300 dark:hover:border-amber-800',
    rose: 'hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 dark:hover:bg-rose-900/20 dark:hover:text-rose-300 dark:hover:border-rose-800',
  };

  return (
    <div className="py-2 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 min-w-max px-1">
        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 mr-2">
          <Hash size={16} />
          <span className="text-xs font-medium uppercase tracking-wider">Chuyên mục:</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => !disabled && onCategorySelect(cat)}
            disabled={disabled}
            className={`
              px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 
              text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium transition-all shadow-sm
              whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed
              ${activeStyles[accentColor]}
            `}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
