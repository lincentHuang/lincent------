'use client';

import React from 'react';
import { useI18n } from '../../../i18n';
import { Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="space-y-3 mb-12">
        <div className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs">
          {t.testimonials.tag}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-slate-900">
          {t.testimonials.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
          {t.testimonials.subtitle}
        </p>
      </div>

      {/* 3 Testimonial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {t.testimonials.list.map((item, idx) => (
          <div
            key={idx}
            className="p-7 sm:p-8 portfolio-card flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                <Quote className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-normal leading-relaxed">
                "{item.quote}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#121218] text-white font-bold text-xs flex items-center justify-center">
                {item.author.charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{item.author}</h4>
                <span className="text-[11px] text-slate-500 font-mono">
                  {item.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
