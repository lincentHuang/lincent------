import { atom } from 'jotai';
import { ProjectItem, InquiryItem, SiteConfig, ModularCard, Language } from '../types';
import { defaultSiteConfig, defaultModularCards } from '../data/defaults';

export * from '../types';

// ==========================================
// 🌐 I18N LANGUAGE ATOM
// ==========================================
export const langAtom = atom<Language>('zh');

// UI Static Translation Dictionary for Portfolio Flow
export const uiDict = {
  zh: {
    nav: {
      works: '精選作品',
      bento: '核心模組',
      deepDive: '技術剖析',
      experience: '經歷技能',
      contact: '聯絡洽談',
      contactBtn: '聯繫合作',
      status: '可隨時到職',
    },
    hero: {
      badge: 'OPEN FOR NEW OPPORTUNITIES • 可隨時到職',
      viewWorks: '探索精選作品',
      viewExp: '查看經歷與技能',
      expLabel: '工作經歷',
      stackLabel: '核心技術棧',
      dsLabel: '設計系統',
      perfLabel: '效能跑分',
    },
    bento: {
      tag: '01 / CORE MODULES',
      title: '核心能力與積木模組',
      subtitle: '從前端架構、企業級設計系統到現代化開發工具鏈。',
    },
    projects: {
      tag: '02 / SELECTED WORKS',
      title: '精選代表作品',
      subtitle: '點擊任一專案進入獨立分頁，深入瞭解架構演進、效能指標與工程實踐。',
      viewDetail: '查看專案獨立分頁',
    },
    deepDive: {
      tag: '03 / TECHNICAL DEEP DIVE',
      title: '架構剖析與突破',
      subtitle: '深入了解每個代表專案在架構選型、狀態治理與互動細節上的技術決策。',
      viewPage: '查看專案分頁',
      aiBtn: '✨ AI 重新分析',
      tabs: {
        arch: '核心架構與突破',
        challenges: '痛點解決方案',
        motion: '動態微互動調校',
        impact: '專案成效與價值',
      },
    },
    experience: {
      tag: '04 / CAREER & EXPERTISE',
      title: '經歷與專業技能',
      subtitle: '擁有 5+ 年大中型產品研發實戰，具備從需求分析、架構選型到效能調優的完整落地經驗。',
      workHistory: '工作經歷',
      coreStack: '核心技術棧',
    },
    contact: {
      tag: '05 / GET IN TOUCH',
      title: '開啟對話',
      subtitle: '無論是全職資深前端職缺、技術架構諮詢或專案合作，歡迎隨時填寫表單或直接聯繫。',
      name: '您的姓名 *',
      company: '公司或團隊名稱',
      email: '電子郵件 (Email) *',
      scope: '合作性質',
      message: '訊息內容 (Message)',
      send: '送出邀請訊息',
      sending: '正在發送...',
      successTitle: '訊息已成功送達！',
      successDesc: '感謝您的邀請，我已收到您的訊息，會盡快與您聯繫！',
      sendAnother: '發送另一則訊息',
    },
    footer: {
      location: 'Senior Frontend Engineer • Taipei, Taiwan',
      builtWith: 'Lincent Huang. Built with Next.js 14, Tailwind CSS, Jotai & Supabase.',
      tagline: 'Precision Engineering ✕ Aesthetic Craft',
    },
  },
  en: {
    nav: {
      works: 'Selected Works',
      bento: 'Core Modules',
      deepDive: 'Deep Dive',
      experience: 'Experience',
      contact: 'Contact',
      contactBtn: 'Get in Touch',
      status: 'Available Now',
    },
    hero: {
      badge: 'OPEN FOR OPPORTUNITIES • AVAILABLE IMMEDIATELY',
      viewWorks: 'Explore Works',
      viewExp: 'View Experience',
      expLabel: 'EXPERIENCE',
      stackLabel: 'CORE STACK',
      dsLabel: 'DESIGN SYSTEM',
      perfLabel: 'PERFORMANCE',
    },
    bento: {
      tag: '01 / CORE MODULES',
      title: 'Core Capabilities & Bento Modules',
      subtitle: 'From frontend architecture and enterprise design systems to modern toolchains.',
    },
    projects: {
      tag: '02 / SELECTED WORKS',
      title: 'Featured Works',
      subtitle: 'Click any project to enter dedicated case study page for deep technical analysis.',
      viewDetail: 'View Case Study',
    },
    deepDive: {
      tag: '03 / TECHNICAL DEEP DIVE',
      title: 'Engineering Deep Dive',
      subtitle: 'Explore technical decisions, state governance, and micro-interactions across flagship projects.',
      viewPage: 'View Project Page',
      aiBtn: '✨ AI Re-analyze',
      tabs: {
        arch: 'Architecture',
        challenges: 'Challenges Solved',
        motion: 'Motion & Interactions',
        impact: 'Impact & Value',
      },
    },
    experience: {
      tag: '04 / CAREER & EXPERTISE',
      title: 'Career & Expertise',
      subtitle: '5+ years of full lifecycle frontend engineering, architecture design, and performance tuning.',
      workHistory: 'Work History',
      coreStack: 'Core Stack',
    },
    contact: {
      tag: '05 / GET IN TOUCH',
      title: "Let's Connect",
      subtitle: 'Interested in full-time roles, architecture consulting, or project collaborations? Send a note.',
      name: 'Your Name *',
      company: 'Company / Organization',
      email: 'Email Address *',
      scope: 'Inquiry Scope',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      successTitle: 'Message Delivered!',
      successDesc: 'Thank you for reaching out. I will get back to you within 24 hours!',
      sendAnother: 'Send Another Note',
    },
    footer: {
      location: 'Senior Frontend Engineer • Taipei, Taiwan',
      builtWith: 'Lincent Huang. Built with Next.js 14, Tailwind CSS, Jotai & Supabase.',
      tagline: 'Precision Engineering ✕ Aesthetic Craft',
    },
  },
};

// ==========================================
// 📦 GLOBAL STATE ATOMS
// ==========================================
export const siteConfigAtom = atom<SiteConfig>(defaultSiteConfig);
export const modularCardsAtom = atom<ModularCard[]>(defaultModularCards);
export const projectsAtom = atom<ProjectItem[]>([]);
export const selectedProjectAtom = atom<ProjectItem | null>(null);
export const inquiriesAtom = atom<InquiryItem[]>([]);
export const isGeneratingAIAtom = atom<boolean>(false);
export const isTranslatingAtom = atom<boolean>(false);
