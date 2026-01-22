
import { ReactNode } from 'react';

export type FeatureCategory = 'core' | 'free' | 'enterprise' | 'system' | 'hidden';

export interface Feature {
  id: string;
  name: string;
  icon: ReactNode;
  description: string;
  category: FeatureCategory;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export type UserRole = 'owner';
