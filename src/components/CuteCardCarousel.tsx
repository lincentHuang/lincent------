'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { projectsAtom, selectedProjectAtom, ProjectItem } from '../store/atoms';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const CuteCardCarousel: React.FC = () => {
  const [projects] = useAtom(projectsAtom);
  const [, setSelectedProject] = useAtom(selectedProjectAtom);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getThemeStyles = (themeColor: string) => {
    switch (themeColor) {
      case 'purple':
        return {
          glow: 'hover:shadow-framer-glow-violet',
          badge: 'bg-framer-violet/10 text-indigo-300 border-framer-violet/30',
          btn: 'bg-framer-violet hover:bg-violet-600 text-white',
        };
      case 'coral':
        return {
          glow: 'hover:shadow-framer-glow-coral',
          badge: 'bg-framer-coral/10 text-rose-300 border-framer-coral/30',
          btn: 'bg-framer-coral hover:bg-rose-600 text-white',
        };
      case 'mint':
        return {
          glow: 'hover:shadow-framer-glow-emerald',
          badge: 'bg-framer-emerald/10 text-emerald-300 border-framer-emerald/30',
          btn: 'bg-framer-emerald hover:bg-emerald-600 text-white',
        };
      case 'yellow':
      default:
        return {
          glow: 'hover:shadow-framer-glow-amber',
          badge: 'bg-framer-amber/10 text-amber-300 border-framer-amber/30',
          btn: 'bg-framer-amber hover:bg-amber-500 text-slate-950',
        };
    }
  };

  return (
    <section id="carousel-section" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header with Carousel Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-framer-amber mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FEATURED PROJECTS CAROUSEL</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white">
            精選作品 • 可愛卡片輪播
          </h2>
          <p className="text-framer-subtext text-sm mt-1">
            點擊任一卡片可開啟獨立專屬分頁，查看完整架構分析、動畫細節與展示。
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-2xl framer-glass text-slate-300 hover:text-white flex items-center justify-center hover:bg-white/[0.08] active:scale-95 transition-all"
            title="向左滑動"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-2xl framer-glass text-slate-300 hover:text-white flex items-center justify-center hover:bg-white/[0.08] active:scale-95 transition-all"
            title="向右滑動"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cards Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-6 no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {projects.map((project) => {
          const theme = getThemeStyles(project.themeColor);

          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className={`snap-start min-w-[310px] sm:min-w-[380px] max-w-[400px] p-6 sm:p-7 rounded-3xl framer-glass shadow-framer-card ${theme.glow} transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-2 group block`}
            >
              {/* Card Cover Banner */}
              {project.coverImage && (
                <div className="rounded-2xl overflow-hidden mb-4 border border-white/[0.08] max-h-44 relative">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1015] via-transparent to-transparent opacity-60" />
                </div>
              )}

              {/* Card Header */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${theme.badge}`}>
                    {project.badge || '✨ 亮點專案'}
                  </span>
                  <span className="font-mono text-xs text-framer-subtext">
                    {project.year}
                  </span>
                </div>

                <h3 className="text-xl font-display font-black text-white group-hover:text-framer-cyan transition-colors leading-snug">
                  {project.title}
                </h3>

                <p className="text-xs text-framer-subtext line-clamp-2 leading-relaxed">
                  {project.summary}
                </p>
              </div>

              {/* Tech Stack Pills */}
              <div className="my-4 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-white/[0.04] text-framer-subtext border border-white/[0.06]">
                      +{project.techStack.length - 4}
                    </span>
                  )}
                </div>

                {/* Metrics Highlight */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-framer-subtext block font-mono">
                        {project.metrics[0].label}
                      </span>
                      <span className="text-xs font-display font-black text-white">
                        {project.metrics[0].value}
                      </span>
                    </div>
                    {project.metrics[1] && (
                      <div className="text-right">
                        <span className="text-[10px] text-framer-subtext block font-mono">
                          {project.metrics[1].label}
                        </span>
                        <span className="text-xs font-display font-black text-framer-cyan">
                          {project.metrics[1].value}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Bottom Link Button */}
              <div
                className={`w-full py-2.5 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${theme.btn}`}
              >
                <span>進入專案獨立分頁 →</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
