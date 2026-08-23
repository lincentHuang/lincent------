'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ProjectItem } from '../../../store/atoms';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer';
import {
  ArrowLeft,
  ExternalLink,
  Code2,
  Calendar,
  Building,
  User,
  Sparkles,
  Zap,
  Target,
  Lightbulb,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Send,
  Boxes,
} from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<ProjectItem | null>(null);
  const [allProjects, setAllProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjectData() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.success && data.projects) {
          setAllProjects(data.projects);
          const found = data.projects.find((p: ProjectItem) => p.id === projectId);
          if (found) {
            setProject(found);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProjectData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090C] text-white flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-framer-cyan animate-spin" />
          <span>正在載入專案資料...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#08090C] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-2xl font-display font-black">找不到此作品資料</h1>
        <p className="text-xs text-framer-subtext">專案 ID: {projectId} 可能已移除或不存在。</p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-white text-slate-950 text-xs font-bold font-display"
        >
          ← 返回首頁作品集
        </Link>
      </div>
    );
  }

  // Find Prev and Next Project
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#08090C] text-white selection:bg-framer-cyan selection:text-slate-950 pb-20">
      {/* Background Dots */}
      <div className="fixed inset-0 bg-framer-dots pointer-events-none z-0 opacity-40" />

      {/* Top Sticky Navigation */}
      <header className="sticky top-0 z-30 w-full px-4 sm:px-8 py-4 backdrop-blur-xl bg-[#08090C]/80 border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white framer-glass px-3.5 py-1.5 rounded-full border border-white/[0.08] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-framer-cyan" />
            <span>返回作品集首頁</span>
          </Link>

          <div className="flex items-center gap-2">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-950 hover:bg-slate-200 transition-all font-display"
              >
                <span>線上體驗 (Live)</span>
                <ExternalLink className="w-3 h-3 text-framer-violet" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 space-y-10 relative z-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-mono text-framer-subtext">
          <Link href="/" className="hover:text-white transition-colors">作品集首頁</Link>
          <span>/</span>
          <span className="text-framer-cyan">{project.category}</span>
          <span>/</span>
          <span className="text-white truncate max-w-[200px]">{project.title}</span>
        </div>

        {/* Project Cover Banner (If present) */}
        {project.coverImage && (
          <div className="rounded-3xl overflow-hidden framer-glass border border-white/[0.12] shadow-framer-card relative group max-h-[440px]">
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover object-center max-h-[440px] transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                {project.badge || '✨ 亮點專案'}
              </span>
              <span className="text-xs font-mono text-slate-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                {project.year}
              </span>
            </div>
          </div>
        )}

        {/* Project Header Info */}
        <div className="space-y-4 border-b border-white/[0.08] pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-framer-amber/10 text-amber-300 border border-framer-amber/30">
              {project.tag}
            </span>
            <span className="text-xs font-mono text-framer-subtext">
              {project.company} • {project.year}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-3xl">
            {project.subtitle}
          </p>

          {/* Quick Metrics Bar */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-4">
              {project.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="px-5 py-3 rounded-2xl framer-glass border border-white/[0.08]"
                >
                  <span className="text-[11px] font-mono text-framer-subtext block">{m.label}</span>
                  <span className="text-lg font-display font-black text-framer-cyan">{m.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Two Columns: Content (8 Cols) + Sidebar (4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Markdown Article (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Rich Markdown Body */}
            <div className="p-6 sm:p-8 rounded-3xl framer-glass shadow-framer-card border border-white/[0.08]">
              <MarkdownRenderer content={project.contentMd || project.summary} />
            </div>

            {/* Pain Points Solved */}
            {project.painPoints && project.painPoints.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-display font-black text-rose-400 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <span>核心解決痛點 (Pain Points Solved)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {project.painPoints.map((pt, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 leading-relaxed font-sans"
                    >
                      {pt}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Animation & Micro-interactions */}
            {project.aiHighlights?.animationHighlights && (
              <div className="space-y-4">
                <h3 className="text-lg font-display font-black text-framer-amber flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span>動畫調校與微互動亮點</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {project.aiHighlights.animationHighlights.map((ani, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-xs text-slate-200 leading-relaxed font-sans"
                    >
                      {ani}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Meta Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            {/* Project Specs */}
            <div className="p-6 rounded-3xl framer-glass shadow-framer-card border border-white/[0.08] space-y-4">
              <h3 className="font-display font-black text-sm text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-framer-cyan" />
                <span>專案規格與資訊</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-framer-subtext">所屬企業</span>
                  <strong className="text-white">{project.company}</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-framer-subtext">執行期間</span>
                  <span className="font-mono text-white">{project.year}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-framer-subtext">職務角色</span>
                  <span className="text-framer-cyan font-bold">{project.role}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-framer-subtext">專案分類</span>
                  <span className="text-white">{project.category}</span>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono text-framer-subtext block">核心技術棧</span>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/[0.04] text-slate-200 border border-white/[0.08]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Pitch Quote */}
            {project.aiHighlights?.clientPitch && (
              <div className="p-6 rounded-3xl bg-gradient-to-tr from-framer-violet/20 via-framer-cyan/10 to-transparent border border-white/[0.12] space-y-3">
                <div className="flex items-center gap-2 text-framer-cyan text-xs font-bold uppercase font-display">
                  <MessageSquare className="w-4 h-4" />
                  <span>AI 客戶推介講稿</span>
                </div>
                <p className="text-xs text-slate-200 font-serif italic leading-relaxed">
                  "{project.aiHighlights.clientPitch}"
                </p>
              </div>
            )}

            {/* Quick Contact CTA */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] text-center space-y-3">
              <h4 className="text-sm font-display font-black text-white">想深入了解或合作？</h4>
              <p className="text-xs text-framer-subtext">歡迎發送面試或專案邀請，24 小時內回覆！</p>
              <Link
                href="/#inquiry-section"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-framer-cyan to-framer-violet text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 font-display shadow-framer-glow-cyan"
              >
                <Send className="w-3.5 h-3.5" />
                <span>發送合作邀請 →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Prev / Next Navigation */}
        <div className="pt-12 border-t border-white/[0.08] flex items-center justify-between gap-4">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.id}`}
              className="flex items-center gap-3 p-4 rounded-2xl framer-glass hover:bg-white/[0.08] text-left transition-all max-w-[280px]"
            >
              <ChevronLeft className="w-5 h-5 text-framer-cyan shrink-0" />
              <div>
                <span className="text-[10px] font-mono text-framer-subtext block">← 上一個專案</span>
                <span className="text-xs font-bold text-white truncate block">{prevProject.title}</span>
              </div>
            </Link>
          ) : <div />}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.id}`}
              className="flex items-center gap-3 p-4 rounded-2xl framer-glass hover:bg-white/[0.08] text-right transition-all max-w-[280px]"
            >
              <div>
                <span className="text-[10px] font-mono text-framer-subtext block">下一個專案 →</span>
                <span className="text-xs font-bold text-white truncate block">{nextProject.title}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-framer-cyan shrink-0" />
            </Link>
          ) : <div />}
        </div>
      </main>
    </div>
  );
}
