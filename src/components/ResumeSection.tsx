'use client';

import React, { useState } from 'react';
import { resumeData } from '../data/resumeData';
import {
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  Calendar,
  Download,
  Code2,
  Palette,
  Cpu,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const ResumeSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'experiences' | 'skills' | 'education'>('experiences');

  return (
    <section id="resume-section" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-framer-cyan mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>AUTHENTIC RESUME & MILESTONES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white">
            黃令成 • 完整履歷與專案成就
          </h2>
          <p className="text-framer-subtext text-sm mt-1 max-w-2xl">
            {resumeData.title} • {resumeData.yearsOfExp}工作經歷 • 新加坡商海宇顧問、重量科技 kryptoGO 實戰經歷
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl framer-glass text-slate-200 border border-white/[0.12] text-xs font-bold shadow-md hover:bg-white/[0.08] transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-framer-cyan" />
            <span>列印 / 匯出履歷 PDF</span>
          </button>
        </div>
      </div>

      {/* Resume Navigation Tabs */}
      <div className="flex gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.08] mb-8 max-w-md">
        <button
          onClick={() => setActiveTab('experiences')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'experiences'
              ? 'bg-white text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-framer-violet" />
          <span>工作經歷時間軸</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'skills'
              ? 'bg-white text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-framer-amber" />
          <span>核心技能矩陣</span>
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'education'
              ? 'bg-white text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-framer-cyan" />
          <span>學歷與背景</span>
        </button>
      </div>

      {/* Tab 1: Work Experience Timeline */}
      {activeTab === 'experiences' && (
        <div className="space-y-6">
          {resumeData.experiences.map((exp, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl framer-glass shadow-framer-card space-y-4 hover:border-white/20 transition-all"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-display font-black text-white">
                      {exp.company}
                    </h3>
                    {exp.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-framer-violet/20 text-indigo-300 border border-framer-violet/30">
                        {exp.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-framer-cyan mt-0.5">
                    {exp.role} • {exp.location}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-framer-subtext">
                  <Calendar className="w-3.5 h-3.5 text-framer-amber" />
                  <span>{exp.period}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] text-slate-300 font-bold">
                    {exp.duration}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {exp.summary}
              </p>

              {/* Key Responsibilities */}
              <div className="space-y-2 pt-2">
                {exp.keyResponsibilities.map((resp, rIdx) => (
                  <div
                    key={rIdx}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-framer-amber mt-2 shrink-0" />
                    <span>{resp}</span>
                  </div>
                ))}
              </div>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {exp.techTags.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Core Skills Matrix */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Frontend Architecture */}
          <div className="p-7 rounded-3xl framer-glass shadow-framer-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-framer-amber/20 text-amber-300 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-white">
                  前端工程與架構核心
                </h3>
                <span className="text-xs text-framer-subtext">Architecture & Performance</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <strong className="text-framer-cyan">⚛️ Frameworks:</strong> React, Next.js (App Router, SSG, ISR), React Native, Expo
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <strong className="text-framer-amber">⚡ 狀態與數據流:</strong> Jotai (原子化狀態), Optics-TS (光學變換), TypeScript
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <strong className="text-framer-violet">📦 Monorepo:</strong> Turborepo, Yarn Workspaces, 模組化 npm packages 管理
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <strong className="text-framer-emerald">🤖 AST 自動化:</strong> ts-morph (從 CMS / OpenAPI 自動生成 TypeScript 型別與串接程式碼)
              </div>
            </div>
          </div>

          {/* Design System & UI/UX */}
          <div className="p-7 rounded-3xl framer-glass shadow-framer-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-framer-violet/20 text-indigo-300 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-white">
                  Design System 與 UI/UX
                </h3>
                <span className="text-xs text-framer-subtext">Design Engineering & a11y</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <strong className="text-framer-cyan">🎨 Design System:</strong> Radix UI (RM Primitives), Storybook, Tailwind CSS
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <strong className="text-framer-amber">✨ 動畫模組:</strong> Framer Motion, Gsap, Lottie, React Native Animation Engine
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <strong className="text-framer-violet">🖌️ 設計工具:</strong> Figma (高保真原型 / Auto Layout / Tokens), Adobe XD, Illustrator
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <strong className="text-framer-emerald">🚀 跨領域思維:</strong> SEO 搜尋引擎優化 (Lighthouse 滿分標準), 5S 流程優化, 商業轉換率
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Education */}
      {activeTab === 'education' && (
        <div className="space-y-6">
          {resumeData.education.map((edu, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-3xl framer-glass shadow-framer-card space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="text-lg font-display font-black text-white">
                    {edu.school} — {edu.department}
                  </h3>
                  <span className="text-xs font-mono text-framer-cyan font-bold">
                    {edu.degree}
                  </span>
                </div>
                <span className="text-xs font-mono text-framer-subtext">{edu.period}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/[0.06]">
                {edu.highlights}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
