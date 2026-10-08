'use client';

import React from 'react';
import { useI18n } from '../../../i18n';
import { useSite } from '../../../content/content-provider';
import { tx } from '../../../content/types';

export const ProcessSection: React.FC = () => {
  const { lang } = useI18n();
  const site = useSite();
  const c = site.process;

  return (
    <section id="process" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="space-y-3 mb-12">
        <div className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs">
          {tx(c.tag, lang)}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-slate-900">
          {tx(c.title, lang)}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
          {tx(c.subtitle, lang)}
        </p>
      </div>

      {/* 6 Steps Grid (2x3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {c.steps.map((s, idx) => (
          <div
            key={idx}
            className="p-7 portfolio-card space-y-4 flex flex-col justify-between group hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-lime-800 bg-lime-50 px-2.5 py-1 rounded-md border border-lime-200">
                STEP {String(idx + 1).padStart(2, '0')}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-sans font-bold text-slate-900">
                {tx(s.title, lang)}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {tx(s.desc, lang)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
