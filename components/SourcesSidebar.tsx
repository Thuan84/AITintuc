import React from 'react';
import { GroundingChunk } from '../types';
import { ExternalLink, ShieldCheck, Globe, AlertTriangle } from 'lucide-react';

interface MessageSourcesProps {
  sources: GroundingChunk[];
}

const SOCIAL_DOMAINS = [
  'facebook.com',
  'twitter.com',
  'x.com',
  'instagram.com',
  'tiktok.com',
  'reddit.com',
  'threads.net',
  'linkedin.com',
  'pinterest.com'
];

export const MessageSources: React.FC<MessageSourcesProps> = ({ sources }) => {
  // Deduplicate sources based on URI
  const uniqueSources = sources
    .filter(s => s.web?.uri && s.web?.title)
    .reduce((acc, current) => {
      const x = acc.find(item => item.web?.uri === current.web?.uri);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [] as GroundingChunk[]);

  if (uniqueSources.length === 0) return null;

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return null;
    }
  };

  const isSocialMedia = (domain: string | null) => {
    if (!domain) return false;
    return SOCIAL_DOMAINS.some(social => domain.toLowerCase().includes(social));
  };

  return (
    <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/50 px-5 py-3">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider select-none">
        <ShieldCheck size={14} />
        Nguồn tham khảo
      </div>
      <div className="flex flex-wrap gap-2">
        {uniqueSources.map((source, index) => {
          const uri = source.web?.uri || "";
          const domain = getDomain(uri);
          // Use title if available, otherwise fallback to domain, then generic text
          const displayTitle = source.web?.title || domain || "Nguồn tin";
          
          // Request larger size (64px) for better quality on high DPI screens
          const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : '';
          
          const isCautionary = isSocialMedia(domain);
          const tooltip = isCautionary 
            ? "Cảnh báo: Nguồn từ mạng xã hội - Cần kiểm chứng thêm" 
            : source.web?.title || "Truy cập liên kết";

          return (
            <a 
              key={index}
              href={uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`
                flex items-center gap-2 px-2.5 py-1.5 border rounded-lg text-xs transition-all max-w-full group select-none
                ${isCautionary 
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:border-amber-400 dark:hover:border-amber-500' 
                  : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-400 dark:hover:border-blue-400 hover:shadow-sm'
                }
              `}
              title={tooltip}
            >
              {isCautionary && (
                <AlertTriangle size={13} className="text-amber-500 shrink-0" />
              )}

              {domain ? (
                <img 
                    src={faviconUrl} 
                    alt="" 
                    className="w-4 h-4 rounded-sm object-contain opacity-90 group-hover:opacity-100 dark:opacity-80 dark:group-hover:opacity-100"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              ) : (
                !isCautionary && <Globe size={14} className="text-slate-400" />
              )}
              
              <span className="truncate max-w-[180px] font-medium">{displayTitle}</span>
              <ExternalLink size={10} className="shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>
          );
        })}
      </div>
    </div>
  );
};