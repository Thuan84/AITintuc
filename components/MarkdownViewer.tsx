import React from 'react';

interface MarkdownViewerProps {
  content: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  const lines = content.split('\n');
  
  return (
    <article className="prose prose-sm prose-slate dark:prose-invert max-w-none break-words">
      {lines.map((line, index) => {
        const key = `line-${index}`;

        // Header 1 (Usually not used much in chat, map to h2 style)
        if (line.startsWith('# ')) {
           return <h2 key={key} className="text-lg font-bold text-slate-900 dark:text-white mb-2 mt-2 font-serif">{line.replace('# ', '')}</h2>;
        }
        
        // Header 2
        if (line.startsWith('## ')) {
           return <h3 key={key} className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 mt-3 font-serif">{line.replace('## ', '')}</h3>;
        }

        // Header 3
        if (line.startsWith('### ')) {
           return <h4 key={key} className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1 mt-2 font-serif">{line.replace('### ', '')}</h4>;
        }

        // List items
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const text = line.replace(/^(\s*)[-*]\s/, '');
          return (
            <div key={key} className="flex gap-2 mb-1 ml-2">
              <span className="text-slate-400 dark:text-slate-500 mt-1.5 text-[10px]">•</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed m-0">{parseBold(text)}</p>
            </div>
          );
        }
        
        // Blockquote
        if (line.startsWith('> ')) {
          return (
            <blockquote key={key} className="border-l-2 border-slate-300 dark:border-slate-600 pl-3 my-2 italic text-slate-500 dark:text-slate-400">
              {line.replace('> ', '')}
            </blockquote>
          )
        }

        // Empty lines
        if (!line.trim()) {
            return <div key={key} className="h-2"></div>;
        }

        // Regular paragraph
        return (
          <p key={key} className="text-slate-700 dark:text-slate-300 mb-2 leading-relaxed last:mb-0">
            {parseBold(line)}
          </p>
        );
      })}
    </article>
  );
};

// Helper to handle **bold** text
const parseBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};