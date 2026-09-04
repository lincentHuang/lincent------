'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ProjectItem,
  InquiryItem,
  SiteConfig,
  ModularCard,
} from '../../../types';
import { MarkdownRenderer } from '../../projects/components/markdown-renderer';
import {
  Lock,
  Plus,
  Trash2,
  Edit3,
  Save,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowUpRight,
  UploadCloud,
  FileImage,
  RefreshCw,
  Eye,
  MessageSquare,
  Globe,
  Settings,
  FolderPlus,
  ArrowLeft,
  Image,
  Code,
  List,
  Quote,
  Bold,
  Heading2,
  Heading3,
  Copy,
  Check,
  Building2,
  Clock,
  Briefcase,
  ExternalLink,
  Target,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Main Sidebar Navigation Tabs: 'config' | 'cards' | 'projects' | 'inquiries'
  const [activeTab, setActiveTab] = useState<'config' | 'cards' | 'projects' | 'inquiries'>('projects');

  // Data States
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [modularCards, setModularCards] = useState<ModularCard[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [aiTranslating, setAiTranslating] = useState(false);

  // Full-Page Project Editing View
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isProjectEditorOpen, setIsProjectEditorOpen] = useState(false);
  const [editorLangTab, setEditorLangTab] = useState<'zh' | 'en' | 'split'>('zh');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadStats, setUploadStats] = useState<{ origSize: number; newSize: number } | null>(null);
  const [uploadedGallery, setUploadedGallery] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [painPointInput, setPainPointInput] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Card Editing Modal
  const [editingCard, setEditingCard] = useState<ModularCard | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const markdownTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-login check
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch all CMS data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [projRes, inqRes, configRes, cardsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/inquiries'),
        fetch('/api/config'),
        fetch('/api/cards'),
      ]);
      const projData = await projRes.json();
      const inqData = await inqRes.json();
      const configData = await configRes.json();
      const cardsData = await cardsRes.json();

      if (projData.success) setProjects(projData.projects || []);
      if (inqData.success) setInquiries(inqData.inquiries || []);
      if (configData.success) setSiteConfig(configData.config);
      if (cardsData.success) setModularCards(cardsData.cards || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'qwe123qwe') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setErrorMsg('');
    } else {
      setErrorMsg('密碼錯誤，請重新輸入。');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  };

  const triggerSaveNotification = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // ==========================================
  // 📢 SITE CONFIG SAVE & AI TRANSLATE
  // ==========================================
  const handleSaveConfig = async () => {
    if (!siteConfig) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteConfig),
      });
      const data = await res.json();
      if (data.success) {
        setSiteConfig(data.config);
        triggerSaveNotification();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAITranslateConfig = async () => {
    if (!siteConfig) return;
    setAiTranslating(true);
    try {
      const res = await fetch('/api/ai-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            heroSubtitle: siteConfig.heroSubtitleZh,
            bio: siteConfig.bioZh,
            statusTag: siteConfig.statusTagZh,
            location: siteConfig.locationZh,
          },
          from: 'zh',
          to: 'en',
        }),
      });
      const data = await res.json();
      if (data.success && data.translatedFields) {
        setSiteConfig({
          ...siteConfig,
          heroSubtitleEn: data.translatedFields.heroSubtitle || siteConfig.heroSubtitleEn,
          bioEn: data.translatedFields.bio || siteConfig.bioEn,
          statusTagEn: data.translatedFields.statusTag || siteConfig.statusTagEn,
          locationEn: data.translatedFields.location || siteConfig.locationEn,
        });
        triggerSaveNotification();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiTranslating(false);
    }
  };

  // ==========================================
  // 📁 PROJECT ACTIONS (FULL PAGE EDITOR)
  // ==========================================

  // Load all uploaded images from server (persists across refresh)
  const loadUploadedGallery = async () => {
    try {
      const res = await fetch('/api/upload');
      const data = await res.json();
      if (data.success && Array.isArray(data.urls)) {
        setUploadedGallery(data.urls);
      }
    } catch (err) {
      console.error('Failed to load gallery', err);
    }
  };

  const openNewProjectEditor = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: '',
      titleEn: '',
      subtitle: '',
      subtitleEn: '',
      summary: '',
      summaryEn: '',
      company: 'Lincent Studio',
      companyEn: 'Lincent Studio',
      year: `${new Date().getFullYear()}`,
      role: 'Senior Frontend Architect',
      roleEn: 'Senior Frontend Architect',
      category: 'Frontend Architecture',
      categoryEn: 'Frontend Architecture',
      tag: 'Featured',
      coverImage: '',
      demoUrl: '',
      techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS'],
      painPoints: [],
      metrics: [{ label: 'Performance', value: '99%' }],
      contentMd: '## 專案背景與痛點\n\n請簡述專案目標與解決的問題...\n\n## 核心技術突破與架構設計\n\n- 採用 Next.js 14 與 TypeScript\n- 建立 Design System 元件庫\n\n## 實質商業與團隊價值\n\n提升團隊 100% 交付效率。',
      contentMdEn: '## Project Overview & Background\n\nDescribe the goals and key architecture here...\n\n## Core Architecture & Engineering Highlights\n\n- Built with Next.js 14 and TypeScript\n- Modular Design System architecture\n\n## Business & Engineering Impact\n\nDelivered sub-second performance and seamless UX.',
      themeColor: 'purple',
      isNew: true,
      aiHighlights: {
        coreHighlights: [],
        animationHighlights: [],
        usageScenarios: [],
        clientPitch: '',
      },
    };
    setEditingProject(newProj);
    setIsProjectEditorOpen(true);
    loadUploadedGallery();
  };

  const openEditProject = (proj: ProjectItem) => {
    setEditingProject({ ...proj });
    setIsProjectEditorOpen(true);
    loadUploadedGallery();
  };

  const handleSaveProject = async () => {
    if (!editingProject || !editingProject.title) {
      alert('請填寫專案標題！');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      });
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
        setIsProjectEditorOpen(false);
        setEditingProject(null);
        triggerSaveNotification();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('確定要刪除這筆專案資料嗎？')) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
        triggerSaveNotification();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload Cover Image
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setEditingProject({ ...editingProject, coverImage: data.url });
        setUploadStats({ origSize: data.originalSize, newSize: data.optimizedSize });
        if (!uploadedGallery.includes(data.url)) {
          setUploadedGallery((prev) => [data.url, ...prev]);
        }
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Upload Multi-Images to Gallery
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          newUrls.push(data.url);
        }
      }
      setUploadedGallery((prev) => [...newUrls, ...prev]);
    } catch (err) {
      console.error('Gallery upload failed', err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Insert image markdown into textarea
  const insertImageToMarkdown = (url: string) => {
    if (!editingProject) return;
    const imgMarkdown = `\n![](${url})\n`;
    const targetField = editorLangTab === 'en' ? 'contentMdEn' : 'contentMd';
    const currentVal = editingProject[targetField] || '';
    setEditingProject({
      ...editingProject,
      [targetField]: currentVal + imgMarkdown,
    });
  };

  // Copy Image URL helper
  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Insert markdown snippet
  const insertMarkdownSnippet = (snippet: string) => {
    if (!editingProject) return;
    const targetField = editorLangTab === 'en' ? 'contentMdEn' : 'contentMd';
    const currentVal = editingProject[targetField] || '';
    setEditingProject({
      ...editingProject,
      [targetField]: currentVal + snippet,
    });
  };

  // AI Translate Project Data
  const handleAITranslateProject = async () => {
    if (!editingProject) return;
    setAiTranslating(true);
    try {
      const res = await fetch('/api/ai-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            title: editingProject.title,
            subtitle: editingProject.subtitle,
            summary: editingProject.summary,
            company: editingProject.company,
            role: editingProject.role,
            category: editingProject.category,
            contentMd: editingProject.contentMd,
          },
          from: 'zh',
          to: 'en',
        }),
      });
      const data = await res.json();
      if (data.success && data.translatedFields) {
        setEditingProject({
          ...editingProject,
          titleEn: data.translatedFields.title || editingProject.titleEn,
          subtitleEn: data.translatedFields.subtitle || editingProject.subtitleEn,
          summaryEn: data.translatedFields.summary || editingProject.summaryEn,
          companyEn: data.translatedFields.company || editingProject.companyEn,
          roleEn: data.translatedFields.role || editingProject.roleEn,
          categoryEn: data.translatedFields.category || editingProject.categoryEn,
          contentMdEn: data.translatedFields.contentMd || editingProject.contentMdEn,
        });
        triggerSaveNotification();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiTranslating(false);
    }
  };

  // ==========================================
  // 🧩 BENTO CARDS ACTIONS
  // ==========================================
  const handleSaveCard = async () => {
    if (!editingCard || !editingCard.titleZh) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCard),
      });
      const data = await res.json();
      if (data.success) {
        setModularCards(data.cards);
        setIsCardModalOpen(false);
        setEditingCard(null);
        triggerSaveNotification();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('確定要刪除這張 Bento 卡片嗎？')) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cards?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setModularCards(data.cards);
        triggerSaveNotification();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // 🔒 LOGIN VIEW
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center p-6 text-[#121218] font-sans">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-[32px] bg-white border border-[#E0E2E6] shadow-portfolio-hover space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#121218] text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight">Lincent Studio CMS</h1>
            <p className="text-xs text-slate-500 font-mono">請輸入管理密碼進入後台</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">管理員密碼 (Admin Password)</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="預設密碼: qwe123qwe"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:outline-none focus:border-[#121218] focus:bg-white transition-all shadow-inner"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#121218] text-white font-semibold text-xs hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              進入管理後台 →
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-black transition-colors">
              ← 返回作品集首頁
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 📝 FULL-PAGE PROJECT EDITOR VIEW
  // ==========================================
  if (isProjectEditorOpen && editingProject) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] text-[#121218] font-sans pb-24">
        {/* Fixed Top Bar */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E0E2E6] px-6 sm:px-10 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsProjectEditorOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="返回專案清單"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[11px] font-mono text-slate-400 block uppercase">
                  專案資料管理 / 頁面編輯
                </span>
                <h2 className="text-base sm:text-lg font-bold text-[#121218] truncate max-w-md">
                  {editingProject.title || '新增專案資料'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAITranslateProject}
                disabled={aiTranslating}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-semibold transition-all"
              >
                <Sparkles className={`w-3.5 h-3.5 ${aiTranslating ? 'animate-spin' : ''}`} />
                <span>{aiTranslating ? 'AI 翻譯中...' : '✨ AI 補齊英文'}</span>
              </button>

              <button
                onClick={handleSaveProject}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#121218] text-white hover:bg-black text-xs font-semibold transition-all shadow-sm hover:scale-105 active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isLoading ? '儲存中...' : '儲存專案資料'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Editor Main Body */}
        <main className="max-w-7xl mx-auto px-6 sm:px-10 pt-8 space-y-8">
          {/* Section 1: 專案封面圖與多圖片上傳庫 (Multi-image Uploader) */}
          <div className="rounded-[32px] bg-white border border-[#E0E2E6] p-6 sm:p-8 shadow-portfolio-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#121218] flex items-center gap-2">
                  <Image className="w-4 h-4 text-lime-600" />
                  <span>封面圖與多圖媒體庫 (Images & Assets)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  可上傳封面圖，或一次上傳多張圖片並直接「插入至內文 Markdown」中。
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={galleryInputRef}
                  multiple
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? '壓縮上傳中...' : '+ 上傳多張圖片'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Cover Preview & Uploader (4 Cols) */}
              <div className="md:col-span-4 space-y-3">
                <span className="text-xs font-bold text-slate-700 block">專案主要封面圖 (Cover Image)</span>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-[24px] border-2 border-dashed border-slate-300 hover:border-[#121218] p-4 text-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all h-48 flex flex-col items-center justify-center relative overflow-hidden"
                >
                  {editingProject.coverImage ? (
                    <img
                      src={editingProject.coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="space-y-1.5 text-slate-400">
                      <UploadCloud className="w-8 h-8 mx-auto text-slate-400" />
                      <span className="text-xs font-medium block">點擊上傳封面圖 (自動 WebP 壓縮)</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </div>
                {uploadStats && (
                  <p className="text-[11px] font-mono text-emerald-600 text-center">
                    ✓ 體積壓縮 {(uploadStats.origSize / 1024).toFixed(0)}KB ➔ {(uploadStats.newSize / 1024).toFixed(0)}KB
                  </p>
                )}
              </div>

              {/* Uploaded Gallery Grid (8 Cols) */}
              <div className="md:col-span-8 space-y-3">
                <span className="text-xs font-bold text-slate-700 block">已上傳圖片庫 (點擊直接插入內文)</span>
                {uploadedGallery.length === 0 ? (
                  <div className="p-8 rounded-[24px] bg-slate-50 border border-slate-200 text-center text-xs text-slate-400 h-48 flex items-center justify-center">
                    尚未上傳額外插圖，點擊右上角「+ 上傳多張圖片」即可開始加入！
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1">
                    {uploadedGallery.map((url, idx) => (
                      <div
                        key={idx}
                        className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-24"
                      >
                        <img src={url} alt="asset" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                          <button
                            type="button"
                            onClick={() => insertImageToMarkdown(url)}
                            className="px-2 py-1 rounded-md bg-white text-black text-[10px] font-bold shadow hover:bg-slate-100 w-full text-center"
                          >
                            + 插入內文
                          </button>
                          <button
                            type="button"
                            onClick={() => copyImageUrl(url)}
                            className="px-2 py-1 rounded-md bg-slate-800 text-white text-[10px] shadow hover:bg-black w-full text-center"
                          >
                            {copiedUrl === url ? '✓ 已複製' : '複製網址'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: 基礎資訊 (Bilingual Basic Info) */}
          <div className="rounded-[32px] bg-white border border-[#E0E2E6] p-6 sm:p-8 shadow-portfolio-card space-y-6">
            <h3 className="text-base font-bold text-[#121218] border-b border-slate-100 pb-3">
              基本專案屬性 (Project Attributes)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Chinese Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">專案名稱 (中文) *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218] transition-all"
                />
              </div>

              {/* English Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">專案名稱 (English Title)</label>
                <input
                  type="text"
                  value={editingProject.titleEn || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, titleEn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218] transition-all"
                />
              </div>

              {/* Category & Tag */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">專案分類 (Category)</label>
                <input
                  type="text"
                  value={editingProject.category}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  placeholder="例：Frontend Architecture"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">徽章標籤 (Badge Tag)</label>
                <input
                  type="text"
                  value={editingProject.tag || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, tag: e.target.value })}
                  placeholder="例：Featured, Top rated"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218] transition-all"
                />
              </div>

              {/* Company & Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">所屬機構 (Company)</label>
                <input
                  type="text"
                  value={editingProject.company}
                  onChange={(e) => setEditingProject({ ...editingProject, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">執行期間 (Year / Timeline)</label>
                <input
                  type="text"
                  value={editingProject.year}
                  onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                  placeholder="例：2025/1 - 2026/8"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218] transition-all"
                />
              </div>

              {/* Role & Demo URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">職務角色 (Role)</label>
                <input
                  type="text"
                  value={editingProject.role}
                  onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">線上體驗連結 (Live Demo URL)</label>
                <input
                  type="text"
                  value={editingProject.demoUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218] transition-all"
                />
              </div>
            </div>

            {/* Summaries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">專案摘要 (中文 Summary)</label>
                <textarea
                  rows={3}
                  value={editingProject.summary}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218] transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">專案摘要 (English Summary)</label>
                <textarea
                  rows={3}
                  value={editingProject.summaryEn || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, summaryEn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218] transition-all resize-none"
                />
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 block">技術標籤管理 (Tech Stack)</label>
              <div className="flex flex-wrap gap-2 items-center">
                {editingProject.techStack.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1.5"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject({
                          ...editingProject,
                          techStack: editingProject.techStack.filter((_, i) => i !== idx),
                        });
                      }}
                      className="text-slate-400 hover:text-rose-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && tagInput.trim()) {
                        e.preventDefault();
                        if (!editingProject.techStack.includes(tagInput.trim())) {
                          setEditingProject({
                            ...editingProject,
                            techStack: [...editingProject.techStack, tagInput.trim()],
                          });
                        }
                        setTagInput('');
                      }
                    }}
                    placeholder="+ 輸入後按 Enter 新增"
                    className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218] w-40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: 直覺式 Markdown 編輯器與即時雙欄預覽 (Rich Markdown Editor & Live Preview) */}
          <div className="rounded-[32px] bg-white border border-[#E0E2E6] p-6 sm:p-8 shadow-portfolio-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#121218] flex items-center gap-2">
                  <Code className="w-4 h-4 text-lime-600" />
                  <span>深度架構文章 Markdown 編輯系統 (Rich Editor)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  左側輸入 Markdown 與插入圖片，右側即時享受 即時排版渲染預覽。
                </p>
              </div>

              {/* Lang Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditorLangTab('zh')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${editorLangTab === 'zh' ? 'bg-white text-black shadow-sm' : 'text-slate-600'
                    }`}
                >
                  繁中內文
                </button>
                <button
                  type="button"
                  onClick={() => setEditorLangTab('en')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${editorLangTab === 'en' ? 'bg-white text-black shadow-sm' : 'text-slate-600'
                    }`}
                >
                  英文內文
                </button>
              </div>
            </div>

            {/* Markdown Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <button
                type="button"
                onClick={() => insertMarkdownSnippet('## 標題名稱\n')}
                className="p-2 rounded-lg hover:bg-white hover:shadow-sm font-bold flex items-center gap-1"
                title="插入二級標題"
              >
                <Heading2 className="w-3.5 h-3.5" />
                <span>H2</span>
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownSnippet('### 次標題\n')}
                className="p-2 rounded-lg hover:bg-white hover:shadow-sm font-bold flex items-center gap-1"
                title="插入三級標題"
              >
                <Heading3 className="w-3.5 h-3.5" />
                <span>H3</span>
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownSnippet('**粗體文字**')}
                className="p-2 rounded-lg hover:bg-white hover:shadow-sm"
                title="粗體"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownSnippet('- 清單項目\n')}
                className="p-2 rounded-lg hover:bg-white hover:shadow-sm"
                title="無序清單"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownSnippet('> 引言備註內容\n')}
                className="p-2 rounded-lg hover:bg-white hover:shadow-sm"
                title="引言"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownSnippet('```typescript\n// 範例代碼\nconst x = 1;\n```\n')}
                className="p-2 rounded-lg hover:bg-white hover:shadow-sm font-mono text-[11px]"
                title="代碼塊"
              >
                &lt;/&gt; Code
              </button>
            </div>

            {/* Side-by-side Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* Left Textarea */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-slate-500 block">
                  // MARKDOWN SOURCE ({editorLangTab.toUpperCase()})
                </span>
                <textarea
                  ref={markdownTextareaRef}
                  rows={20}
                  value={
                    editorLangTab === 'en'
                      ? editingProject.contentMdEn || ''
                      : editingProject.contentMd || ''
                  }
                  onChange={(e) => {
                    const targetField = editorLangTab === 'en' ? 'contentMdEn' : 'contentMd';
                    setEditingProject({ ...editingProject, [targetField]: e.target.value });
                  }}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-[#121218] leading-relaxed focus:bg-white focus:border-[#121218] transition-all resize-none shadow-inner"
                  placeholder="在此輸入 Markdown 內容..."
                />
              </div>

              {/* Right Live Preview */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-lime-600 block">
                  // LIVE PREVIEW (即時渲染)
                </span>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 h-[380px] overflow-y-auto shadow-inner">
                  <MarkdownRenderer
                    content={
                      editorLangTab === 'en'
                        ? editingProject.contentMdEn || ''
                        : editingProject.contentMd || ''
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: 核心痛點管理 (Pain Points) */}
          <div className="rounded-[32px] bg-white border border-[#E0E2E6] p-6 sm:p-8 shadow-portfolio-card space-y-4">
            <h3 className="text-base font-bold text-[#121218] border-b border-slate-100 pb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-lime-600" />
              <span>核心解決痛點卡片 (Challenges Solved)</span>
            </h3>

            <div className="space-y-3">
              {(editingProject.painPoints || []).map((pt, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] font-bold text-lime-600 bg-lime-50 px-2 py-0.5 rounded">
                      CHALLENGE 0{idx + 1}
                    </span>
                    <p className="text-xs text-slate-800">{pt}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (editingProject.painPoints || []).filter((_, i) => i !== idx);
                      setEditingProject({ ...editingProject, painPoints: updated });
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={painPointInput}
                  onChange={(e) => setPainPointInput(e.target.value)}
                  placeholder="輸入挑戰與解決痛點描述..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (painPointInput.trim()) {
                      setEditingProject({
                        ...editingProject,
                        painPoints: [...(editingProject.painPoints || []), painPointInput.trim()],
                      });
                      setPainPointInput('');
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#121218] text-white text-xs font-semibold hover:bg-black"
                >
                  + 新增痛點
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // 🏢 MAIN ADMIN CMS WITH SIDEBAR
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#121218] font-sans flex">
      {/* Toast Notification */}
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-[#121218] text-white text-xs font-semibold shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-lime-500" />
          <span>設定已成功同步儲存！</span>
        </div>
      )}

      {/* 1. Left Fixed Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E0E2E6] h-screen fixed left-0 top-0 p-6 flex flex-col justify-between z-30 shadow-sm">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-2">
            <img src="/images/lincent-logo.svg" alt="lincent" className="w-7 h-7 object-contain" />
            <div>
              <h1 className="font-bold text-sm text-[#121218]">Lincent Studio</h1>
              <span className="text-[10px] font-mono text-slate-400 block">CMS Management</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${activeTab === 'projects'
                ? 'bg-[#121218] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <div className="flex items-center gap-3">
                <FolderPlus className="w-4 h-4" />
                <span>專案資料</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${activeTab === 'projects' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('config')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${activeTab === 'config'
                ? 'bg-[#121218] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <Settings className="w-4 h-4" />
              <span>全站文案與設定</span>
            </button>

            <button
              onClick={() => setActiveTab('cards')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${activeTab === 'cards'
                ? 'bg-[#121218] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Bento 模組卡片</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${activeTab === 'cards' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                {modularCards.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${activeTab === 'inquiries'
                ? 'bg-[#121218] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>合作收件匣</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${activeTab === 'inquiries' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                {inquiries.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom Controls */}
        <div className="pt-6 border-t border-slate-100 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span>瀏覽前台網站</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>登出後台</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="ml-64 flex-1 p-8 sm:p-12 min-h-screen ">
        <div className=' max-w-[1200px] mx-auto'>
          {/* ========================================== */}
          {/* TAB: 專案資料 (PROJECTS) */}
          {/* ========================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0E2E6]">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold font-sans text-[#121218]">專案資料管理</h2>
                  <p className="text-xs text-slate-500">
                    管理所有旗艦作品與案例，點擊「編輯」可進入全頁面式 Markdown 與多圖編輯系統。
                  </p>
                </div>

                <button
                  onClick={openNewProjectEditor}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#121218] text-white text-xs font-semibold hover:bg-black transition-all shadow-sm hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>新增專案資料</span>
                </button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-[28px] bg-white border border-[#E0E2E6] p-5 shadow-portfolio-card space-y-4 hover:shadow-portfolio-hover transition-all"
                  >
                    {/* Image Cover */}
                    {proj.coverImage && (
                      <div className="rounded-2xl overflow-hidden h-48 bg-slate-100 border border-slate-200">
                        <img
                          src={proj.coverImage}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {proj.category}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{proj.year}</span>
                      </div>

                      <h3 className="text-lg font-bold text-[#121218]">{proj.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {proj.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href={`/projects/${proj.id}`}
                        target="_blank"
                        className="text-xs font-semibold text-slate-500 hover:text-black flex items-center gap-1"
                      >
                        <span>檢視前台頁面</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditProject(proj)}
                          className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>編輯</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="刪除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB: 全站文案與設定 (CONFIG) */}
          {/* ========================================== */}
          {activeTab === 'config' && siteConfig && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0E2E6]">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold font-sans text-[#121218]">全站文案與 Hero 設定</h2>
                  <p className="text-xs text-slate-500">
                    支援繁體中文與英文雙語對照編輯，可一鍵點擊 AI 自動翻譯補齊英文。
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAITranslateConfig}
                    disabled={aiTranslating}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-semibold transition-all"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${aiTranslating ? 'animate-spin' : ''}`} />
                    <span>{aiTranslating ? 'AI 翻譯中...' : '✨ AI 補齊英文'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#121218] text-white hover:bg-black text-xs font-semibold transition-all shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isLoading ? '儲存中...' : '儲存全站設定'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Chinese */}
                <div className="rounded-[28px] bg-white border border-[#E0E2E6] p-6 space-y-4 shadow-portfolio-card">
                  <span className="text-xs font-mono font-bold text-slate-500 block">// 繁體中文版 (zh-TW)</span>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Hero 副標題 (中文)</label>
                    <input
                      type="text"
                      value={siteConfig.heroSubtitleZh}
                      onChange={(e) => setSiteConfig({ ...siteConfig, heroSubtitleZh: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">自我介紹 Bio (中文)</label>
                    <textarea
                      rows={4}
                      value={siteConfig.bioZh}
                      onChange={(e) => setSiteConfig({ ...siteConfig, bioZh: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218] resize-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">狀態標籤 (中文)</label>
                    <input
                      type="text"
                      value={siteConfig.statusTagZh}
                      onChange={(e) => setSiteConfig({ ...siteConfig, statusTagZh: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218]"
                    />
                  </div>
                </div>

                {/* English */}
                <div className="rounded-[28px] bg-white border border-[#E0E2E6] p-6 space-y-4 shadow-portfolio-card">
                  <span className="text-xs font-mono font-bold text-purple-700 block">// 英文版 (English)</span>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Hero Subtitle (EN)</label>
                    <input
                      type="text"
                      value={siteConfig.heroSubtitleEn}
                      onChange={(e) => setSiteConfig({ ...siteConfig, heroSubtitleEn: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Bio Description (EN)</label>
                    <textarea
                      rows={4}
                      value={siteConfig.bioEn}
                      onChange={(e) => setSiteConfig({ ...siteConfig, bioEn: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218] resize-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Status Tag (EN)</label>
                    <input
                      type="text"
                      value={siteConfig.statusTagEn}
                      onChange={(e) => setSiteConfig({ ...siteConfig, statusTagEn: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#121218] focus:bg-white focus:border-[#121218]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB: BENTO 模組卡片 (CARDS) */}
          {/* ========================================== */}
          {activeTab === 'cards' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0E2E6]">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold font-sans text-[#121218]">Bento 模組卡片管理</h2>
                  <p className="text-xs text-slate-500">
                    自訂首頁 Bento 格狀卡片，可新增技能卡、工具模組與指標。
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingCard({
                      id: `card-${Date.now()}`,
                      type: 'skill',
                      titleZh: '',
                      titleEn: '',
                      descZh: '',
                      descEn: '',
                      icon: 'Layout',
                      color: 'emerald',
                      order: modularCards.length,
                      isVisible: true,
                    });
                    setIsCardModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#121218] text-white text-xs font-semibold hover:bg-black transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>新增 Bento 卡片</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {modularCards.map((card) => (
                  <div
                    key={card.id}
                    className="rounded-[28px] bg-white border border-[#E0E2E6] p-6 shadow-portfolio-card space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                        {card.type.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCard({ ...card });
                            setIsCardModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-black"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-[#121218]">{card.titleZh}</h4>
                      <p className="text-xs text-slate-500">{card.descZh}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB: 合作收件匣 (INQUIRIES) */}
          {/* ========================================== */}
          {activeTab === 'inquiries' && (
            <div className="space-y-8">
              <div className="pb-6 border-b border-[#E0E2E6]">
                <h2 className="text-2xl font-bold font-sans text-[#121218]">合作收件匣</h2>
                <p className="text-xs text-slate-500">
                  來自前台 Contact 表單的訪客邀請與面試洽談記錄。
                </p>
              </div>

              <div className="space-y-4">
                {inquiries.length === 0 ? (
                  <div className="p-12 rounded-[28px] bg-white border border-[#E0E2E6] text-center text-xs text-slate-400">
                    目前尚無新的聯絡訊息。
                  </div>
                ) : (
                  inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-6 rounded-[28px] bg-white border border-[#E0E2E6] shadow-portfolio-card space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm text-[#121218]">{inq.name}</span>
                          <span className="text-xs text-slate-500 font-mono">({inq.email})</span>
                          {inq.company && (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] text-slate-700">
                              {inq.company}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          {new Date(inq.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                        {inq.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Bento Card Modal */}
      {isCardModalOpen && editingCard && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-7 rounded-[32px] bg-white border border-[#E0E2E6] shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-[#121218]">編輯 Bento 卡片</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">卡片標題 (中文)</label>
                <input
                  type="text"
                  value={editingCard.titleZh}
                  onChange={(e) => setEditingCard({ ...editingCard, titleZh: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">卡片標題 (English)</label>
                <input
                  type="text"
                  value={editingCard.titleEn || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, titleEn: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">說明內文 (中文)</label>
                <input
                  type="text"
                  value={editingCard.descZh || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, descZh: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">說明內文 (English)</label>
                <input
                  type="text"
                  value={editingCard.descEn || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, descEn: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCardModalOpen(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveCard}
                className="px-5 py-2 rounded-full bg-[#121218] text-white text-xs font-semibold hover:bg-black"
              >
                儲存卡片
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
