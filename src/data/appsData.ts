import { AppDefinition, ThemeConfig } from '../types';

export const APPS_CATALOG: AppDefinition[] = [
  {
    id: 'games',
    name: 'Games',
    subtitle: 'Unblocked Hub',
    iconType: 'games-folder',
    category: 'games',
    gradient: 'from-slate-700 via-slate-800 to-slate-900',
  },
  {
    id: 'ap',
    name: 'AP',
    subtitle: 'Device Manager',
    iconType: 'ap',
    category: 'utility',
    gradient: 'from-cyan-500 via-blue-600 to-indigo-700',
  },
];

export const THEMES_LIST: ThemeConfig[] = [
  {
    id: 'aurora-blue',
    name: 'Aurora Borealis (Default)',
    gradient: 'from-slate-950 via-[#0a192f] to-[#042f48]',
    accent: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    desc: 'Luminous cyan, teal, and royal blue aurora shimmering across deep night sky.',
  },
  {
    id: 'aurora-arctic',
    name: 'Arctic Cyan',
    gradient: 'from-[#030e1e] via-[#052b47] to-[#0d597f]',
    accent: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.45)',
    desc: 'Crisp polar ice blues with electric teal reflections.',
  },
  {
    id: 'aurora-violet',
    name: 'Midnight Cyberpunk',
    gradient: 'from-[#0b0318] via-[#1a0a38] to-[#2c0e4d]',
    accent: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.45)',
    desc: 'Deep galactic nebula with rich violet and magenta radiance.',
  },
  {
    id: 'aurora-solar',
    name: 'Solar Sunset (Screenshot Style)',
    gradient: 'from-[#2a0e2a] via-[#4d1635] to-[#7c2d2e]',
    accent: '#fb923c',
    glowColor: 'rgba(251, 146, 60, 0.45)',
    desc: 'Warm dusk twilight gradient matching the sunset glow in your screenshot.',
  },
  {
    id: 'aurora-emerald',
    name: 'Emerald Borealis',
    gradient: 'from-[#021512] via-[#043328] to-[#074f3d]',
    accent: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.45)',
    desc: 'Mystic green geomagnetic waves cascading over dark horizon.',
  },
];

export const CLOAK_PRESETS = [
  { id: 'default', title: 'AuroraOS | Unblocked Games & Apps', icon: 'default' },
  { id: 'docs', title: 'Untitled document - Google Docs', icon: 'docs' },
  { id: 'classroom', title: 'Home - Google Classroom', icon: 'classroom' },
  { id: 'canvas', title: 'Dashboard | Canvas Learning', icon: 'canvas' },
  { id: 'wikipedia', title: 'Solar System - Wikipedia', icon: 'wikipedia' },
  { id: 'desmos', title: 'Desmos | Graphing Calculator', icon: 'desmos' },
];
