import { atom } from 'jotai';

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  category: string;
  year: string;
  role: string;
  company: string;
  badge?: string;
  themeColor: 'yellow' | 'purple' | 'coral' | 'mint' | 'blue';
  isNew?: boolean;
  summary: string;
  coverImage?: string;
  galleryImages?: string[];
  contentMd?: string;
  painPoints: string[];
  techStack: string[];
  aiHighlights: {
    coreHighlights: string[];
    animationHighlights: string[];
    usageScenarios: string[];
    clientPitch: string;
  };
  metrics: { label: string; value: string }[];
  demoUrl?: string;
  githubUrl?: string;
}

export interface InquiryItem {
  id: string;
  name: string;
  company: string;
  email: string;
  scope: string;
  budget?: string;
  message: string;
  status: 'unread' | 'replied' | 'archived';
  createdAt: string;
}

// Global Atoms
export const projectsAtom = atom<ProjectItem[]>([]);
export const selectedProjectAtom = atom<ProjectItem | null>(null);
export const inquiriesAtom = atom<InquiryItem[]>([]);
export const isGeneratingAIAtom = atom<boolean>(false);
