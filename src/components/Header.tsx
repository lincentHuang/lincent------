'use client';

import React from 'react';
import {
  Sparkles,
  Boxes,
  FileText,
  Send,
} from 'lucide-react';

export const Header: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-4 backdrop-blur-xl bg-[#08090C]/80 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo (Framer Style) */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-framer-cyan via-framer-violet to-framer-amber flex items-center justify-center p-[1px] shadow-framer-glow-cyan">
            <div className="w-full h-full bg-[#08090C] rounded-[11px] flex items-center justify-center font-display font-black text-white text-base">
              L
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm tracking-tight text-white group-hover:text-framer-cyan transition-colors">
                黃令成
              </span>
              <span className="text-xs font-mono text-framer-subtext">
                (Lincent)
              </span>
            </div>
            <p className="text-[11px] font-mono text-framer-subtext hidden sm:block">
              Senior Frontend • 5~6 Yrs Exp
            </p>
          </div>
        </button>

        {/* Center Framer-style Pills Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-full border border-white/[0.08] backdrop-blur-md">
          <button
            onClick={() => scrollTo('carousel-section')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <Boxes className="w-3.5 h-3.5 text-framer-amber" />
            <span>精選作品輪播</span>
          </button>

          <button
            onClick={() => scrollTo('ai-deep-dive')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-framer-violet" />
            <span>AI 專案剖析</span>
          </button>

          <button
            onClick={() => scrollTo('resume-section')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-framer-cyan" />
            <span>完整履歷</span>
          </button>

          <button
            onClick={() => scrollTo('inquiry-section')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <Send className="w-3.5 h-3.5 text-framer-coral" />
            <span>合作邀請</span>
          </button>
        </nav>

        {/* Right CTA Control */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => scrollTo('inquiry-section')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-framer-cyan to-framer-violet text-slate-950 shadow-framer-glow-cyan hover:opacity-95 transition-all font-display active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>發送面試/合作邀請</span>
          </button>
        </div>
      </div>
    </header>
  );
};
