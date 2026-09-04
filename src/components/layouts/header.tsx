'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import { langAtom } from '../../store/atoms';
import { ArrowUpRight, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  const [lang, setLang] = useAtom(langAtom);
  const pathname = usePathname();

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  const isProjectsActive = pathname === '/projects';
  const isHomeActive = pathname === '/';

  return (
    <header className="w-full pt-6 pb-4 px-6 sm:px-12 max-w-7xl mx-auto flex items-center justify-between relative z-40">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <img
          src="/images/lincent-logo.svg"
          alt="lincent"
          className="w-7 h-7 object-contain"
        />
        <span className="font-sans font-bold text-lg tracking-tight text-slate-900 group-hover:opacity-80 transition-opacity">
          lincent
        </span>
      </Link>

      {/* Center Nav Links */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <Link
          href="/"
          className={`transition-colors ${
            isHomeActive ? 'text-black font-semibold' : 'hover:text-black'
          }`}
        >
          {lang === 'en' ? 'Home' : '首頁'}
        </Link>
        <Link href="/#benefits" className="hover:text-black transition-colors">
          {lang === 'en' ? 'About' : '關於'}
        </Link>
        <Link
          href="/projects"
          className={`transition-colors ${
            isProjectsActive ? 'text-black font-semibold' : 'hover:text-black'
          }`}
        >
          {lang === 'en' ? 'Projects' : '作品集庫'}
        </Link>
        <Link href="/#services" className="hover:text-black transition-colors">
          {lang === 'en' ? 'Services' : '專案服務'}
        </Link>
        <Link href="/#contact" className="hover:text-black transition-colors">
          {lang === 'en' ? 'Contact' : '聯絡'}
        </Link>
      </nav>

      {/* Right Controls: Language Switch & Let's talk CTA */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-all shadow-xs active:scale-95"
          title="切換語言 / Switch Language"
        >
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>{lang === 'zh' ? '繁中' : 'EN'}</span>
        </button>

        <Link
          href="/#contact"
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#121218] text-white text-xs font-semibold hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-xs"
        >
          <span>{lang === 'en' ? "Let's talk" : '聯繫合作'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
};
