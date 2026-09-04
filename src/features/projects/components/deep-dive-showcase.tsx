'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { projectsAtom, selectedProjectAtom, isGeneratingAIAtom, langAtom, uiDict, ProjectItem } from '../../../store/atoms';
import {
  Layers,
  Zap,
  CheckCircle2,
  RefreshCw,
  ArrowUpRight,
  Code2,
  TrendingUp,
} from 'lucide-react';

export const DeepDiveShowcase: React.FC = () => {
  const [projects] = useAtom(projectsAtom);
  const [selectedProject, setSelectedProject] = useAtom(selectedProjectAtom);
  const [isGenerating, setIsGenerating] = useAtom(isGeneratingAIAtom);
  const [lang] = useAtom(langAtom);
  const t = uiDict[lang].deepDive;
  const [activeTab, setActiveTab] = useState<'arch' | 'challenges' | 'motion' | 'impact'>('arch');

  const currentProject: ProjectItem = selectedProject || projects[0] || ({} as ProjectItem);

  const handleRegenerateAI = async () => {
    if (!currentProject.id) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentProject.title,
          description: currentProject.summary,
          techStack: currentProject.techStack,
          category: currentProject.category,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedProject({
          ...currentProject,
          aiHighlights: {
            coreHighlights: data.data.coreHighlights,
            animationHighlights: data.data.animationHighlights,
            usageScenarios: data.data.usageScenarios,
            clientPitch: data.data.clientPitch,
          },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const tabs = [
    { id: 'arch', label: t.tabs.arch, icon: Layers },
    { id: 'challenges', label: t.tabs.challenges, icon: CheckCircle2 },
    { id: 'motion', label: t.tabs.motion, icon: Zap },
    { id: 'impact', label: t.tabs.impact, icon: TrendingUp },
  ] as const;

  const currentTitle = lang === 'en' ? (currentProject?.titleEn || currentProject?.title) : currentProject?.title;
  const currentSubtitle = lang === 'en' ? (currentProject?.subtitleEn || currentProject?.subtitle || currentProject?.summaryEn || currentProject?.summary) : (currentProject?.subtitle || currentProject?.summary);

  return (
    <section id="deep-dive" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-purple-600 tracking-wider uppercase">
            <Code2 className="w-3.5 h-3.5" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-slate-900">
            {t.title}
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl font-sans">
            {t.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          {currentProject?.id && (
            <Link
              href={`/projects/${currentProject.id}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 transition-all shadow-xs"
            >
              <span>{t.viewPage}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-600" />
            </Link>
          )}

          <button
            onClick={handleRegenerateAI}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all hover:bg-black"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? (lang === 'en' ? 'Analyzing...' : '分析中...') : t.aiBtn}</span>
          </button>
        </div>
      </div>

      {/* Project Selector Bar */}
      <div className="flex gap-2.5 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {projects.map((proj) => {
          const isSelected = (selectedProject?.id || projects[0]?.id) === proj.id;
          const pTitle = lang === 'en' ? (proj.titleEn || proj.title) : proj.title;
          return (
            <button
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>{pTitle.split(' ')[0]}</span>
              {proj.badge && (
                <span className="text-[10px] opacity-70 font-mono">{proj.year}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Frame */}
      {currentProject && currentProject.aiHighlights && (
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-portfolio-card space-y-8">
          {/* Top Meta Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                  {lang === 'en' ? (currentProject.categoryEn || currentProject.category) : currentProject.category}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {lang === 'en' ? (currentProject.companyEn || currentProject.company) : currentProject.company} • {currentProject.year}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900">
                {currentTitle}
              </h3>
              <p className="text-sm text-slate-600 font-sans">
                {currentSubtitle}
              </p>
            </div>

            {/* Metrics Chips */}
            <div className="flex gap-3 flex-wrap">
              {currentProject.metrics?.map((m, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <span className="text-[10px] font-mono text-slate-500 block">
                    {lang === 'en' ? (m.labelEn || m.label) : m.label}
                  </span>
                  <span className="text-sm font-sans font-bold text-slate-900">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-600' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Pane */}
          <div className="min-h-[200px]">
            {/* Tab 1: Architecture */}
            {activeTab === 'arch' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(lang === 'en' && currentProject.aiHighlights.coreHighlightsEn && currentProject.aiHighlights.coreHighlightsEn.length > 0
                    ? currentProject.aiHighlights.coreHighlightsEn
                    : currentProject.aiHighlights.coreHighlights
                  ).map((hl, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed flex items-start gap-3.5 font-sans"
                    >
                      <div className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Chips */}
                <div className="pt-4 flex flex-wrap gap-2 border-t border-slate-100">
                  {currentProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Challenges */}
            {activeTab === 'challenges' && (
              <div className="space-y-3">
                {currentProject.painPoints && currentProject.painPoints.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(lang === 'en' && currentProject.painPointsEn && currentProject.painPointsEn.length > 0
                      ? currentProject.painPointsEn
                      : currentProject.painPoints
                    ).map((point, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-rose-50 border border-rose-100 text-xs sm:text-sm text-rose-900 leading-relaxed font-sans"
                      >
                        <strong className="block text-rose-700 font-sans font-bold text-xs mb-1">
                          {lang === 'en' ? `Challenge 0${idx + 1}` : `痛點突破 0${idx + 1}`}
                        </strong>
                        {point}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No recorded pain points.</p>
                )}
              </div>
            )}

            {/* Tab 3: Motion */}
            {activeTab === 'motion' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(lang === 'en' && currentProject.aiHighlights.animationHighlightsEn && currentProject.aiHighlights.animationHighlightsEn.length > 0
                  ? currentProject.aiHighlights.animationHighlightsEn
                  : currentProject.aiHighlights.animationHighlights
                ).map((ani, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-mono font-bold text-xs">
                      0{idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                      {ani}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Impact & Client Pitch */}
            {activeTab === 'impact' && (
              <div className="p-7 rounded-3xl bg-gradient-to-r from-cyan-50 via-purple-50 to-slate-50 border border-slate-200 space-y-4">
                <span className="font-mono text-xs text-cyan-800 uppercase tracking-wider block">
                  // BUSINESS VALUE & ELEVATOR PITCH
                </span>
                <blockquote className="text-base sm:text-lg text-slate-800 font-serif italic leading-relaxed">
                  "{lang === 'en' && currentProject.aiHighlights.clientPitchEn ? currentProject.aiHighlights.clientPitchEn : currentProject.aiHighlights.clientPitch}"
                </blockquote>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
