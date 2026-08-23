'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { projectsAtom, selectedProjectAtom, isGeneratingAIAtom, ProjectItem } from '../store/atoms';
import {
  Sparkles,
  Target,
  Image as ImageIcon,
  Zap,
  Lightbulb,
  MessageSquare,
  CheckCircle2,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';

export const AIDeepDiveShowcase: React.FC = () => {
  const [projects] = useAtom(projectsAtom);
  const [selectedProject, setSelectedProject] = useAtom(selectedProjectAtom);
  const [isGenerating, setIsGenerating] = useAtom(isGeneratingAIAtom);
  const [activeTab, setActiveTab] = useState<'highlights' | 'visuals' | 'animation' | 'scenarios' | 'pitch'>('highlights');

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
    { id: 'highlights', label: '🎯 核心亮點與痛點', icon: Target },
    { id: 'visuals', label: '📸 介面與架構展示', icon: ImageIcon },
    { id: 'animation', label: '✨ 動畫與微互動', icon: Zap },
    { id: 'scenarios', label: '💡 使用情境與價值', icon: Lightbulb },
    { id: 'pitch', label: '🗣️ 客戶推介講稿', icon: MessageSquare },
  ] as const;

  return (
    <section id="ai-deep-dive" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-framer-cyan mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI PROJECT PRESENTATION ENGINE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white">
            AI 作品深度剖析 & 客戶展示體驗
          </h2>
          <p className="text-framer-subtext text-sm mt-1">
            由 AI 智慧模組為您自動梳理專案核心痛點、技術實作、動畫細節與商業成效。
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          {currentProject?.id && (
            <Link
              href={`/projects/${currentProject.id}`}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-bold border border-white/[0.12] transition-all font-display"
            >
              <span>查看專案獨立分頁</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-framer-cyan" />
            </Link>
          )}

          <button
            onClick={handleRegenerateAI}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-framer-cyan via-framer-violet to-framer-amber text-slate-950 text-xs font-bold shadow-framer-glow-cyan active:scale-95 transition-all font-display"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'AI 正在提煉亮點...' : '✨ AI 重新提煉此專案'}</span>
          </button>
        </div>
      </div>

      {/* Project Selector Pills Bar */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {projects.map((proj) => {
          const isSelected = (selectedProject?.id || projects[0]?.id) === proj.id;
          return (
            <button
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className={`px-4 py-2 rounded-2xl text-xs font-display font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-white text-slate-950 shadow-framer-glow-cyan'
                  : 'framer-glass text-slate-300 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <span>{proj.title.split(' ')[0]}</span>
              {proj.badge && (
                <span className="text-[10px] opacity-80">{proj.badge.split(' ')[0]}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main AI Deep Dive Card */}
      {currentProject && currentProject.aiHighlights && (
        <div className="p-6 sm:p-10 rounded-3xl framer-glass shadow-framer-card space-y-8">
          {/* Top Project Meta Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-framer-amber/10 text-amber-300 border border-framer-amber/30">
                  {currentProject.tag}
                </span>
                <span className="text-xs font-mono text-framer-subtext">
                  {currentProject.company} • {currentProject.year}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                {currentProject.title}
              </h3>
              <p className="text-sm text-framer-subtext font-medium">
                {currentProject.subtitle}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex gap-3 flex-wrap">
              {currentProject.metrics?.map((m, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
                >
                  <span className="text-[10px] font-mono text-framer-subtext block">{m.label}</span>
                  <span className="text-sm font-display font-black text-framer-cyan">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.08]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-framer-violet' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className="min-h-[220px]">
            {/* Tab 1: Core Highlights & Pain Points */}
            {activeTab === 'highlights' && (
              <div className="space-y-6">
                {currentProject.painPoints && currentProject.painPoints.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-display font-black text-xs uppercase tracking-wider text-rose-400 flex items-center gap-2">
                      <span>【專案核心解決的痛點 (Pain Points Solved)】</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentProject.painPoints.map((point, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 leading-relaxed font-sans"
                        >
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="font-display font-black text-xs uppercase tracking-wider text-framer-cyan flex items-center gap-2">
                    <span>【AI 提煉之技術架構與關鍵突破】</span>
                  </h4>
                  <div className="space-y-2.5">
                    {currentProject.aiHighlights.coreHighlights.map((hl, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-framer-emerald mt-0.5 shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Visual Interface & Architecture Mockup */}
            {activeTab === 'visuals' && (
              <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-[#060709] text-white border border-white/[0.08] space-y-4 overflow-hidden relative">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="font-mono text-xs text-framer-subtext ml-2">
                        {currentProject.id}.workspace // Production Monorepo
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-framer-emerald">
                      LIVE SYSTEM
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-2">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                      <span className="text-xs font-mono font-bold text-framer-amber block">
                        01. Monorepo Architecture
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Turborepo + Yarn Workspaces 整合 4 個 App 與 9 個核心 Package，80+ UI 獨立模組。
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                      <span className="text-xs font-mono font-bold text-framer-violet block">
                        02. Jotai Atomic State
                      </span>
                      <p className="text-[11px] text-slate-400">
                        細粒度反應性原子狀態，搭配 Optics-TS 光學變換，解決大量 DOM 節點變更卡頓。
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                      <span className="text-xs font-mono font-bold text-framer-cyan block">
                        03. AST Codegen & Radix UI
                      </span>
                      <p className="text-[11px] text-slate-400">
                        ts-morph 自動從 CMS 配置與 OpenAPI 規範生成 TypeScript 型別與串接程式碼。
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.06]">
                    {currentProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Animation & Micro-interactions */}
            {activeTab === 'animation' && (
              <div className="space-y-3">
                <h4 className="font-display font-black text-xs uppercase tracking-wider text-framer-amber">
                  【動畫設計、微互動調校與流暢度亮點】
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentProject.aiHighlights.animationHighlights.map((ani, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2"
                    >
                      <div className="w-8 h-8 rounded-xl bg-framer-amber text-slate-950 flex items-center justify-center font-black text-xs shadow-framer-glow-amber">
                        0{idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                        {ani}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Usage Scenarios & Business Impact */}
            {activeTab === 'scenarios' && (
              <div className="space-y-3">
                <h4 className="font-display font-black text-xs uppercase tracking-wider text-framer-emerald">
                  【多維度使用情境與商業賦能 (Persona & Scenarios)】
                </h4>
                <div className="space-y-3">
                  {currentProject.aiHighlights.usageScenarios.map((sc, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-200 leading-relaxed font-sans"
                    >
                      {sc}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: AI Client Pitch */}
            {activeTab === 'pitch' && (
              <div className="p-7 rounded-3xl bg-gradient-to-r from-framer-cyan/10 via-framer-violet/10 to-framer-amber/10 border border-white/[0.12] space-y-4">
                <div className="flex items-center gap-2 text-framer-cyan font-display font-black text-sm uppercase">
                  <MessageSquare className="w-4 h-4" />
                  <span>AI 生成之專屬客戶推介講稿 (Elevator Pitch)</span>
                </div>
                <blockquote className="text-base sm:text-lg text-white font-serif italic leading-relaxed">
                  "{currentProject.aiHighlights.clientPitch}"
                </blockquote>
                <div className="pt-2 flex items-center justify-between text-xs text-framer-subtext">
                  <span>可直接應用於技術分享、客戶提案或面試陳述</span>
                  <span className="font-mono text-framer-cyan font-bold">
                    Lincent Huang • Senior Frontend
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
