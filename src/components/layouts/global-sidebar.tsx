'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import {
  langAtom,
  projectsAtom,
  selectedProjectAtom,
  ProjectItem,
} from '../../store/atoms';
import { ProjectBadgeIcon, getShortProjectTitle } from '../../features/projects/components/project-badge-icon';
import {
  Globe,
  Search,
  ArrowUpRight,
  Mail,
  Lock,
} from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

interface GlobalSidebarProps {
  onItemClick?: () => void;
  activeProjectId?: string;
}

export const GlobalSidebar: React.FC<GlobalSidebarProps> = ({
  onItemClick,
  activeProjectId,
}) => {
  const [lang, setLang] = useAtom(langAtom);
  const [projects] = useAtom(projectsAtom);
  const [selectedProject, setSelectedProject] = useAtom(selectedProjectAtom);
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');

  // Determine active project ID based on props, URL params, or Jotai state
  const currentActiveId = useMemo(() => {
    if (activeProjectId) return activeProjectId;
    if (pathname.startsWith('/projects/')) {
      const seg = pathname.replace('/projects/', '').split('/')[0];
      if (seg) return seg;
    }
    return selectedProject?.id || (projects.length > 0 ? projects[0].id : '');
  }, [activeProjectId, pathname, selectedProject, projects]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  // Filter projects by search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase().trim();
    return projects.filter((p) => {
      const title = (lang === 'en' ? p.titleEn || p.title : p.title).toLowerCase();
      const summary = (lang === 'en' ? p.summaryEn || p.summary : p.summary).toLowerCase();
      const company = (p.company || '').toLowerCase();
      const inStack = (p.techStack || []).some((t) => t.toLowerCase().includes(q));
      return title.includes(q) || summary.includes(q) || company.includes(q) || inStack;
    });
  }, [projects, searchQuery, lang]);

  const handleSelectProject = (proj: ProjectItem) => {
    setSelectedProject(proj);
    if (onItemClick) onItemClick();

    // If already in projects showcase page, update URL without reload
    if (pathname.startsWith('/projects')) {
      window.history.pushState(null, '', `/projects/${proj.id}`);
      window.dispatchEvent(new CustomEvent('project-changed', { detail: { id: proj.id } }));
    } else {
      router.push(`/projects/${proj.id}`);
    }
  };

  const isHome = pathname === '/';
  const isProjects = pathname.startsWith('/projects');

  return (
    <aside className="w-full h-full flex flex-col justify-between py-5 px-4 sm:px-5 lg:py-6 lg:px-5 text-[#121218]">
      <div className="flex flex-col gap-4 w-full">
        {/* 1. BRAND PROFILE CARD */}
        <Link
          href="/"
          onClick={onItemClick}
          className="group block w-full rounded-2xl bg-[#121218] text-white p-4 sm:p-5 border border-white/10 shadow-md transition-all hover:bg-[#1a1a24] active:scale-[0.99]"
        >
          <div className="flex items-start gap-3.5">
            <img
              src="/images/lincent-logo.svg"
              alt="lincent"
              className="w-10 h-10 object-contain rounded-xl shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-sans font-bold text-lg tracking-tight text-white group-hover:text-white/95">
                  lincent
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/15 text-slate-300">
                  STUDIO
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-1 leading-snug line-clamp-2">
                {lang === 'en'
                  ? 'Crafting refined digital products, design systems & frontend architecture.'
                  : '打造頂級品牌、現代架構與極致視覺。'}
              </p>
            </div>
          </div>
        </Link>

        {/* 2. NAVIGATION LINKS & GLOBAL CONTROLS */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-3 shadow-xs flex flex-col gap-2.5">
          {/* Quick Nav Pills */}
          <nav className="flex items-center flex-wrap gap-1.5 text-xs font-medium">
            <Link
              href="/"
              onClick={onItemClick}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                isHome
                  ? 'bg-[#121218] text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-black hover:bg-slate-100'
              }`}
            >
              {lang === 'en' ? 'Home' : '首頁'}
            </Link>
            <Link
              href="/projects"
              onClick={onItemClick}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                isProjects
                  ? 'bg-[#121218] text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-black hover:bg-slate-100'
              }`}
            >
              {lang === 'en' ? 'Works' : '作品集庫'}
            </Link>
            <Link
              href="/#benefits"
              onClick={onItemClick}
              className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-black hover:bg-slate-100 transition-all"
            >
              {lang === 'en' ? 'About' : '關於'}
            </Link>
            <Link
              href="/#services"
              onClick={onItemClick}
              className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-black hover:bg-slate-100 transition-all"
            >
              {lang === 'en' ? 'Services' : '專案服務'}
            </Link>
            <Link
              href="/#contact"
              onClick={onItemClick}
              className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-black hover:bg-slate-100 transition-all"
            >
              {lang === 'en' ? 'Contact' : '聯絡'}
            </Link>
          </nav>

          {/* Action Row: Language Switch & Let's talk CTA */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-all active:scale-95"
              title="切換語言 / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'zh' ? '繁中' : 'EN'}</span>
            </button>

            <Link
              href="/#contact"
              onClick={onItemClick}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#121218] text-white text-xs font-semibold hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-xs"
            >
              <span>{lang === 'en' ? "Let's talk" : '聯繫合作'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3. SEARCH FILTER INPUT */}
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'en' ? 'Search works, tags, stacks...' : '搜尋專案、技術棧、關鍵字...'
            }
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white border border-slate-200/90 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#121218] transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black text-xs font-mono"
            >
              ✕
            </button>
          )}
        </div>

        {/* 4. STACKING PROJECT CARDS */}
        <div className="flex flex-col gap-2.5 w-full max-h-[calc(100vh-380px)] overflow-y-auto pr-1 pb-4 overscroll-contain">
          <div className="flex items-center justify-between px-1 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            <span>{lang === 'en' ? 'Featured Works' : '代表作品'}</span>
            <span>{filteredProjects.length}</span>
          </div>

          {filteredProjects.map((proj, idx) => {
            const isActive = isProjects && proj.id === currentActiveId;
            const title = getShortProjectTitle(proj, lang);
            const summary = lang === 'en' ? proj.summaryEn || proj.summary : proj.summary;
            const tags = (proj.techStack || []).slice(0, 3);

            return (
              <button
                key={proj.id}
                onClick={() => handleSelectProject(proj)}
                style={{
                  position: 'sticky',
                  top: `${Math.min(idx * 4, 32)}px`,
                  zIndex: idx + 1,
                }}
                className={`group text-left w-full rounded-2xl p-3.5 transition-all duration-300 border relative overflow-hidden select-none ${
                  isActive
                    ? 'bg-[#121218] text-white border-[#121218] shadow-md scale-[1.01]'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none rounded-tr-2xl" />
                )}

                <div className="flex items-start gap-3">
                  <ProjectBadgeIcon id={proj.id} className="w-5 h-5" />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`font-sans font-bold text-sm tracking-tight truncate ${
                          isActive ? 'text-white' : 'text-slate-900 group-hover:text-black'
                        }`}
                      >
                        {title}
                      </h4>
                      {proj.isNew && (
                        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-lime-400 text-[#121218]">
                          NEW
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-xs font-normal leading-relaxed line-clamp-2 ${
                        isActive ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {summary}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border transition-colors ${
                            isActive
                              ? 'bg-white/10 border-white/15 text-slate-200'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          {filteredProjects.length === 0 && (
            <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-mono">
              {lang === 'en' ? 'No works found' : '無符合條件的專案'}
            </div>
          )}
        </div>
      </div>

      {/* 5. SIDEBAR FOOTER: AVAILABILITY & SOCIAL LINKS */}
      <div className="pt-4 border-t border-slate-200/80 mt-auto flex flex-col gap-3">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-1 text-[11px] font-medium text-emerald-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{lang === 'en' ? 'Available for projects' : '可接受新專案合作'}</span>
        </div>

        {/* Social Icons & Admin link */}
        <div className="flex items-center justify-between px-1 text-slate-500 text-xs">
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/lincentt"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg hover:bg-slate-200/70 hover:text-black transition-colors"
              title="GitHub"
            >
              <GithubIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.linkedin.com/in/lincent-huang-6b318413b/"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg hover:bg-slate-200/70 hover:text-black transition-colors"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="mailto:contact@lincent.me"
              className="p-1.5 rounded-lg hover:bg-slate-200/70 hover:text-black transition-colors"
              title="Email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-800 transition-colors p-1"
            title="Admin Console"
          >
            <Lock className="w-3 h-3" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
