'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { langAtom } from '../../../store/atoms';
import { Users, CheckCircle, Clock, Star } from 'lucide-react';

export const WhyChooseMeSection: React.FC = () => {
  const [lang] = useAtom(langAtom);

  return (
    <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="space-y-3 mb-12">
        <div className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs">
          {lang === 'en' ? 'Why choose me' : '核心價值與堅持'}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-slate-900">
          {lang === 'en' ? 'Design built around lasting clarity' : '追求系統、數據、極簡與實用性'}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
          {lang === 'en'
            ? 'I bring strategy, technical architecture, and refined execution together to create meaningful digital experiences with lasting impact.'
            : '結合產品思維、工程架構與高保真視覺執行力，為產品打造兼具商業成效與極致體驗的現代前端體系。'}
        </p>
      </div>

      {/* 4 Bento Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-7 portfolio-card space-y-4 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-2xl bg-lime-50 text-lime-800 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="font-sans font-bold text-3xl sm:text-4xl text-slate-900 block">
              +100K
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              {lang === 'en' ? 'Engaged Users' : '服務累積用戶數'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'en' ? 'Clear technical direction shaped around every business goal.' : '支撐高併發與裂變行銷活動流暢運行。'}
            </p>
          </div>
        </div>

        <div className="p-7 portfolio-card space-y-4 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="font-sans font-bold text-3xl sm:text-4xl text-slate-900 block">
              100%
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              {lang === 'en' ? 'Code & A11y Quality' : '程式碼與可維護性標準'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'en' ? 'Architectures delivered with robust test coverage and single truth.' : '嚴格型別檢查、無障礙規範與自動化 CI/CD。'}
            </p>
          </div>
        </div>

        <div className="p-7 portfolio-card space-y-4 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="font-sans font-bold text-3xl sm:text-4xl text-slate-900 block">
              5+ Yrs
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              {lang === 'en' ? 'Full Lifecycle Exp' : '大中型產品研發實戰'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'en' ? 'Experienced in startup 0-1 and scale-up optimizations.' : '具備從需求分析、架構選型到效能調優完整經驗。'}
            </p>
          </div>
        </div>

        <div className="p-7 portfolio-card space-y-4 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="font-sans font-bold text-3xl sm:text-4xl text-slate-900 block">
              4.9 ★
            </span>
            <h4 className="text-sm font-bold text-slate-900">
              {lang === 'en' ? 'Team Trust & Delivery' : '跨職能協作高度認可'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'en' ? 'Seamless collaboration with designers and backend teams.' : '深得設計師、後端團隊與產品經理信任。'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
