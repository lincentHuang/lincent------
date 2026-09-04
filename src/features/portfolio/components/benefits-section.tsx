'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { langAtom } from '../../../store/atoms';
import { Sparkles } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const [lang] = useAtom(langAtom);

  return (
    <section id="benefits" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="space-y-3 mb-12">
        <div className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs">
          {lang === 'en' ? 'Benefits' : '核心優勢'}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-slate-900">
          {lang === 'en' ? 'Discover why we stand out' : '探索卓越的工程與設計標準'}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
          {lang === 'en'
            ? 'Designing clean, responsive websites that communicate clearly, guide visitors smoothly, and support meaningful business goals.'
            : '打造簡潔、高響應度的前端架構與設計系統，清晰傳達產品價值，並為團隊創造實質商業回報。'}
        </p>
      </div>

      {/* 3 Bento Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Card 1: Clear Design Systems (7 Cols) */}
        <div className="md:col-span-7 p-7 sm:p-9 portfolio-card flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-sans font-bold text-slate-900">
              {lang === 'en' ? 'Clear design systems' : '企業級 Design System 設計系統'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {lang === 'en'
                ? 'Elevate your brand with specialized design systems, consistent tokenized palettes, and reusable headless component architectures.'
                : '基於 Radix UI 與 Storybook 打造無障礙 (a11y) 元件庫，建立團隊單一真理源，讓產品在所有端點保持極致一致性。'}
            </p>
          </div>

          {/* Interactive UI Component Tokens Preview */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              // Reusable Component Tokens
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
              {lang === 'en' ? 'Websites built to perform' : '為極致效能與 SEO 而生'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {lang === 'en'
                ? 'Dominate search rankings with precision-tailored architecture designed for sub-second loading and top Core Web Vitals.'
                : '以嚴謹的 Core Web Vitals 調校、圖片自動 WebP 轉檔與 SSR/SSG 混合渲染，實現秒開與 SEO 最佳化。'}
            </p>
          </div>

          {/* Performance Analytics Widget Mockup */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Lighthouse Score</span>
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
              <span>{lang === 'en' ? 'Modern Architecture' : '現代化前端工程架構'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-sans font-bold text-slate-900">
              {lang === 'en' ? 'Production-ready execution with Next.js 14 & Turborepo' : 'Turborepo Monorepo ✕ Next.js 14 ✕ 原子狀態治理'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {lang === 'en'
                ? 'Expand and flourish with modern React 18, Jotai atomic state management, TypeScript, and automated AST code generation.'
                : '深耕大型 Monorepo 模組化設計、Jotai 精細化原子狀態管理與 ts-morph AST 自動化，賦能團隊 100% 高效交付。'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:max-w-xs">
            {['Next.js 14', 'React 18', 'TypeScript', 'Turborepo', 'Jotai', 'Tailwind', 'Supabase', 'PostgreSQL'].map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-50 text-slate-800 border border-slate-200 font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
