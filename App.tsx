
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { QuickPrompts, CategoryList } from './components/CategoryNav';
import { MarkdownViewer } from './components/MarkdownViewer';
import { MessageSources } from './components/SourcesSidebar';
import { ChatActions } from './components/ChatActions';
import { SettingsModal } from './components/SettingsModal';
import { HistorySidebar } from './components/HistorySidebar';
import { TrendingView } from './components/TrendingView';
import { createChatSession } from './services/geminiService';
import { ChatMessage, GroundingChunk, ThemeMode, AccentColor, ChatSession, BubbleStyle, BubbleTexture, BotIconType, ViewMode, TrendingNewsItem } from './types';
import { Bot, User, Loader2, AlertCircle, ArrowUp, Sparkles, Zap, Brain } from 'lucide-react';
import { Chat, GenerateContentResponse, Content } from "@google/genai";

// Expanded Color mapping for dynamic styling
const themeColors: Record<AccentColor, { 
  solidBg: string; 
  softBg: string; 
  text: string; 
  border: string;
  botIcon: string; 
  ring: string; 
  button: string;
  darkSoftBg: string;
  darkText: string;
}> = {
  blue: {
    solidBg: 'bg-blue-600',
    softBg: 'bg-blue-50',
    darkSoftBg: 'dark:bg-blue-900/30',
    text: 'text-blue-700',
    darkText: 'dark:text-blue-300',
    border: 'border-blue-600',
    botIcon: 'from-blue-600 to-blue-700',
    ring: 'focus-within:ring-blue-500/20 focus-within:border-blue-500',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  emerald: {
    solidBg: 'bg-emerald-600',
    softBg: 'bg-emerald-50',
    darkSoftBg: 'dark:bg-emerald-900/30',
    text: 'text-emerald-700',
    darkText: 'dark:text-emerald-300',
    border: 'border-emerald-600',
    botIcon: 'from-emerald-600 to-emerald-700',
    ring: 'focus-within:ring-emerald-500/20 focus-within:border-emerald-500',
    button: 'bg-emerald-600 hover:bg-emerald-700'
  },
  violet: {
    solidBg: 'bg-violet-600',
    softBg: 'bg-violet-50',
    darkSoftBg: 'dark:bg-violet-900/30',
    text: 'text-violet-700',
    darkText: 'dark:text-violet-300',
    border: 'border-violet-600',
    botIcon: 'from-violet-600 to-violet-700',
    ring: 'focus-within:ring-violet-500/20 focus-within:border-violet-500',
    button: 'bg-violet-600 hover:bg-violet-700'
  },
  amber: {
    solidBg: 'bg-amber-500',
    softBg: 'bg-amber-50',
    darkSoftBg: 'dark:bg-amber-900/30',
    text: 'text-amber-700',
    darkText: 'dark:text-amber-300',
    border: 'border-amber-500',
    botIcon: 'from-amber-500 to-amber-600',
    ring: 'focus-within:ring-amber-500/20 focus-within:border-amber-500',
    button: 'bg-amber-500 hover:bg-amber-600'
  },
  rose: {
    solidBg: 'bg-rose-600',
    softBg: 'bg-rose-50',
    darkSoftBg: 'dark:bg-rose-900/30',
    text: 'text-rose-700',
    darkText: 'dark:text-rose-300',
    border: 'border-rose-600',
    botIcon: 'from-rose-600 to-rose-700',
    ring: 'focus-within:ring-rose-500/20 focus-within:border-rose-500',
    button: 'bg-rose-600 hover:bg-rose-700'
  }
};

const App: React.FC = () => {
  // Global States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Session Management
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // UI Modes
  const [viewMode, setViewMode] = useState<ViewMode>('chat');

  // Settings State
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [accentColor, setAccentColor] = useState<AccentColor>('blue');
  const [bubbleStyle, setBubbleStyle] = useState<BubbleStyle>('solid');
  const [bubbleTexture, setBubbleTexture] = useState<BubbleTexture>('none');
  const [botIcon, setBotIcon] = useState<BotIconType>('bot');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Refs
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Initialization & Storage Effects ---

  // Load settings from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    const savedColor = localStorage.getItem('accentColor') as AccentColor;
    const savedBubbleStyle = localStorage.getItem('bubbleStyle') as BubbleStyle;
    const savedBubbleTexture = localStorage.getItem('bubbleTexture') as BubbleTexture;
    const savedBotIcon = localStorage.getItem('botIcon') as BotIconType;
    
    if (savedTheme) setTheme(savedTheme);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
    
    if (savedColor && themeColors[savedColor]) setAccentColor(savedColor);
    if (savedBubbleStyle) setBubbleStyle(savedBubbleStyle);
    if (savedBubbleTexture) setBubbleTexture(savedBubbleTexture);
    if (savedBotIcon) setBotIcon(savedBotIcon);

    // Load sessions
    const savedSessions = localStorage.getItem('chat_sessions');
    if (savedSessions) {
      try {
        const parsedSessions: ChatSession[] = JSON.parse(savedSessions);
        // Convert string timestamps back to Date objects for messages
        const hydratedSessions = parsedSessions.map(s => ({
          ...s,
          messages: s.messages.map(m => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
        setSessions(hydratedSessions);
        
        // If we have sessions, load the most recent one, otherwise create new
        if (hydratedSessions.length > 0) {
          const mostRecent = hydratedSessions.sort((a, b) => b.lastModified - a.lastModified)[0];
          loadSession(mostRecent.id, hydratedSessions);
        } else {
          startNewChat();
        }
      } catch (e) {
        console.error("Failed to parse sessions", e);
        startNewChat();
      }
    } else {
      startNewChat();
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save settings
  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem('bubbleStyle', bubbleStyle);
  }, [bubbleStyle]);

  useEffect(() => {
    localStorage.setItem('bubbleTexture', bubbleTexture);
  }, [bubbleTexture]);

  useEffect(() => {
    localStorage.setItem('botIcon', botIcon);
  }, [botIcon]);

  // Save sessions to local storage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chat_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (viewMode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, viewMode]);

  // --- Session Logic ---

  const startNewChat = () => {
    const newId = Date.now().toString();
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      role: 'model',
      content: 'Xin chào! Tôi là trợ lý tin tức ảo. Bạn muốn biết thông tin gì hôm nay? (Ví dụ: Giá vàng, Thời sự, Bóng đá...)',
      timestamp: new Date()
    };

    const newSession: ChatSession = {
      id: newId,
      title: 'Cuộc trò chuyện mới',
      messages: [welcomeMsg],
      lastModified: Date.now()
    };

    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newId);
    setMessages([welcomeMsg]);
    
    // Initialize a fresh API session without history
    chatSessionRef.current = createChatSession();
    
    setIsLoading(false);
    setError(null);
    setIsHistoryOpen(false); // Close sidebar on mobile if open
    setViewMode('chat'); // Ensure we are in chat mode
  };

  const loadSession = (sessionId: string, sessionList = sessions) => {
    const session = sessionList.find(s => s.id === sessionId);
    if (!session) return;

    setCurrentSessionId(sessionId);
    setMessages(session.messages);
    setIsHistoryOpen(false);
    setViewMode('chat');

    // Reconstruct Gemini Chat History
    const history: Content[] = session.messages
      .filter(m => m.id !== 'welcome')
      .map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

    chatSessionRef.current = createChatSession(history);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSessions = sessions.filter(s => s.id !== id);
    setSessions(updatedSessions);
    localStorage.setItem('chat_sessions', JSON.stringify(updatedSessions));

    if (id === currentSessionId) {
      if (updatedSessions.length > 0) {
        loadSession(updatedSessions[0].id, updatedSessions);
      } else {
        startNewChat();
      }
    }
  };

  const updateCurrentSession = (newMessages: ChatMessage[]) => {
    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        let title = session.title;
        if (session.title === 'Cuộc trò chuyện mới' && newMessages.length > 1) {
          const firstUserMsg = newMessages.find(m => m.role === 'user');
          if (firstUserMsg) {
            title = firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? '...' : '');
          }
        }
        return {
          ...session,
          messages: newMessages,
          title,
          lastModified: Date.now()
        };
      }
      return session;
    }));
  };

  // --- Chat Logic ---

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim() || !chatSessionRef.current || isLoading) return;

    // If sending from Trending view, switch back to chat
    if (viewMode !== 'chat') setViewMode('chat');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    const updatedMessagesWithUser = [...messages, userMsg];
    setMessages(updatedMessagesWithUser);
    updateCurrentSession(updatedMessagesWithUser);
    
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const result: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: text });
      
      const botText = result.text || "Xin lỗi, tôi không thể lấy thông tin lúc này.";
      const groundingChunks = (result.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as GroundingChunk[];

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: botText,
        sources: groundingChunks,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessagesWithUser, botMsg];
      setMessages(finalMessages);
      updateCurrentSession(finalMessages);

    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi kết nối với Gemini. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    handleSendMessage(`Tổng hợp các tin tức nổi bật về chủ đề: ${category} trong ngày hôm nay.`);
  };

  const handleChatAbout = (item: TrendingNewsItem) => {
    handleSendMessage(`Tôi muốn biết thêm chi tiết về tin tức này: "${item.title}" (${item.source}). Hãy tổng hợp các diễn biến liên quan.`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper to generate classes based on style settings
  const getBubbleClasses = (role: 'user' | 'model') => {
    const currentStyle = themeColors[accentColor];
    let classes = "rounded-2xl shadow-sm overflow-hidden transition-colors duration-200 ";
    
    // Base shape
    classes += role === 'user' ? "rounded-tr-sm " : "rounded-tl-sm ";
    
    // Pattern class
    let patternClass = "";
    if (bubbleTexture === 'dots') {
      patternClass = " bg-[radial-gradient(#00000015_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:12px_12px]";
    } else if (bubbleTexture === 'grid') {
      patternClass = " bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]";
    }

    if (role === 'user') {
      switch (bubbleStyle) {
        case 'outlined':
          return classes + `border-2 ${currentStyle.border} ${currentStyle.text} ${currentStyle.darkText} bg-transparent` + patternClass;
        case 'soft':
          return classes + `${currentStyle.softBg} ${currentStyle.darkSoftBg} ${currentStyle.text} ${currentStyle.darkText}` + patternClass;
        case 'solid':
        default:
          // Solid usually doesn't look good with patterns on top of dark color, but we can add a subtle one
          // For solid, we might want to make the pattern white/transparent
          let solidPattern = "";
          if (bubbleTexture === 'dots') solidPattern = " bg-[radial-gradient(#ffffff30_1px,transparent_1px)] [background-size:12px_12px]";
          if (bubbleTexture === 'grid') solidPattern = " bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] [background-size:16px_16px]";
          return classes + `${currentStyle.solidBg} text-white` + solidPattern;
      }
    } else {
      // Bot styling - generally keeps neutral background but applies patterns
      return classes + "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200" + patternClass;
    }
  };

  const currentStyles = themeColors[accentColor];

  const getBotIcon = () => {
    switch (botIcon) {
      case 'sparkles': return Sparkles;
      case 'zap': return Zap;
      case 'brain': return Brain;
      case 'bot':
      default: return Bot;
    }
  };

  const BotIconCmp = getBotIcon();

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 overflow-hidden">
      <Header 
        onNewChat={startNewChat} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleHistory={() => setIsHistoryOpen(true)}
        onToggleView={setViewMode}
        currentView={viewMode}
        accentColor={accentColor}
      />

      <HistorySidebar 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={(id) => loadSession(id)}
        onDeleteSession={handleDeleteSession}
        accentColor={accentColor}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
        bubbleStyle={bubbleStyle}
        setBubbleStyle={setBubbleStyle}
        bubbleTexture={bubbleTexture}
        setBubbleTexture={setBubbleTexture}
        botIcon={botIcon}
        setBotIcon={setBotIcon}
      />
      
      {/* Main Area - Switches between Chat and Trending */}
      <main className="flex-1 overflow-y-auto scroll-smooth">
        {viewMode === 'trending' ? (
          <TrendingView onChatAbout={handleChatAbout} accentColor={accentColor} />
        ) : (
          <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${currentStyles.botIcon} flex items-center justify-center shrink-0 text-white mt-1 shadow-md`}>
                    <BotIconCmp size={18} />
                  </div>
                )}
                
                <div className={`max-w-[90%] sm:max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={getBubbleClasses(msg.role)}>
                    <div className="px-5 py-3.5">
                      {msg.role === 'model' ? (
                        <>
                          <MarkdownViewer content={msg.content} />
                          <ChatActions text={msg.content} />
                        </>
                      ) : (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      )}
                    </div>

                    {/* Sources integrated into the bubble footer */}
                    {msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                       <MessageSources sources={msg.sources} />
                    )}
                  </div>
                  
                  {/* Timestamp */}
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1 select-none">
                    {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400 mt-1">
                    <User size={18} />
                  </div>
                )}
              </div>
            ))}

            {/* Loading State */}
            {isLoading && (
              <div className="flex gap-4">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${currentStyles.botIcon} flex items-center justify-center shrink-0 text-white mt-1 shadow-md`}>
                  <BotIconCmp size={18} />
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">Đang tổng hợp tin tức...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
               <div className="flex justify-center my-4">
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-red-100 dark:border-red-800 shadow-sm">
                    <AlertCircle size={16} />
                    {error}
                  </div>
               </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area - Only show in Chat mode */}
      {viewMode === 'chat' && (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 transition-colors duration-200">
          <div className="max-w-4xl mx-auto">
            <div className="mb-2">
              <CategoryList 
                onCategorySelect={handleCategorySelect}
                disabled={isLoading}
                accentColor={accentColor}
              />
              <QuickPrompts 
                onPromptClick={(text) => handleSendMessage(text)} 
                disabled={isLoading} 
                accentColor={accentColor}
              />
            </div>
            
            <div className={`relative flex items-end gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2 focus-within:ring-2 transition-all shadow-sm ${currentStyles.ring}`}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi về tin tức hôm nay..."
                className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-2.5 px-2 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                rows={1}
                style={{ height: 'auto', minHeight: '44px' }}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className={`
                  p-2.5 rounded-lg flex items-center justify-center transition-all mb-0.5
                  ${!inputValue.trim() || isLoading
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    : `${currentStyles.button} text-white shadow-sm`}
                `}
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowUp size={20} />}
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2">
              VN News Bot có thể mắc lỗi. Hãy luôn kiểm tra lại các đường dẫn đính kèm.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
