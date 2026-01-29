
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags?: string[];
}

export enum ModuleId {
  COMBUSTION = 'combustion',
  EQUIPMENT = 'equipment',
  SAFETY = 'safety',
  MEASUREMENT = 'measurement',
  SYSTEMS = 'systems'
}

export interface ModuleInfo {
  id: ModuleId;
  name: string;
  description: string;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
