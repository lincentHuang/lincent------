'use client';

import React from 'react';
import { useI18n } from '../../../i18n';

export const ProcessSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="process" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="space-y-3 mb-12">
        <div className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs">
          {t.process.tag}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-slate-900">
          {t.process.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
          {t.process.subtitle}
        </p>
      </div>

      {/* 6 Steps Grid (2x3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {t.process.steps.map((s) => (
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
                {s.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
