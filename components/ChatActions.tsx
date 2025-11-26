import React, { useState, useEffect } from 'react';
import { Volume2, Copy, Check, StopCircle, Share2 } from 'lucide-react';

interface ChatActionsProps {
  text: string;
}

export const ChatActions: React.FC<ChatActionsProps> = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Cleanup speech when unmounting or text changes
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text]);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean text for better reading (remove basic markdown symbols)
    const cleanText = text.replace(/[*#_`]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN'; // Vietnamese
    
    // Try to find a Vietnamese voice if available
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.includes('vi'));
    if (viVoice) utterance.voice = viVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tin tức từ VN News Bot',
          text: text,
        });
      } catch (err) {
        // User cancelled or share failed, usually safe to ignore or log
        console.debug('Share cancelled or failed:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopy();
      alert('Trình duyệt của bạn không hỗ trợ menu chia sẻ. Nội dung đã được sao chép vào bộ nhớ tạm!');
    }
  };

  return (
    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 select-none flex-wrap">
      <button
        onClick={handleSpeak}
        className={`
          flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-colors
          ${isSpeaking 
            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-200 dark:ring-blue-800' 
            : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
        `}
        title={isSpeaking ? "Dừng đọc" : "Đọc tin"}
      >
        {isSpeaking ? <StopCircle size={14} /> : <Volume2 size={14} />}
        {isSpeaking ? "Dừng đọc" : "Nghe tin"}
      </button>
      
      <div className="h-3 w-px bg-slate-200 dark:bg-slate-700"></div>

      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
        title="Sao chép nội dung"
      >
        {isCopied ? <Check size={14} className="text-green-600 dark:text-green-400" /> : <Copy size={14} />}
        {isCopied ? <span className="text-green-600 dark:text-green-400">Đã chép</span> : "Sao chép"}
      </button>

      <div className="h-3 w-px bg-slate-200 dark:bg-slate-700"></div>

      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-colors text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
        title="Chia sẻ tin tức"
      >
        <Share2 size={14} />
        Chia sẻ
      </button>
    </div>
  );
};