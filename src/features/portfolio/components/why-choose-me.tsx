'use client';

import React from 'react';
import { useI18n } from '../../../i18n';
import { Users, CheckCircle, Clock, Star } from 'lucide-react';

export const WhyChooseMeSection: React.FC = () => {
  const { t } = useI18n();
  const icons = [Users, CheckCircle, Clock, Star];
  const colorStyles = [
    { bg: 'bg-lime-50 text-lime-800' },
    { bg: 'bg-purple-50 text-purple-700' },
    { bg: 'bg-amber-50 text-amber-700' },
    { bg: 'bg-emerald-50 text-emerald-700' },
  ];

  return (
    <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="space-y-3 mb-12">
        <div className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs">
          {t.whyChooseMe.tag}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-slate-900">
          {t.whyChooseMe.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
          {t.whyChooseMe.subtitle}
        </p>
      </div>

      {/* 4 Bento Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {t.whyChooseMe.stats.map((stat, idx) => {
          const Icon = icons[idx] || Users;
          const color = colorStyles[idx] || colorStyles[0];
          return (
            <div key={idx} className="p-7 portfolio-card space-y-4 flex flex-col justify-between">
              <div className={`w-10 h-10 rounded-2xl ${color.bg} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="font-sans font-bold text-3xl sm:text-4xl text-slate-900 block">
                  {stat.value}
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {stat.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
