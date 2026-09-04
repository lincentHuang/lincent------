// ==========================================
// 🌐 I18N & LANGUAGE TYPES
// ==========================================
export type Language = 'zh' | 'en';

export interface MultilingualText {
  zh: string;
  en: string;
}

// ==========================================
// 📢 SITE CONFIGURATION (HERO & GLOBAL COPY)
// ==========================================
export interface SiteConfig {
  id: string;
  heroTitleZh: string;
  heroTitleEn: string;
  heroSubtitleZh: string;
  heroSubtitleEn: string;
  bioZh: string;
  bioEn: string;
  statusTagZh: string;
  statusTagEn: string;
  yearsOfExp: string;
  uiComponentsCount: string;
  lighthouseScore: string;
  locationZh: string;
  locationEn: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  updatedAt?: string;
}

// ==========================================
// 🧩 MODULAR BENTO CARDS
// ==========================================
export type ModularCardType = 'skill' | 'tool' | 'service' | 'metric';

export interface ModularCard {
  id: string;
  type: ModularCardType;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
  tagZh?: string;
  tagEn?: string;
  icon?: string; // lucide icon name (e.g. Code2, Layout, Cpu, Zap, Sparkles)
  color?: string; // cyan, violet, rose, emerald, amber
  metricsValue?: string; // e.g. "99/100", "5+ Yrs", "80+ UI"
  items?: string[]; // e.g. list of tools or tech stack
  order: number;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// 🗂️ PROJECT ITEM (WITH MULTILINGUAL SUPPORT)
// ==========================================
export interface ProjectItem {
  id: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  tag: string;
  tagEn?: string;
  category: string;
  categoryEn?: string;
  year: string;
  role: string;
  roleEn?: string;
  company: string;
  companyEn?: string;
  badge?: string;
  badgeEn?: string;
  themeColor: 'yellow' | 'purple' | 'coral' | 'mint' | 'blue';
  isNew: boolean;
  summary: string;
  summaryEn?: string;
  coverImage?: string;
  images?: string[];
  contentMd?: string;
  contentMdEn?: string;
  painPoints: string[];
  painPointsEn?: string[];
  techStack: string[];
  aiHighlights: {
    coreHighlights: string[];
    coreHighlightsEn?: string[];
    animationHighlights: string[];
    animationHighlightsEn?: string[];
    usageScenarios: string[];
    usageScenariosEn?: string[];
    clientPitch: string;
    clientPitchEn?: string;
  };
  metrics?: { label: string; labelEn?: string; value: string }[];
  demoUrl?: string;
  githubUrl?: string;
}

// ==========================================
// 📥 INQUIRY ITEM
// ==========================================
export interface InquiryItem {
  id: string;
  name: string;
  company?: string;
  email: string;
  scope: string;
  budget?: string;
  message: string;
  status: 'unread' | 'replied' | 'archived';
  createdAt: string;
}

// ==========================================
// 🤖 AI TRANSLATE PAYLOAD & RESPONSE
// ==========================================
export interface AITranslateRequest {
  text?: string;
  fields?: Record<string, string>;
  from: Language;
  to: Language;
  context?: string;
}

export interface AITranslateResponse {
  success: boolean;
  translatedText?: string;
  translatedFields?: Record<string, string>;
  error?: string;
}
