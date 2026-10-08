'use client';

import React from 'react';
import { useI18n } from '../../../i18n';
import { CheckCircle2, GraduationCap } from 'lucide-react';
import { useSite } from '../../../content/content-provider';
import { tx } from '../../../content/types';

export const ResumeSection: React.FC = () => {
  const { t, lang } = useI18n();
  const site = useSite();
  const c = site.experience;

  return (
    <section id="experience" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Work Experience Timeline (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-600" />
            <span>{t.experience.workHistory}</span>
          </h3>

          <div className="space-y-4">
            {c.items.map((exp, idx) => (
              <div
                key={exp.id || idx}
                className="p-6 sm:p-7 portfolio-card space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900">
                      {tx(exp.role, lang)}
                      {exp.badge && tx(exp.badge, lang) && (
                        <span className="ml-2 align-middle px-2 py-0.5 rounded-full bg-lime-50 text-lime-800 border border-lime-200 text-[10px] font-semibold">
                          {tx(exp.badge, lang)}
                        </span>
                      )}
                    </h4>
                    <span className="text-xs font-mono text-lime-600 font-semibold">
                      {tx(exp.company, lang)}{exp.location && tx(exp.location, lang) ? ` · ${tx(exp.location, lang)}` : ''}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 self-start sm:self-auto">
                    {exp.period}{exp.duration && tx(exp.duration, lang) ? ` · ${tx(exp.duration, lang)}` : ''}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {tx(exp.summary, lang)}
                </p>

                {/* Key Responsibilities */}
                {exp.highlights && exp.highlights.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    {exp.highlights.map((resp, rIdx) => (
                      <div
                        key={rIdx}
                        className="text-xs text-slate-600 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0 mt-0.5" />
                        <span>{tx(resp, lang)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech Tags */}
                {exp.techTags && exp.techTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {exp.techTags.map((tItem) => (
                      <span
                        key={tItem}
                        className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono bg-slate-50 text-slate-600 border border-slate-200"
                      >
                        {tItem}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Skills & Stack (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            <span>{t.experience.coreStack}</span>
          </h3>

          <div className="p-6 sm:p-7 portfolio-card space-y-6">
            {site.about.skills.map((group, gi) => (
              <div key={gi} className={`space-y-2.5 ${gi > 0 ? 'pt-4 border-t border-slate-100' : ''}`}>
                <span className={`text-xs font-mono font-bold block ${['text-slate-900', 'text-purple-700', 'text-lime-700'][gi % 3]}`}>
                  // {tx(group.category, lang)}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-xl text-xs font-mono bg-slate-50 text-slate-800 border border-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Education Capsule */}
          <div className="p-6 portfolio-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {site.about.education[0] ? `${tx(site.about.education[0].school, lang)} ${tx(site.about.education[0].department, lang)}` : t.experience.educationTitle}
              </h4>
              <span className="text-xs font-mono text-slate-500">
                {site.about.education[0]?.period || t.experience.educationDesc}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
