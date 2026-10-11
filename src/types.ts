export type ThemeId = 'aurora-blue' | 'aurora-arctic' | 'aurora-violet' | 'aurora-solar' | 'aurora-emerald';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  gradient: string;
  accent: string;
  glowColor: string;
  desc: string;
}

export type CloakPreset = 'default' | 'docs' | 'classroom' | 'canvas' | 'wikipedia' | 'desmos';

export interface AppDefinition {
  id: string;
  name: string;
  subtitle?: string;
  iconType: string;
  category: 'games' | 'media' | 'utility' | 'social' | 'creative';
  gradient: string; // Tailwind background gradient classes matching screenshot
  iconColor?: string;
  pinned?: boolean;
}

export interface WindowState {
  appId: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}
