
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  explanation?: string;
  tags?: string[];
}

export enum ModuleId {
  COMBUSTION = 'combustion',
  EQUIPMENT = 'equipment',
  SAFETY = 'safety',
  MEASUREMENT = 'measurement',
  SYSTEMS = 'systems',
  GENERAL = 'general',
  LPG = 'lpg',
  CITY_GAS = 'city_gas'
}

export interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  h4Count: number;
  mdPath: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface MdRegistryItem {
  path: string;
  h4Count: number;
  id: string;
}
