
import React from 'react';
import { X, Moon, Sun, Check, LayoutTemplate, Grid3X3, Bot, Sparkles, Zap, Brain } from 'lucide-react';
import { ThemeMode, AccentColor, BubbleStyle, BubbleTexture, BotIconType } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  bubbleStyle: BubbleStyle;
  setBubbleStyle: (style: BubbleStyle) => void;
  bubbleTexture: BubbleTexture;
  setBubbleTexture: (texture: BubbleTexture) => void;
  botIcon: BotIconType;
  setBotIcon: (icon: BotIconType) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  setTheme,
  accentColor,
  setAccentColor,
  bubbleStyle,
  setBubbleStyle,
  bubbleTexture,
  setBubbleTexture,
  botIcon,
  setBotIcon
}) => {
  if (!isOpen) return null;

  const colors: { id: AccentColor; label: string; bg: string }[] = [
    { id: 'blue', label: 'Xanh dương', bg: 'bg-blue-600' },
    { id: 'emerald', label: 'Xanh lá', bg: 'bg-emerald-600' },
    { id: 'violet', label: 'Tím', bg: 'bg-violet-600' },
    { id: 'amber', label: 'Vàng cam', bg: 'bg-amber-500' },
    { id: 'rose', label: 'Hồng', bg: 'bg-rose-600' },
  ];

  const styles: { id: BubbleStyle; label: string }[] = [
    { id: 'solid', label: 'Đậm' },
    { id: 'soft', label: 'Nhạt' },
    { id: 'outlined', label: 'Viền' },
  ];

  const textures: { id: BubbleTexture; label: string }[] = [
    { id: 'none', label: 'Trơn' },
    { id: 'dots', label: 'Chấm' },
    { id: 'grid', label: 'Lưới' },
  ];

  const icons: { id: BotIconType; label: string; Icon: React.ElementType }[] = [
    { id: 'bot', label: 'Robot', Icon: Bot },
    { id: 'sparkles', label: 'Sao', Icon: Sparkles },
    { id: 'zap', label: 'Tia chớp', Icon: Zap },
    { id: 'brain', label: 'Trí tuệ', Icon: Brain },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif">Cài đặt giao diện</h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Toggle */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Moon size={14} />
              Chế độ hiển thị
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`
                  flex items-center justify-center gap-2 p-3 rounded-xl border transition-all
                  ${theme === 'light' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-slate-700 dark:border-blue-400 dark:text-blue-300' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-200 dark:hover:border-slate-600'}
                `}
              >
                <Sun size={18} />
                <span className="font-medium">Sáng</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`
                  flex items-center justify-center gap-2 p-3 rounded-xl border transition-all
                  ${theme === 'dark' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-slate-700 dark:border-blue-400 dark:text-blue-300' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-200 dark:hover:border-slate-600'}
                `}
              >
                <Moon size={18} />
                <span className="font-medium">Tối</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-700"></div>

          {/* Accent Color */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <LayoutTemplate size={14} />
              Màu chủ đạo
            </label>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setAccentColor(color.id)}
                  className={`
                    group relative w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none ring-offset-2 dark:ring-offset-slate-800
                    ${color.bg}
                    ${accentColor === color.id ? 'ring-2 ring-slate-400 dark:ring-white scale-110' : ''}
                  `}
                  title={color.label}
                >
                  {accentColor === color.id && <Check size={16} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-700"></div>

          {/* Bot Icon */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Bot size={14} />
              Biểu tượng Bot
            </label>
            <div className="grid grid-cols-4 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => setBotIcon(icon.id)}
                  className={`
                    flex flex-col items-center gap-2 py-3 px-2 rounded-xl border transition-all
                    ${botIcon === icon.id
                      ? 'bg-slate-100 dark:bg-slate-700 border-slate-400 dark:border-slate-500 text-slate-900 dark:text-white'
                      : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  <icon.Icon size={24} />
                  <span className="text-xs font-medium">{icon.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-700"></div>

          {/* Bubble Style */}
          <div className="space-y-3">
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <LayoutTemplate size={14} />
              Kiểu bong bóng chat
            </label>
            <div className="grid grid-cols-3 gap-2">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setBubbleStyle(style.id)}
                  className={`
                    py-2 px-3 rounded-lg text-sm font-medium border transition-all
                    ${bubbleStyle === style.id
                      ? 'bg-slate-100 dark:bg-slate-700 border-slate-400 dark:border-slate-500 text-slate-900 dark:text-white'
                      : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bubble Texture */}
          <div className="space-y-3">
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Grid3X3 size={14} />
              Họa tiết nền
            </label>
            <div className="grid grid-cols-3 gap-2">
              {textures.map((texture) => (
                <button
                  key={texture.id}
                  onClick={() => setBubbleTexture(texture.id)}
                  className={`
                    py-2 px-3 rounded-lg text-sm font-medium border transition-all
                    ${bubbleTexture === texture.id
                      ? 'bg-slate-100 dark:bg-slate-700 border-slate-400 dark:border-slate-500 text-slate-900 dark:text-white'
                      : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  {texture.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
