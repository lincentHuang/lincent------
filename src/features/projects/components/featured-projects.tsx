'use client';

import React from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { projectsAtom, langAtom } from '../../../store/atoms';
import { ArrowUpRight, Star } from 'lucide-react';

export const FeaturedProjects: React.FC = () => {
  const [projects] = useAtom(projectsAtom);
  const [lang] = useAtom(langAtom);

  return (
    <section id="projects" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3">
          <div className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs">
            {lang === 'en' ? 'Selected work' : '精選代表作品'}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-slate-900">
            {lang === 'en' ? 'Projects with clarity' : '以清晰架構打造的旗艦專案'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl font-normal leading-relaxed">
            {lang === 'en'
              ? 'A curated collection of web architecture, design systems, and product engineering work created for modern teams.'
              : '從 0 到 1 打造的現代 Web 應用、企業級設計系統與極致效能架構代表作。'}
          </p>
        </div>

        <Link
          href="/projects"
          className="self-start md:self-end flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 transition-all hover:scale-105 shadow-xs"
        >
          <span>{lang === 'en' ? 'View all archive →' : '瀏覽完整作品集庫 (Search) →'}</span>
        </Link>
      </div>

      {/* 2-Column Luxury Modern Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((proj) => {
          const title = lang === 'en' ? (proj.titleEn || proj.title) : proj.title;
          const summary = lang === 'en' ? (proj.summaryEn || proj.summary) : proj.summary;
          const category = lang === 'en' ? (proj.categoryEn || proj.category) : proj.category;
          const primaryTech = proj.techStack?.[0] || 'TypeScript';

          return (
            <Link
              key={proj.id}
              href={`/projects/${proj.id}`}
              className="rounded-[28px] sm:rounded-[32px] bg-white border border-[#E2E4E9] p-4 sm:p-5 shadow-portfolio-card hover:shadow-portfolio-hover hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between block"
            >
              {/* Top Image Box with Frosted Glass Badges & Dots */}
              <div className="relative rounded-[22px] overflow-hidden bg-slate-100 h-64 sm:h-72 w-full mb-5">
                {proj.coverImage ? (
                  <img
                    src={proj.coverImage}
                    alt={title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-mono text-xs">
                    No Preview
                  </div>
                )}

                {/* Floating Glass Pills (Top-Left) */}
                <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold tracking-wide shadow-xs">
                    {category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/15 text-white/90 text-[11px] font-mono shadow-xs">
                    {primaryTech}
                  </span>
                </div>

                {/* Floating Rating / Score Pill (Top-Right) */}
                <div className="absolute top-3.5 right-3.5 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                    <span>4.9</span>
                  </span>
                </div>

                {/* Carousel Pagination Dots Mockup (Bottom) */}
                <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-1.5 z-10 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                </div>
              </div>

              {/* Card Content Details */}
              <div className="space-y-4 px-1 pb-1">
                {/* Header Row: Title & Right Tag */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-sans font-bold text-[#121218] tracking-tight group-hover:text-black transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium pt-0.5">
                      {proj.year} • {proj.company}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full border border-slate-300 text-slate-700 text-xs font-semibold shrink-0">
                    {proj.tag || 'Top rated'}
                  </span>
                </div>

                {/* Description Paragraph */}
                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed line-clamp-2">
                  {summary}
                </p>

                {/* Bottom Action Row: Metric / Role + Sleek Black Pill Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-sm sm:text-base font-bold text-[#121218] block font-sans">
                      {proj.metrics?.[0]?.value || '99%'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      {proj.metrics?.[0]?.label || 'Satisfaction / Performance'}
                    </span>
                  </div>

                  {/* Black Pill Button with Circular Arrow Badge */}
                  <div className="px-4 py-2 rounded-full bg-[#121218] group-hover:bg-black text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all group-hover:scale-105">
                    <span>{lang === 'en' ? 'View Case' : '深入解析'}</span>
                    <span className="w-5 h-5 rounded-full bg-white text-[#121218] flex items-center justify-center">
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
