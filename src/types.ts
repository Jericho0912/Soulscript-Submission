export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  topic: string;
  mood: 'peaceful' | 'reflective' | 'anxious' | 'inspired' | 'grateful' | 'exhausted';
  messages: ChatMessage[];
  aiSummary: string;
  createdAt: number;
  updatedAt: number;
}

export type ActiveView = 'dashboard' | 'entry_detail' | 'new_entry';
