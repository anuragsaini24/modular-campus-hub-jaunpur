import { FeatureModule } from '@/types';

export const CAMPUS_FEATURES: FeatureModule[] = [
  {
    id: 'assistant',
    name: 'AI College Assistant',
    badge: 'Feature 1',
    href: '/assistant',
    description: 'Ground-truth campus Q&A powered by Google Gemma 4 and hybrid local RAG.',
    status: 'active',
    iconName: 'Bot',
  },
  {
    id: 'knowledge',
    name: 'Team Knowledge Studio',
    badge: 'Admin',
    href: '/knowledge',
    description: 'Upload PDF notices, manage college markdown FAQs, and sync with Backboard.',
    status: 'active',
    iconName: 'Database',
  },
  {
    id: 'pitch',
    name: 'Pitch Video & Deck',
    badge: 'Judges Demo',
    href: '/pitch',
    description: 'Interactive presentation video player with transcript, slides, and voiceover.',
    status: 'active',
    iconName: 'PlayCircle',
  },
  {
    id: 'teams',
    name: 'Project Team Matcher',
    badge: 'Feature 2 Slot',
    href: '/teams',
    description: 'Skill-based hackathon team matching and project collaboration hub.',
    status: 'coming-soon',
    iconName: 'Users',
  },
  {
    id: 'lostfound',
    name: 'Digital Lost & Found',
    badge: 'Feature 3 Slot',
    href: '/lost-found',
    description: 'Campus lost item recovery board with claim verification and custody logs.',
    status: 'coming-soon',
    iconName: 'HelpCircle',
  },
];
