import { atom } from 'jotai';
import type { Language } from '../types';
import type { MediaMeta, Project, SiteContent } from '../content/types';
import { defaultSiteContent } from '../content/default-site';

export * from '../types';
export type { Project } from '../content/types';

// 語言
export const langAtom = atom<Language>('zh');

// 由 ContentProvider 在伺服器端資料注入（useHydrateAtoms），前台不再先顯示預設值再 fetch
export const siteAtom = atom<SiteContent>(defaultSiteContent);
export const projectsAtom = atom<Project[]>([]);
export const mediaAtom = atom<Record<string, MediaMeta>>({});

export const selectedProjectAtom = atom<Project | null>(null);
export const sidebarScrollPositionAtom = atom<number>(0);
