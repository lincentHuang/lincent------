'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAtom } from 'jotai';
import {
  langAtom,
  projectsAtom,
  selectedProjectAtom,
  ProjectItem,
} from '../../../store/atoms';
import { MarkdownRenderer } from './markdown-renderer';
import { ProjectBadgeIcon, getShortProjectTitle } from './project-badge-icon';
import {
  ExternalLink,
  Sparkles,
  Maximize2,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ProjectShowcaseProps {
  initialProjects?: ProjectItem[];
  initialSelectedId?: string;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  initialProjects = [],
  initialSelectedId,
}) => {
  const [lang] = useAtom(langAtom);
  const [globalProjects, setGlobalProjects] = useAtom(projectsAtom);
  const [selectedProject, setSelectedProject] = useAtom(selectedProjectAtom);

  const [projects, setProjects] = useState<ProjectItem[]>(
    initialProjects.length > 0 ? initialProjects : globalProjects
  );
  const [selectedId, setSelectedId] = useState<string>(
    initialSelectedId || selectedProject?.id || ''
  );
  const [showDeepDive, setShowDeepDive] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const showcaseTopRef = useRef<HTMLDivElement>(null);

  // Sync projects with global atom if available
  useEffect(() => {
    if (globalProjects.length > 0) {
      setProjects(globalProjects);
      if (!selectedId) {
        const target = initialSelectedId
          ? globalProjects.find((p) => p.id === initialSelectedId) || globalProjects[0]
          : globalProjects[0];
        if (target) {
          setSelectedId(target.id);
          setSelectedProject(target);
        }
      }
    } else {
      // Fetch fallback
      fetch('/api/projects')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.projects) {
            setGlobalProjects(data.projects);
            setProjects(data.projects);
            const target = initialSelectedId
              ? data.projects.find((p: ProjectItem) => p.id === initialSelectedId) || data.projects[0]
              : data.projects[0];
            if (target) {
              setSelectedId(target.id);
              setSelectedProject(target);
            }
          }
        })
        .catch((err) => console.error('Failed to load projects in showcase', err));
    }
  }, [globalProjects, initialSelectedId, selectedId, setGlobalProjects, setSelectedProject]);

  // Sync if initialSelectedId changes (e.g. route param)
  useEffect(() => {
    if (initialSelectedId && initialSelectedId !== selectedId) {
      setSelectedId(initialSelectedId);
      const found = projects.find((p) => p.id === initialSelectedId);
      if (found) setSelectedProject(found);
    }
  }, [initialSelectedId, projects, selectedId, setSelectedProject]);

  // Listen to custom project switch event from sidebar
  useEffect(() => {
    const handleProjectChanged = (e: any) => {
      if (e.detail?.id) {
        setSelectedId(e.detail.id);
        const found = projects.find((p) => p.id === e.detail.id);
        if (found) setSelectedProject(found);
        if (showcaseTopRef.current) {
          showcaseTopRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('project-changed', handleProjectChanged);
    return () => window.removeEventListener('project-changed', handleProjectChanged);
  }, [projects, setSelectedProject]);

  // Active selected project
  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedId) || selectedProject || projects[0] || null;
  }, [projects, selectedId, selectedProject]);

  // Format hashtags for project
  const getHashtags = (p: ProjectItem) => {
    const rawTags = [
      ...(p.techStack || []).slice(0, 4),
      p.category || 'Architecture',
      p.tag || 'Design',
    ];
    const set = new Set<string>();
    rawTags.forEach((t) => {
      const clean = t.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean && clean.length > 1) set.add(clean);
    });
    return Array.from(set).slice(0, 6);
  };

  if (!activeProject) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 font-mono text-xs">
          <Sparkles className="w-4 h-4 text-[#121218] animate-spin" />
          <span>Loading Works...</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={showcaseTopRef} className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* 1. TOP HEADER CARD */}
      <div className="rounded-[28px] border border-slate-200/90 bg-white p-7 sm:p-9 shadow-xs flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold tracking-tight text-[#121218]">
              {getShortProjectTitle(activeProject, lang)}
            </h1>
          </div>

          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
            {lang === 'en'
              ? activeProject.subtitleEn || activeProject.summaryEn || activeProject.summary
              : activeProject.subtitle || activeProject.summary}
          </p>

          <div className="text-xs font-mono text-slate-400 pt-1">
            {activeProject.company} • {activeProject.year}
          </div>
        </div>

        <div className="flex flex-col xl:items-end gap-3.5 shrink-0">
          <div className="flex flex-wrap gap-1.5 xl:justify-end max-w-md">
            {getHashtags(activeProject).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            {activeProject.demoUrl && (
              <a
                href={activeProject.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#121218] hover:bg-black text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all hover:scale-105 active:scale-95"
              >
                <span>{lang === 'en' ? 'Live Demo' : '線上體驗'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => setShowDeepDive(!showDeepDive)}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800 flex items-center gap-1.5 shadow-xs transition-all"
            >
              <span>{showDeepDive ? (lang === 'en' ? 'Hide Technical Notes' : '收合技術筆記') : (lang === 'en' ? 'Technical Notes' : '技術架構筆記')}</span>
              {showDeepDive ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. VISUAL GALLERY ROW 1: Asymmetric 60% / 40% Contrast Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left (60% Width) — Dark Mockup Asset */}
        <div
          onClick={() =>
            setLightboxImage(
              activeProject.coverImage ||
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80'
            )
          }
          className="lg:col-span-7 bg-[#0A0A0E] text-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 flex flex-col justify-between min-h-[400px] sm:min-h-[460px] relative overflow-hidden group shadow-md border border-white/5 cursor-zoom-in"
        >
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between z-10">
            <span className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono tracking-wider text-slate-300">
              01 / {lang === 'en' ? 'Visual & Mockup' : '視覺與系統呈現'}
            </span>
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform">
              <Maximize2 className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="my-auto py-8 flex items-center justify-center relative z-10">
            <img
              src={
                activeProject.coverImage ||
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80'
              }
              alt={activeProject.title}
              className="max-h-[280px] w-auto max-w-full object-contain rounded-2xl shadow-2xl group-hover:scale-[1.03] transition-transform duration-500"
            />
          </div>

          <div className="z-10 flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-slate-400">
            <span>Visual Concept & System Art</span>
            <span className="text-lime-400 font-semibold">Ready to scale</span>
          </div>
        </div>

        {/* Right (40% Width) — Clean Tech & Stats Card */}
        <div className="lg:col-span-5 bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 flex flex-col justify-between border border-slate-200/90 shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600">
                02 / {lang === 'en' ? 'Architecture & Metrics' : '架構與指標'}
              </span>
              <span className="text-xs font-mono text-slate-400">Specs & Metrics</span>
            </div>

            <h3 className="font-sans font-bold text-xl sm:text-2xl tracking-tight text-[#121218]">
              {activeProject.tag || 'High Performance Web'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {lang === 'en'
                ? activeProject.summaryEn || activeProject.summary
                : activeProject.summary}
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                Tech Stack
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(activeProject.techStack || []).map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Lighthouse: 99+</span>
            <span className="text-emerald-600 font-semibold">Production Verified</span>
          </div>
        </div>
      </div>

      {/* 3. VISUAL GALLERY ROW 2: 3-Column Asset Mockups */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Asset Card A */}
        <div
          onClick={() =>
            setLightboxImage(
              activeProject.images?.[0] ||
                activeProject.coverImage ||
                'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
            )
          }
          className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between group cursor-zoom-in hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between pb-3 text-xs font-mono text-slate-500">
            <span>Component Architecture</span>
            <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-black" />
          </div>
          <div className="h-44 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center p-2">
            <img
              src={
                activeProject.images?.[0] ||
                activeProject.coverImage ||
                'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
              }
              alt="Component View"
              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Asset Card B */}
        <div
          onClick={() =>
            setLightboxImage(
              activeProject.images?.[1] ||
                activeProject.coverImage ||
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
            )
          }
          className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between group cursor-zoom-in hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between pb-3 text-xs font-mono text-slate-500">
            <span>Design Tokens & Theme</span>
            <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-black" />
          </div>
          <div className="h-44 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center p-2">
            <img
              src={
                activeProject.images?.[1] ||
                activeProject.coverImage ||
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
              }
              alt="Tokens View"
              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Asset Card C */}
        <div
          onClick={() =>
            setLightboxImage(
              activeProject.images?.[2] ||
                activeProject.coverImage ||
                'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
            )
          }
          className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between group cursor-zoom-in hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between pb-3 text-xs font-mono text-slate-500">
            <span>Interaction & State Flow</span>
            <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-black" />
          </div>
          <div className="h-44 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center p-2">
            <img
              src={
                activeProject.images?.[2] ||
                activeProject.coverImage ||
                'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
              }
              alt="State Flow"
              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* 4. EXPANDABLE TECHNICAL DEEP DIVE ACCORDION */}
      {showDeepDive && (
        <div className="rounded-[28px] border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6 animate-fade-in">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-mono text-lime-600 font-semibold uppercase tracking-wider">
              Technical Deep Dive
            </span>
            <h2 className="text-2xl font-sans font-bold text-[#121218] pt-1">
              {activeProject.title}
            </h2>
          </div>

          {activeProject.painPoints && activeProject.painPoints.length > 0 && (
            <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-500">
                關鍵痛點與解決方案 (Challenges Solved)
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                {activeProject.painPoints.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-lime-600 font-bold">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeProject.contentMd && (
            <div className="pt-4">
              <MarkdownRenderer content={activeProject.contentMd} />
            </div>
          )}
        </div>
      )}

      {/* 5. LIGHTBOX FULLSCREEN ZOOM MODAL */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightboxImage}
            alt="Preview"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/10"
          />
        </div>
      )}
    </div>
  );
};
