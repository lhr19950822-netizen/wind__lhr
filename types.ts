
export interface SpriteAsset {
  id: string;
  name: string;
  url: string;
  description: string;
  timestamp: number;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export enum TabType {
  BRAINSTORM = 'BRAINSTORM',
  SPRITE_GEN = 'SPRITE_GEN',
  DESTINY_WEAVER = 'DESTINY_WEAVER',
  SETTINGS = 'SETTINGS'
}

export interface TarotMbtiResult {
  mbti: string;
  tarot: string;
  concept: string;
}
