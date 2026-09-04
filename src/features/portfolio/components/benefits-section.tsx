'use client';

import React from 'react';
import { useI18n } from '../../../i18n';
import { Sparkles } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="benefits" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="space-y-3 mb-12">
        <div className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs">
          {t.benefits.tag}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-slate-900">
          {t.benefits.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
          {t.benefits.subtitle}
        </p>
      </div>

      {/* 3 Bento Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Card 1: Clear Design Systems (7 Cols) */}
        <div className="md:col-span-7 p-7 sm:p-9 portfolio-card flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-sans font-bold text-slate-900">
              {t.benefits.card1.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.benefits.card1.desc}
            </p>
          </div>

          {/* Interactive UI Component Tokens Preview */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              {t.benefits.card1.label}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="px-3.5 py-1.5 rounded-full bg-[#121218] text-white text-xs font-medium">
                Primary
              </button>
              <button className="px-3.5 py-1.5 rounded-full bg-slate-200 text-slate-800 text-xs font-medium">
                Secondary
              </button>
              <button className="px-3.5 py-1.5 rounded-full bg-white border border-slate-300 text-slate-700 text-xs font-medium">
                Outline
              </button>
              <button className="px-3.5 py-1.5 rounded-full bg-transparent hover:bg-slate-200 text-slate-600 text-xs font-medium">
                Ghost
              </button>
              <span className="px-3 py-1 rounded-full bg-lime-50 text-lime-800 border border-lime-300 text-[11px] font-bold">
                Lime Accent
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-bold">
                Violet 80+
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Websites built to perform (5 Cols) */}
        <div className="md:col-span-5 p-7 sm:p-9 portfolio-card flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-sans font-bold text-slate-900">
              {t.benefits.card2.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.benefits.card2.desc}
            </p>
          </div>

          {/* Performance Analytics Widget Mockup */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>{t.benefits.card2.scoreLabel}</span>
              <span className="text-lime-600 font-bold">99 / 100</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">FCP (First Paint)</span>
                <span className="text-sm font-bold text-slate-900">0.4s</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-mono">LCP (Largest Paint)</span>
                <span className="text-sm font-bold text-slate-900">0.8s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Modern Architecture Execution (12 Cols Wide) */}
        <div className="md:col-span-12 p-7 sm:p-9 portfolio-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-50 text-lime-800 border border-lime-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.benefits.card3.tag}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-sans font-bold text-slate-900">
              {t.benefits.card3.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.benefits.card3.desc}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:max-w-xs">
            {['Next.js 14', 'React 18', 'TypeScript', 'Turborepo', 'Jotai', 'Tailwind', 'Supabase', 'PostgreSQL'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-50 text-slate-800 border border-slate-200 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
