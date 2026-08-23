'use client';

import React from 'react';
import { resumeData } from '../data/resumeData';
import { Sparkles, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#050608] text-white border-t border-white/[0.08] pt-16 pb-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-10 border-b border-white/[0.08]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-framer-cyan animate-ping" />
              <span className="font-mono text-xs text-framer-subtext font-bold uppercase tracking-wider">
                PORTFOLIO & RESUME SYSTEM 2026
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white">
              黃令成 <span className="text-gradient-rainbow">(Lincent Huang)</span>
            </h2>
            <p className="text-sm text-framer-subtext max-w-lg">
              {resumeData.title} • 把複雜系統極簡化，賦予極致美感與實用價值。
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="px-5 py-3 rounded-2xl framer-glass hover:bg-white/[0.08] text-slate-200 text-xs font-bold flex items-center gap-2 transition-all active:scale-95"
          >
            <ArrowUp className="w-4 h-4 text-framer-amber" />
            <span>回到頁面頂部</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-framer-subtext">
          <div>
            © {new Date().getFullYear()} {resumeData.name} ({resumeData.englishName}) • All Rights Reserved.
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span>Crafted with Framer Aesthetics • Next.js 14 • Jotai</span>
            <Sparkles className="w-3.5 h-3.5 text-framer-cyan" />
          </div>
        </div>
      </div>
    </footer>
  );
};
