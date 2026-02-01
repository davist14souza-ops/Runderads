export interface Game {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  rating: number;
  views: number;
  imageUrl: string;
  releaseDate: string;
}

export enum GameCategory {
  ALL = 'Para Você',
  ACTION = 'Ação',
  PUZZLE = 'Raciocínio',
  RACING = 'Corrida',
  STRATEGY = 'Estratégia',
  RPG = 'Aventura'
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  verified?: boolean; // For verified users/admin
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}