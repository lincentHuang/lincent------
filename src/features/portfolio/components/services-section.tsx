'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { langAtom } from '../../../store/atoms';
import { Code2, Layout, Zap } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const [lang] = useAtom(langAtom);

  const services = [
    {
      icon: Code2,
      titleZh: '前端架構與全端開發',
      titleEn: 'Frontend Architecture & Dev',
      descZh: '打造高響應、高可擴展性的現代 Web 應用。結合 Next.js 14、React 18、TypeScript 與 Supabase 實現生產級交付。',
      descEn: 'Building responsive, polished web applications with clean structure, TypeScript type-safety, and production-ready execution.',
      tags: ['Next.js 14', 'React 18', 'TypeScript', 'Monorepo'],
    },
    {
      icon: Layout,
      titleZh: '企業級 Design System',
      titleEn: 'Enterprise Design Systems',
      descZh: '基於 Radix UI 與 Tailwind 打造無障礙組件庫與設計 Token，消除工程與設計溝通成本，提升團隊交付速率。',
      descEn: 'Creating clear visual token systems and headless a11y component libraries that keep your product consistent across every touchpoint.',
      tags: ['Radix UI', 'Tailwind CSS', 'Storybook', 'Figma Tokens'],
    },
    {
      icon: Zap,
      titleZh: '極致效能調優與 DX 提升',
      titleEn: 'Performance & DX Engineering',
      descZh: '專注 Core Web Vitals 秒開優化、圖片自動轉檔管線、Jotai 細粒度原子狀態治理與 AST 自動化程式碼生成。',
      descEn: 'Designing intuitive user flows, sub-second LCP optimization, fine-grained state management, and automated AST tooling.',
      tags: ['Core Web Vitals', 'Jotai State', 'ts-morph AST', 'SEO'],
    },
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="space-y-3 mb-12">
        <div className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs">
          {lang === 'en' ? 'Services' : '專業服務範疇'}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-slate-900">
          {lang === 'en' ? 'Creative services for digital brands' : '專注於高標準前端架構與體驗交付'}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
          {lang === 'en'
            ? 'Focused design and development support to help brands build clearer identities, better websites, and refined product experiences.'
            : '提供從需求分析、技術選型、設計系統落地到極致效能調優的全週期前端工程支持。'}
        </p>
      </div>

      {/* 3 Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((s, idx) => {
          const Icon = s.icon;
          const title = lang === 'en' ? s.titleEn : s.titleZh;
          const desc = lang === 'en' ? s.descEn : s.descZh;

          return (
            <div
              key={idx}
              className="p-7 sm:p-8 portfolio-card flex flex-col justify-between space-y-6 group hover:-translate-y-1 transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-[#121218] group-hover:text-white text-slate-800 flex items-center justify-center transition-colors">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-sans font-bold text-slate-900">
                  {title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-50 text-slate-600 border border-slate-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
