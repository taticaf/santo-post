
export interface GeneratedPost {
  id: string;
  imageUrl: string;
  bibleText: string;
  phrase: string;
  timestamp: number;
}

export type GenerationStatus = 'idle' | 'checking-key' | 'generating' | 'error' | 'success';
