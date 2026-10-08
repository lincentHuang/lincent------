'use client';

import React from 'react';
import { useI18n } from '../../../i18n';
import { useSite } from '../../../content/content-provider';
import { tx } from '../../../content/types';
import { Code2, Layout, Zap } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { lang } = useI18n();
  const site = useSite();
  const c = site.services;
  const icons = [Code2, Layout, Zap];

  return (
    <section id="services" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
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

      {/* 3 Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {c.items.map((s, idx) => {
          const Icon = icons[idx] || Code2;

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
                  {tx(s.title, lang)}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {tx(s.desc, lang)}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-50 text-slate-600 border border-slate-200"
                  >
                    {tag}
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
