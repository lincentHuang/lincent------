'use client';

import React from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { langAtom } from '../../store/atoms';
import { ArrowUp, Code2, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const [lang] = useAtom(langAtom);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-16 px-4 sm:px-8 max-w-6xl mx-auto border-t border-slate-200 mt-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8">
        <div className="space-y-1 text-center md:text-left">
          <span className="font-sans font-bold text-xl tracking-tight text-slate-900 block">
            Lincent Huang
          </span>
          <p className="text-xs text-slate-500 font-mono">
            {lang === 'en' ? 'Senior Frontend Architect • Taipei, Taiwan' : '資深前端架構師 • 台灣台北'}
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
          <a href="#benefits" className="hover:text-black transition-colors">
            {lang === 'en' ? 'Benefits' : '優勢'}
          </a>
          <Link href="/projects" className="hover:text-black transition-colors">
            {lang === 'en' ? 'Projects' : '作品集庫'}
          </Link>
          <a href="#services" className="hover:text-black transition-colors">
            {lang === 'en' ? 'Services' : '服務'}
          </a>
          <a href="#process" className="hover:text-black transition-colors">
            {lang === 'en' ? 'Process' : '流程'}
          </a>
          <a href="#experience" className="hover:text-black transition-colors">
            {lang === 'en' ? 'Experience' : '經歷'}
          </a>
        </div>

        {/* Social / Top */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/lincentt"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 transition-all shadow-xs"
            title="GitHub"
          >
            <Code2 className="w-4 h-4" />
          </a>
          <a
            href="mailto:lincent.work@gmail.com"
            className="p-2.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 transition-all shadow-xs"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 transition-all shadow-xs"
            title="回到頂部"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
        <span>© {new Date().getFullYear()} Lincent Huang. Crafted with clarity.</span>
        <span>Built with Next.js 14, Tailwind CSS & Supabase</span>
      </div>
    </footer>
  );
};
