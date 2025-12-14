import { ReactNode } from 'react';

export interface Feature {
  id: string;
  name: string;
  icon: ReactNode;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export type UserRole = 'guest' | 'user' | 'owner';