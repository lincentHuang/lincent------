'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { modularCardsAtom, langAtom, uiDict } from '../../../store/atoms';
import {
  Code2,
  Layers,
  Layout,
  Cpu,
  Zap,
  Sparkles,
  Award,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  FolderPlus,
} from 'lucide-react';

export const BentoGridSection: React.FC<{ loading?: boolean; error?: string | null; onRetry?: () => void }> = ({
  loading = false,
  error = null,
  onRetry,
}) => {
  const [cards] = useAtom(modularCardsAtom);
  const [lang] = useAtom(langAtom);
  const t = uiDict[lang].bento;

  const getIcon = (name?: string) => {
    switch (name) {
      case 'Layers':
        return Layers;
      case 'Layout':
        return Layout;
      case 'Cpu':
        return Cpu;
      case 'Zap':
        return Zap;
      case 'Award':
        return Award;
      case 'TrendingUp':
        return TrendingUp;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Code2':
      default:
        return Code2;
    }
  };

  const getColorStyles = (color?: string) => {
    switch (color) {
      case 'violet':
        return {
          glow: 'hover:shadow-md',
          border: 'border-purple-200',
          bgIcon: 'bg-purple-50 text-purple-600',
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'rose':
        return {
          glow: 'hover:shadow-md',
          border: 'border-rose-200',
          bgIcon: 'bg-rose-50 text-rose-600',
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'emerald':
        return {
          glow: 'hover:shadow-md',
          border: 'border-emerald-200',
          bgIcon: 'bg-emerald-50 text-emerald-600',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'amber':
        return {
          glow: 'hover:shadow-md',
          border: 'border-amber-200',
          bgIcon: 'bg-amber-50 text-amber-600',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'cyan':
      default:
        return {
          glow: 'hover:shadow-md',
          border: 'border-cyan-200',
          bgIcon: 'bg-cyan-50 text-cyan-600',
          badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        };
    }
  };

  // 1. STATE: LOADING (Skeleton UI)
  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 p-8 rounded-3xl h-64 animate-pulse bg-slate-100" />
          <div className="md:col-span-4 p-8 rounded-3xl h-64 animate-pulse bg-slate-100" />
          <div className="md:col-span-4 p-8 rounded-3xl h-64 animate-pulse bg-slate-100" />
          <div className="md:col-span-8 p-8 rounded-3xl h-64 animate-pulse bg-slate-100" />
        </div>
      </section>
    );
  }

  // 2. STATE: ERROR
  if (error) {
    return (
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        <div className="p-8 rounded-3xl bg-white border border-rose-200 max-w-md mx-auto space-y-3 shadow-xs">
          <p className="text-xs text-rose-600 font-mono">載入模組失敗：{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center gap-1.5 mx-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" /> 重新嘗試
            </button>
          )}
        </div>
      </section>
    );
  }

  const visibleCards = cards.filter((c) => c.isVisible);

  // 3. STATE: EMPTY
  if (visibleCards.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        <div className="p-12 rounded-3xl bg-white border border-slate-200 max-w-lg mx-auto space-y-3 shadow-xs">
          <FolderPlus className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-sans font-bold text-base text-slate-900">尚未建立自訂模組卡片</h3>
          <p className="text-xs text-slate-500">您可登入管理後台隨時新增技能、工具或服務卡片。</p>
        </div>
      </section>
    );
  }

  // 4. & 5. STATE: SUCCESS & ACTIVE (Bento Grid)
  return (
    <section id="bento" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="space-y-2 mb-10">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-700 tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.tag}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-sans font-bold tracking-tight text-slate-900">
          {t.title}
        </h2>
        <p className="text-slate-600 text-sm max-w-2xl font-sans">
          {t.subtitle}
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {visibleCards.map((card, idx) => {
          const IconComponent = getIcon(card.icon);
          const colorStyles = getColorStyles(card.color);
          const title = lang === 'en' ? (card.titleEn || card.titleZh) : card.titleZh;
          const desc = lang === 'en' ? (card.descEn || card.descZh) : card.descZh;
          const tag = lang === 'en' ? (card.tagEn || card.tagZh) : card.tagZh;

          // Bento span logic: Alternate wide and compact
          const spanClass =
            idx % 3 === 0
              ? 'md:col-span-7'
              : idx % 3 === 1
              ? 'md:col-span-5'
              : 'md:col-span-12';

          return (
            <div
              key={card.id}
              className={`${spanClass} p-7 sm:p-9 rounded-3xl bg-white border border-slate-200 shadow-portfolio-card ${colorStyles.glow} transition-all duration-500 hover:-translate-y-1 group flex flex-col justify-between space-y-6 relative overflow-hidden`}
            >
              {/* Card Top Meta */}
              <div className="flex items-start justify-between gap-4">
                <div className={`w-12 h-12 rounded-2xl ${colorStyles.bgIcon} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                  <IconComponent className="w-6 h-6" />
                </div>

                {tag && (
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${colorStyles.badge}`}>
                    {tag}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-sans font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                  {desc}
                </p>
              </div>

              {/* Card Dynamic Add-ons */}
              {card.items && card.items.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  {card.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-xl text-xs font-mono bg-slate-50 text-slate-700 border border-slate-200 hover:border-cyan-500 transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {card.metricsValue && (
                <div className="pt-2">
                  <span className="font-sans font-bold text-3xl sm:text-4xl text-cyan-600 block">
                    {card.metricsValue}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
