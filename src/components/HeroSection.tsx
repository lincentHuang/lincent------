'use client';

import React from 'react';
import { resumeData } from '../data/resumeData';
import {
  Sparkles,
  Boxes,
  MapPin,
  FileCheck2,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Framer-style Ambient Glow Gradients */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-framer-cyan/10 blur-[130px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        {/* Left Typography & Highlights (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Framer Micro Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-framer-emerald animate-ping" />
            <span>開放全職機會與專案合作 • 2026/10 可到職</span>
          </div>

          {/* Huge Framer-style Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tighter text-white leading-[1.08]">
              把複雜系統極簡化，
              <br />
              賦予<span className="text-gradient-rainbow">極致美感</span>與<span className="text-framer-cyan">實用價值</span>。
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-300">
              我是 <strong className="text-white font-bold">{resumeData.name} ({resumeData.englishName})</strong>，{resumeData.subtitle}。
            </p>
          </div>

          {/* Story & Philosophy */}
          <p className="text-sm sm:text-base text-framer-subtext leading-relaxed max-w-2xl font-sans">
            擁有 <strong className="text-white font-semibold">{resumeData.yearsOfExp}</strong> 前端開發與 UI/UX 實戰經驗。專注於大型 Monorepo 架構、Jotai 原子化狀態管理、AST 自動化代碼生成與 Design System。在追求毫秒級渲染極限的同時，創造真實商業轉換率。
          </p>

          {/* Framer-style Tech Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { name: 'Jotai 原子化狀態', glow: 'hover:border-framer-amber text-amber-300 bg-amber-500/10' },
              { name: 'Turborepo Monorepo', glow: 'hover:border-framer-violet text-purple-300 bg-purple-500/10' },
              { name: 'Next.js 14 (App Router)', glow: 'hover:border-framer-cyan text-cyan-300 bg-cyan-500/10' },
              { name: 'Radix UI Design System', glow: 'hover:border-framer-emerald text-emerald-300 bg-emerald-500/10' },
              { name: 'Figma UI/UX & Tokens', glow: 'hover:border-framer-coral text-rose-300 bg-rose-500/10' },
            ].map((tag) => (
              <span
                key={tag.name}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border border-white/[0.08] backdrop-blur-md transition-all duration-300 ${tag.glow}`}
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* Framer CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-4">
            <button
              onClick={() => scrollTo('carousel-section')}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-display font-black text-sm shadow-framer-glow-cyan transition-all flex items-center gap-2 active:scale-95"
            >
              <Boxes className="w-4 h-4 text-framer-violet" />
              <span>瀏覽精選作品輪播</span>
            </button>

            <button
              onClick={() => scrollTo('ai-deep-dive')}
              className="px-5 py-3.5 rounded-2xl framer-glass hover:border-white/20 text-white font-display font-bold text-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-framer-cyan" />
              <span>AI 專案深度剖析</span>
            </button>

            <button
              onClick={() => scrollTo('resume-section')}
              className="px-5 py-3.5 rounded-2xl text-slate-300 hover:text-white font-display font-bold text-sm transition-all flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4 text-framer-emerald" />
              <span>完整經歷細節 ↓</span>
            </button>
          </div>
        </div>

        {/* Right Framer Bento Matrix Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-7 rounded-3xl framer-glass shadow-framer-card space-y-5 relative overflow-hidden group">
            {/* Top Tag */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-framer-cyan animate-pulse" />
                <span className="font-mono text-xs font-bold text-framer-subtext">
                  DEVELOPER DNA
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-framer-violet/20 text-indigo-300 border border-framer-violet/30">
                5~6 YRS EXPERIENCE
              </span>
            </div>

            {/* Avatar & Title */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-framer-cyan via-framer-violet to-framer-amber p-[1.5px] shadow-framer-glow-violet">
                <div className="w-full h-full bg-[#0E1015] rounded-[14px] flex items-center justify-center font-display font-black text-white text-2xl">
                  LC
                </div>
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-white">
                  黃令成 (Lincent)
                </h3>
                <p className="text-xs text-framer-subtext mt-0.5">
                  海宇顧問 前端工程師 • 開放新機會
                </p>
                <div className="flex items-center gap-1 text-xs font-mono text-framer-emerald mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>雙北 / 遠端工作皆可</span>
                </div>
              </div>
            </div>

            {/* Metrics Matrix */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
                <div className="text-lg font-display font-black text-framer-cyan">80+</div>
                <div className="text-[10px] text-framer-subtext mt-0.5">UI 獨立套件</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
                <div className="text-lg font-display font-black text-framer-emerald">99/100</div>
                <div className="text-[10px] text-framer-subtext mt-0.5">SEO 滿分標準</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
                <div className="text-lg font-display font-black text-framer-amber">100%</div>
                <div className="text-[10px] text-framer-subtext mt-0.5">企劃獨立上稿</div>
              </div>
            </div>

            {/* Quote */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-framer-cyan/10 to-framer-violet/10 border border-white/[0.08] text-xs text-slate-300 leading-relaxed font-sans">
              ✨ <strong>核心特質</strong>：極簡、創新、圓融、溫暖。對系統、數據、資料架構整齊有極高自我要求。
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
