'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { langAtom } from '../../../store/atoms';

export const ProcessSection: React.FC = () => {
  const [lang] = useAtom(langAtom);

  const steps = [
    {
      num: '01',
      titleZh: '需求洞察與定義 (Discovery)',
      titleEn: 'Discovery',
      descZh: '深入理解專案商業目標、目標用戶畫像、關鍵指標與架構約束。',
      descEn: 'Understanding business goals, user personas, performance targets, and architectural constraints.',
    },
    {
      num: '02',
      titleZh: '架構選型與策略 (Strategy)',
      titleEn: 'Strategy',
      descZh: '制定技術選型（Monorepo、狀態治理、資料庫串接與渲染策略）。',
      descEn: 'Defining technical stack, monorepo structure, state management, and rendering strategy.',
    },
    {
      num: '03',
      titleZh: '設計系統規範 (Direction)',
      titleEn: 'Direction',
      descZh: '建立 Design Tokens、色票、排版規範與無障礙 Headless 元件骨幹。',
      descEn: 'Shaping visual tokens, typography rules, and headless a11y component foundations.',
    },
    {
      num: '04',
      titleZh: '高保真工程研發 (Architecture & Build)',
      titleEn: 'Architecture & Build',
      descZh: '嚴格落實 TypeScript 型別安全、自適應響應式佈局與細緻微互動。',
      descEn: 'Executing type-safe components, fluid responsive layouts, and polished micro-interactions.',
    },
    {
      num: '05',
      titleZh: '極致效能調優 (Performance)',
      titleEn: 'Performance',
      descZh: 'Core Web Vitals 調校、圖片自動 WebP 轉檔、首屏載入壓至 1 秒內。',
      descEn: 'Tuning Core Web Vitals, automated WebP image pipelines, and sub-second page loads.',
    },
    {
      num: '06',
      titleZh: '測試交付與上線 (Delivery)',
      titleEn: 'Delivery',
      descZh: '完備的邊界測試、CI/CD 自動化部署與文件交接，確保穩定生產就緒。',
      descEn: 'Automated CI/CD deployment, boundary test validation, and launch-ready documentation.',
    },
  ];

  return (
    <section id="process" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="space-y-3 mb-12">
        <div className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs">
          {lang === 'en' ? 'Process' : '研發流程'}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-slate-900">
          {lang === 'en' ? 'How the process flows with clarity' : '嚴謹高效的六步全流程推進'}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
          {lang === 'en'
            ? 'A clear and collaborative workflow that moves each project from first idea to polished final result.'
            : '透明、結構化的協作流程，確保專案從概念雛形平穩抵達高品質生產交付。'}
        </p>
      </div>

      {/* 6 Steps Grid (2x3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((s) => {
          const title = lang === 'en' ? s.titleEn : s.titleZh;
          const desc = lang === 'en' ? s.descEn : s.descZh;

          return (
            <div
              key={s.num}
              className="p-7 portfolio-card space-y-4 flex flex-col justify-between group hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-lime-800 bg-lime-50 px-2.5 py-1 rounded-md border border-lime-200">
                  STEP {s.num}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-sans font-bold text-slate-900">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
