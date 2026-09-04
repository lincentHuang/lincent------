'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { langAtom } from '../../../store/atoms';
import { CheckCircle2, GraduationCap } from 'lucide-react';
import { resumeData } from '../../../data/resumeData';

export const ResumeSection: React.FC = () => {
  const [lang] = useAtom(langAtom);

  return (
    <section id="experience" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="space-y-3 mb-12">
        <div className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs">
          {lang === 'en' ? 'Experience' : '經歷與技能'}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-slate-900">
          {lang === 'en' ? 'Career journey & expertise' : '專業經歷與深厚技術積累'}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
          {lang === 'en'
            ? '5+ years of full lifecycle frontend engineering, architecture design, and performance tuning.'
            : '擁有 5+ 年大中型產品研發實戰，具備從需求分析、架構選型到效能調優的完整落地經驗。'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Work Experience Timeline (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-600" />
            <span>{lang === 'en' ? 'Work History' : '工作經歷'}</span>
          </h3>

          <div className="space-y-4">
            {resumeData.experiences.map((exp, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 portfolio-card space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900">
                      {exp.role}
                    </h4>
                    <span className="text-xs font-mono text-lime-600 font-semibold">
                      {exp.company}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 self-start sm:self-auto">
                    {exp.period}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {exp.summary}
                </p>

                {/* Key Responsibilities */}
                {exp.keyResponsibilities && exp.keyResponsibilities.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    {exp.keyResponsibilities.map((resp, rIdx) => (
                      <div
                        key={rIdx}
                        className="text-xs text-slate-600 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0 mt-0.5" />
                        <span>{resp}</span>
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
            <span>{lang === 'en' ? 'Core Capabilities' : '核心技術棧'}</span>
          </h3>

          <div className="p-6 sm:p-7 portfolio-card space-y-6">
            <div className="space-y-2.5">
              <span className="text-xs font-mono text-slate-900 font-bold block">
                // FRONTEND & ARCHITECTURE
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'React 18',
                  'Next.js 14 (App Router)',
                  'TypeScript',
                  'Jotai',
                  'Tailwind CSS',
                  'Turborepo (Monorepo)',
                  'Radix UI',
                  'Framer Motion',
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-xl text-xs font-mono bg-slate-50 text-slate-800 border border-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <span className="text-xs font-mono text-purple-700 font-bold block">
                // BACKEND & DATABASE
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Node.js',
                  'PostgreSQL',
                  'Supabase',
                  'Prisma ORM',
                  'RESTful API',
                  'GraphQL',
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-xl text-xs font-mono bg-slate-50 text-slate-800 border border-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <span className="text-xs font-mono text-lime-700 font-bold block">
                // PERFORMANCE & TOOLS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Core Web Vitals',
                  'SEO Optimization',
                  'WebP Image Pipeline',
                  'Git / GitHub Actions',
                  'Figma to Code',
                  'Storybook',
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-xl text-xs font-mono bg-slate-50 text-slate-800 border border-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Education Capsule */}
          <div className="p-6 portfolio-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {lang === 'en' ? 'Computer Science & Design Craft' : '設計與資工跨界整合'}
              </h4>
              <span className="text-xs font-mono text-slate-500">
                {lang === 'en' ? 'Balancing engineering rigor with aesthetic excellence' : '追求工程嚴謹度與美感極致平衡'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
