
import { Type } from "@google/genai";

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  sources?: GroundingChunk[];
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastModified: number;
}

export enum NewsCategory {
  GENERAL = "Tin nóng",
  POLITICS = "Thời sự",
  BUSINESS = "Kinh doanh",
  TECHNOLOGY = "Công nghệ",
  SPORTS = "Thể thao",
  ENTERTAINMENT = "Giải trí"
}

export type ThemeMode = 'light' | 'dark';
export type AccentColor = 'blue' | 'emerald' | 'violet' | 'amber' | 'rose';

export type BubbleStyle = 'solid' | 'soft' | 'outlined';
export type BubbleTexture = 'none' | 'dots' | 'grid';

export type BotIconType = 'bot' | 'sparkles' | 'zap' | 'brain';

export type ViewMode = 'chat' | 'trending';

export interface TrendingNewsItem {
  title: string;
  summary: string;
  category: string;
  source: string;
  url?: string;
  timeAgo?: string;
}
