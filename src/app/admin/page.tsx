'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAtom } from 'jotai';
import {
  projectsAtom,
  inquiriesAtom,
  selectedProjectAtom,
  ProjectItem,
  InquiryItem,
} from '../../store/atoms';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import {
  LayoutDashboard,
  Inbox,
  PlusCircle,
  FolderKanban,
  Sparkles,
  ArrowLeft,
  Check,
  Trash2,
  Edit,
  ExternalLink,
  Mail,
  Building,
  Calendar,
  Layers,
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
  Send,
  Boxes,
  Lock,
  LogOut,
  KeyRound,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  FileCode2,
  FileText,
} from 'lucide-react';

const ADMIN_PASSWORD = 'qwe123qwe';

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Data Atoms
  const [projects, setProjects] = useAtom(projectsAtom);
  const [inquiries, setInquiries] = useAtom(inquiriesAtom);
  const [, setSelectedProject] = useAtom(selectedProjectAtom);

  const [activeNav, setActiveNav] = useState<'dashboard' | 'studio' | 'inbox' | 'projects'>('dashboard');
  const [inboxFilter, setInboxFilter] = useState<'all' | 'unread' | 'replied' | 'archived'>('all');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState<{
    convertedFormat?: string;
    originalSize?: string;
    optimizedSize?: string;
    compressionRatio?: string;
    filename?: string;
  } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState<'card' | 'markdown'>('card');

  // Form State for Project Studio
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Frontend Architecture');
  const [tag, setTag] = useState('前端架構與效能');
  const [year, setYear] = useState('2026');
  const [role, setRole] = useState('資深前端工程師');
  const [company, setCompany] = useState('Lincent Studio');
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [contentMd, setContentMd] = useState('');
  const [techStackInput, setTechStackInput] = useState('React, Next.js, Jotai, TypeScript, Tailwind CSS');
  const [painPointsInput, setPainPointsInput] = useState('解決大型專案狀態卡頓與跨端程式碼重複開發問題');
  const [demoUrl, setDemoUrl] = useState('https://lincent.design');
  const [badge, setBadge] = useState('🔥 旗艦代表作');
  const [themeColor, setThemeColor] = useState<'yellow' | 'purple' | 'coral' | 'mint' | 'blue'>('yellow');

  // AI Generated fields
  const [coreHighlights, setCoreHighlights] = useState<string[]>([]);
  const [animationHighlights, setAnimationHighlights] = useState<string[]>([]);
  const [usageScenarios, setUsageScenarios] = useState<string[]>([]);
  const [clientPitch, setClientPitch] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check existing session
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('lincent_admin_auth');
      if (stored === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  // Handle Login Verification
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('lincent_admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError(null);
      loadAdminData();
    } else {
      setAuthError('密碼錯誤，請重新輸入！');
      setPasswordInput('');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem('lincent_admin_auth');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Load Data
  const loadAdminData = async () => {
    try {
      const [projRes, inqRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/inquiries'),
      ]);
      const projData = await projRes.json();
      const inqData = await inqRes.json();
      if (projData.success && projData.projects) setProjects(projData.projects);
      if (inqData.success && inqData.inquiries) setInquiries(inqData.inquiries);
    } catch (err) {
      console.error('Failed to load admin data', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  const unreadInquiries = inquiries.filter((inq) => inq.status === 'unread');
  const filteredInquiries =
    inboxFilter === 'all'
      ? inquiries
      : inquiries.filter((inq) => inq.status === inboxFilter);

  // Handle Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // 1. Instant local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCoverImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // 2. Upload to server
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setCoverImage(data.url);
        setUploadStats({
          convertedFormat: data.convertedFormat,
          originalSize: data.originalSize,
          optimizedSize: data.optimizedSize,
          compressionRatio: data.compressionRatio,
          filename: data.filename,
        });
      }
    } catch (err) {
      console.warn('Upload API fallback to DataURL:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Insert markdown helper
  const insertMarkdown = (snippet: string) => {
    setContentMd((prev) => prev + '\n' + snippet);
  };

  // AI Generation trigger
  const handleAIGenerate = async () => {
    if (!title) {
      alert('請先輸入專案標題以利 AI 分析！');
      return;
    }
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: summary || subtitle,
          techStack: techStackInput.split(',').map((s) => s.trim()),
          category,
          role,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCoreHighlights(data.data.coreHighlights);
        setAnimationHighlights(data.data.animationHighlights);
        setUsageScenarios(data.data.usageScenarios);
        setClientPitch(data.data.clientPitch);
        setThemeColor(data.data.themeColor);
        setBadge(data.data.badge);
        if (data.data.contentMd && (!contentMd || contentMd.trim().length === 0)) {
          setContentMd(data.data.contentMd);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Save / Update Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const projectPayload: ProjectItem = {
      id: editingId || `proj-${Date.now()}`,
      title,
      subtitle: subtitle || summary,
      tag: tag || '精選作品',
      category,
      year: year || '2026',
      role: role || '資深前端工程師',
      company: company || '個人專案',
      badge: badge || '✨ 亮點專案',
      themeColor,
      isNew: true,
      summary: summary || subtitle,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      contentMd: contentMd || summary,
      painPoints: painPointsInput.split('\n').filter(Boolean),
      techStack: techStackInput.split(',').map((s) => s.trim()).filter(Boolean),
      aiHighlights: {
        coreHighlights: coreHighlights.length > 0 ? coreHighlights : [summary],
        animationHighlights: animationHighlights.length > 0 ? animationHighlights : ['流暢微互動與物理反饋'],
        usageScenarios: usageScenarios.length > 0 ? usageScenarios : ['適用於各端用戶流暢體驗'],
        clientPitch: clientPitch || `${title} 結合了卓越工程品質與視覺體驗。`,
      },
      metrics: [
        { label: '成效提升', value: '+80%' },
        { label: '滿意度', value: '99%' },
      ],
      demoUrl,
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectPayload),
      });
      const data = await res.json();
      if (data.success && data.projects) {
        setProjects(data.projects);
        setSelectedProject(projectPayload);
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setActiveNav('projects');
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to save project', err);
    }
  };

  // Edit
  const handleEditProject = (proj: ProjectItem) => {
    setEditingId(proj.id);
    setTitle(proj.title);
    setSubtitle(proj.subtitle);
    setCategory(proj.category);
    setTag(proj.tag);
    setYear(proj.year);
    setRole(proj.role);
    setCompany(proj.company);
    setSummary(proj.summary);
    setCoverImage(proj.coverImage || '');
    setContentMd(proj.contentMd || '');
    setTechStackInput(proj.techStack.join(', '));
    setPainPointsInput(proj.painPoints.join('\n'));
    setDemoUrl(proj.demoUrl || '');
    setBadge(proj.badge || '🔥 旗艦代表作');
    setThemeColor(proj.themeColor || 'yellow');
    setCoreHighlights(proj.aiHighlights?.coreHighlights || []);
    setAnimationHighlights(proj.aiHighlights?.animationHighlights || []);
    setUsageScenarios(proj.aiHighlights?.usageScenarios || []);
    setClientPitch(proj.aiHighlights?.clientPitch || '');
    setActiveNav('studio');
  };

  // Delete
  const handleDeleteProject = async (id: string) => {
    if (!confirm('確定要刪除這筆專案嗎？')) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success && data.projects) setProjects(data.projects);
    } catch (err) {
      console.error(err);
    }
  };

  // Update Inquiry Status
  const handleUpdateInquiryStatus = async (id: string, status: 'unread' | 'replied' | 'archived') => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success && data.inquiries) setInquiries(data.inquiries);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id: string) => {
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success && data.inquiries) setInquiries(data.inquiries);
    } catch (err) {
      console.error(err);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#08090C] text-white flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-framer-cyan" />
          <span>驗證系統環境中...</span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 🔒 PASSWORD AUTHENTICATION SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08090C] text-white flex items-center justify-center p-4 relative font-sans">
        {/* Background Gradients & Dots */}
        <div className="fixed inset-0 bg-framer-dots pointer-events-none z-0 opacity-40" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-framer-cyan/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-framer-violet/15 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl framer-glass shadow-framer-card border border-white/[0.12] z-10 space-y-6">
          {/* Top Lock Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-framer-cyan via-framer-violet to-framer-amber p-[1.5px] mx-auto shadow-framer-glow-cyan">
            <div className="w-full h-full bg-[#0E1015] rounded-[13px] flex items-center justify-center text-white">
              <Lock className="w-6 h-6 text-framer-cyan" />
            </div>
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-2xl font-display font-black text-white">
              管理後台安全驗證
            </h1>
            <p className="text-xs text-framer-subtext">
              請輸入管理員授權密碼以進入 Lincent Admin 系統
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>管理員密碼</span>
                <span className="text-[10px] font-mono text-framer-subtext">Admin Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="請輸入後台存取密碼..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.12] text-sm text-white focus:outline-none focus:border-framer-cyan transition-colors pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-framer-subtext hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-framer-cyan via-framer-violet to-framer-amber text-slate-950 font-display font-black text-sm uppercase tracking-wider shadow-framer-glow-cyan hover:opacity-95 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>驗證並進入管理後台</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-framer-subtext hover:text-white transition-colors font-mono"
            >
              ← 返回公開作品集首頁
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 🚀 AUTHENTICATED ADMIN CONSOLE
  // ==========================================
  return (
    <div className="min-h-screen bg-[#08090C] text-white flex flex-col md:flex-row font-sans selection:bg-framer-cyan selection:text-slate-950">
      {/* Background Dots */}
      <div className="fixed inset-0 bg-framer-dots pointer-events-none z-0 opacity-40" />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0B0D13] border-r border-white/[0.08] p-6 flex flex-col justify-between z-10 shrink-0">
        <div className="space-y-8">
          {/* Admin Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-framer-cyan via-framer-violet to-framer-amber p-[1.5px] shadow-framer-glow-cyan">
              <div className="w-full h-full bg-[#0B0D13] rounded-[14px] flex items-center justify-center font-display font-black text-white text-base">
                ⚙️
              </div>
            </div>
            <div>
              <h1 className="font-display font-black text-sm text-white tracking-tight">
                Lincent Admin
              </h1>
              <span className="text-[11px] font-mono text-framer-cyan">
                專屬管理後台系統
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-bold">
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'dashboard'
                  ? 'bg-white/[0.1] text-white shadow-sm border border-white/[0.12]'
                  : 'text-framer-subtext hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-framer-cyan" />
              <span>Dashboard 總覽</span>
            </button>

            <button
              onClick={() => {
                setEditingId(null);
                setActiveNav('studio');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'studio'
                  ? 'bg-white/[0.1] text-white shadow-sm border border-white/[0.12]'
                  : 'text-framer-subtext hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-framer-violet" />
              <span>{editingId ? '編輯專案工作室' : 'AI 發布新作品'}</span>
            </button>

            <button
              onClick={() => setActiveNav('inbox')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'inbox'
                  ? 'bg-white/[0.1] text-white shadow-sm border border-white/[0.12]'
                  : 'text-framer-subtext hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className="w-4 h-4 text-framer-coral" />
                <span>邀請收件匣</span>
              </div>
              {unreadInquiries.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-framer-coral text-white animate-pulse">
                  {unreadInquiries.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveNav('projects')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeNav === 'projects'
                  ? 'bg-white/[0.1] text-white shadow-sm border border-white/[0.12]'
                  : 'text-framer-subtext hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderKanban className="w-4 h-4 text-framer-amber" />
                <span>作品資料庫管理</span>
              </div>
              <span className="text-[11px] font-mono text-framer-subtext">
                {projects.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/[0.08] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-framer-cyan" />
            <span>← 返回公開作品集</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>登出管理後台</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 z-10 overflow-y-auto max-w-7xl">
        {/* Top Greeting Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-framer-subtext uppercase">ADMIN CONSOLE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-framer-emerald" />
              <span className="text-[11px] font-mono text-framer-emerald font-bold">API BACKEND PERSISTED</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white mt-1">
              {activeNav === 'dashboard' && '📊 後台系統數據儀表板'}
              {activeNav === 'studio' && (editingId ? '🛠️ 編輯專案、圖片與 Markdown 內文' : '🚀 AI 智慧作品發布工作室')}
              {activeNav === 'inbox' && '📥 邀請與合作訊息收件匣'}
              {activeNav === 'projects' && '📁 作品資料庫管理中心'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold framer-glass text-white hover:bg-white/[0.08] transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-framer-cyan" />
              <span>在新分頁查看前台</span>
            </Link>
          </div>
        </div>

        {/* 1. VIEW: DASHBOARD OVERVIEW */}
        {activeNav === 'dashboard' && (
          <div className="space-y-8">
            {/* Stat Cards Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-3xl framer-glass shadow-framer-card space-y-2">
                <span className="text-xs font-mono text-framer-subtext">展示作品總數</span>
                <div className="text-3xl font-display font-black text-white">{projects.length}</div>
                <span className="text-[11px] text-framer-cyan flex items-center gap-1 font-mono">
                  <Boxes className="w-3 h-3" /> 各具備獨立分頁
                </span>
              </div>

              <div className="p-6 rounded-3xl framer-glass shadow-framer-card space-y-2">
                <span className="text-xs font-mono text-framer-subtext">待處理邀請訊息</span>
                <div className="text-3xl font-display font-black text-framer-coral">{unreadInquiries.length}</div>
                <span className="text-[11px] text-rose-300 font-mono">
                  總計收到 {inquiries.length} 則邀請
                </span>
              </div>

              <div className="p-6 rounded-3xl framer-glass shadow-framer-card space-y-2">
                <span className="text-xs font-mono text-framer-subtext">Markdown 渲染引擎</span>
                <div className="text-3xl font-display font-black text-framer-violet">Framer Grade</div>
                <span className="text-[11px] text-indigo-300 font-mono">
                  ✨ 自適應暗黑排版
                </span>
              </div>

              <div className="p-6 rounded-3xl framer-glass shadow-framer-card space-y-2">
                <span className="text-xs font-mono text-framer-subtext">圖片儲存目錄</span>
                <div className="text-3xl font-display font-black text-framer-emerald">/public/uploads</div>
                <span className="text-[11px] text-emerald-300 font-mono">
                  支援本機檔案持久化
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Inquiries (7 Cols) */}
              <div className="lg:col-span-7 p-6 rounded-3xl framer-glass shadow-framer-card space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-black text-base text-white flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-framer-coral" />
                    <span>最新收到的邀請訊息</span>
                  </h3>
                  <button
                    onClick={() => setActiveNav('inbox')}
                    className="text-xs text-framer-cyan hover:underline font-bold"
                  >
                    查看全部 ({inquiries.length}) →
                  </button>
                </div>

                {inquiries.slice(0, 3).map((inq) => (
                  <div
                    key={inq.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-white font-bold">{inq.name} ({inq.company || '個人'})</strong>
                      <span className="text-[10px] font-mono text-framer-subtext">
                        {new Date(inq.createdAt).toLocaleDateString('zh-TW')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1">"{inq.message}"</p>
                  </div>
                ))}
              </div>

              {/* Quick Project Publisher Banner (5 Cols) */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-tr from-framer-violet/20 via-framer-cyan/10 to-transparent border border-white/[0.12] space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-framer-violet/30 text-indigo-300 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-display font-black text-white">
                    發布新作品並生成專屬分頁
                  </h3>
                  <p className="text-xs text-framer-subtext leading-relaxed">
                    上傳 Card Banner 封面圖、編寫 Markdown 內容或透過 AI 一鍵生成完整專案分析報告！
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingId(null);
                    setActiveNav('studio');
                  }}
                  className="w-full py-3 rounded-2xl bg-white text-slate-950 font-display font-black text-xs shadow-framer-glow-cyan transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-framer-violet" />
                  <span>進入作品工作室發布 →</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. VIEW: PROJECT STUDIO WITH IMAGE UPLOAD, MARKDOWN & PREVIEW */}
        {activeNav === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column (7 Cols) */}
            <form onSubmit={handleSaveProject} className="lg:col-span-7 space-y-5">
              {saveSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold text-center">
                  ✨ 專案已成功儲存至伺服器，已建立獨立專屬分頁！
                </div>
              )}

              {/* AI Auto-generate Banner */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-framer-cyan/10 via-framer-violet/10 to-framer-amber/10 border border-white/[0.12] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-display font-black text-sm text-framer-cyan flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Framer AI 智慧分析與 Markdown 生成</span>
                  </h4>
                  <p className="text-xs text-framer-subtext mt-0.5">
                    輸入專案名稱後，AI 將自動生成痛點解析、動畫細節與完整 Markdown 報告！
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={isAiGenerating}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-framer-cyan via-framer-violet to-framer-amber text-slate-950 font-bold text-xs shadow-framer-glow-cyan transition-all shrink-0 active:scale-95 font-display"
                >
                  {isAiGenerating ? 'AI 正在提煉中...' : '✨ AI 自動生成亮點與 Markdown'}
                </button>
              </div>

              {/* Basic Info */}
              <div className="p-6 rounded-3xl framer-glass shadow-framer-card space-y-4">
                <h4 className="font-display font-black text-xs uppercase tracking-wider text-framer-cyan">
                  【基本資訊與標籤】
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      專案名稱 (Title) *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="例如：Cms Playground 遊戲平台"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-framer-cyan"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      專案副標題 (Subtitle)
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="例如：大型 Monorepo 架構與 Jotai 狀態管理"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-framer-cyan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      分類 (Category)
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Frontend Architecture"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      卡片標籤 (Tag)
                    </label>
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="架構與系統設計"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      主題色票 (Theme Glow)
                    </label>
                    <select
                      value={themeColor}
                      onChange={(e: any) => setThemeColor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#08090C] border border-white/[0.08] text-xs text-white"
                    >
                      <option value="yellow">電光黃 (Amber)</option>
                      <option value="purple">科技靛藍紫 (Violet)</option>
                      <option value="coral">活力珊瑚紅 (Coral)</option>
                      <option value="mint">清新薄荷綠 (Emerald)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    核心技術棧 (Tech Stack - 逗號分隔)
                  </label>
                  <input
                    type="text"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    placeholder="React, Next.js, Jotai, Turborepo, Tailwind CSS"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    首頁卡片簡介 (Summary)
                  </label>
                  <textarea
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="簡述專案目標與首頁輪播摘要..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white resize-none"
                  />
                </div>
              </div>

              {/* Image Upload Component */}
              <div className="p-6 rounded-3xl framer-glass shadow-framer-card space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-black text-xs uppercase tracking-wider text-framer-amber flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>【專案 Card Banner 封面圖片上傳】</span>
                  </h4>
                  {isUploading && (
                    <span className="text-xs font-mono text-framer-cyan animate-pulse flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> 上傳處理中...
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {/* Dropzone Area */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const droppedFile = e.dataTransfer.files?.[0];
                      if (droppedFile) {
                        const fakeEvent = { target: { files: [droppedFile] } } as any;
                        handleFileUpload(fakeEvent);
                      }
                    }}
                    className="w-full p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border-2 border-dashed border-white/[0.12] hover:border-framer-cyan cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 text-center group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-framer-cyan/10 text-framer-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">點擊此處選擇圖片，或將圖片拖曳至此</p>
                      <p className="text-[11px] font-mono text-framer-subtext mt-0.5">支援 PNG, JPG, WebP, GIF, SVG</p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => {
                        setCoverImage(e.target.value);
                        setUploadStats(null);
                      }}
                      placeholder="或直接貼上圖片路徑 / 網址 (如 /uploads/xxx.webp 或 https://...)"
                      className="flex-1 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-framer-cyan font-mono"
                    />
                    {coverImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImage('');
                          setUploadStats(null);
                        }}
                        className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-colors shrink-0"
                      >
                        清除圖片
                      </button>
                    )}
                  </div>

                  {/* WebP Conversion Stats & Storage Location */}
                  {uploadStats && (
                    <div className="p-3.5 rounded-2xl bg-framer-emerald/10 border border-framer-emerald/20 text-xs space-y-1 font-mono">
                      <div className="flex items-center justify-between text-emerald-300 font-bold">
                        <span>⚡ 已自動完成 WebP 轉檔最佳化</span>
                        <span>省下 {uploadStats.compressionRatio} 空間</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-emerald-200/80">
                        <span>原檔大小: {uploadStats.originalSize} ➔ WebP: {uploadStats.optimizedSize}</span>
                        <span className="text-slate-400">📁 public/uploads/{uploadStats.filename}</span>
                      </div>
                    </div>
                  )}

                  {coverImage && (
                    <div className="rounded-2xl overflow-hidden border border-white/[0.1] max-h-48 relative group mt-2">
                      <img
                        src={coverImage}
                        alt="Cover Preview"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-mono text-white bg-black/70 px-3 py-1 rounded-full">
                          ✓ 封面圖已就緒 (WebP 格式)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Markdown Content Editor */}
              <div className="p-6 rounded-3xl framer-glass shadow-framer-card space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-display font-black text-xs uppercase tracking-wider text-framer-violet flex items-center gap-2">
                    <FileCode2 className="w-4 h-4" />
                    <span>【專屬分頁 Markdown 內容編輯】</span>
                  </h4>

                  {/* Quick Markdown Toolbar */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => insertMarkdown('## 新章節標題\n')}
                      className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-mono text-slate-300"
                    >
                      ## 標題
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('### 子標題\n')}
                      className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-mono text-slate-300"
                    >
                      ### 小標
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('- 重點項目 1\n- 重點項目 2\n')}
                      className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-mono text-slate-300"
                    >
                      - 清單
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('> 🎯 **核心成果**：描述專案商業效益。\n')}
                      className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-mono text-slate-300"
                    >
                      &gt; 引言
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('```typescript\nconst example = "code";\n```\n')}
                      className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-mono text-slate-300"
                    >
                      代碼框
                    </button>
                  </div>
                </div>

                <textarea
                  rows={10}
                  value={contentMd}
                  onChange={(e) => setContentMd(e.target.value)}
                  placeholder="在此輸入完整的 Markdown 專案內文，支援標題、代碼、列表與圖片，前端將自動轉化為符合全站風格的極致暗黑排版..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-xs font-mono text-slate-200 focus:outline-none focus:border-framer-violet leading-relaxed resize-y"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveNav('projects')}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.04] text-slate-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-framer-cyan via-framer-violet to-framer-amber text-slate-950 font-display font-black text-xs shadow-framer-glow-cyan active:scale-95 transition-all"
                >
                  {editingId ? '儲存並更新專案分頁' : '發布至前台輪播與獨立分頁'}
                </button>
              </div>
            </form>

            {/* Live Dual Preview Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 sticky top-6">
              {/* Preview Mode Switcher */}
              <div className="flex items-center justify-between bg-white/[0.03] p-1 rounded-2xl border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setPreviewMode('card')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    previewMode === 'card'
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Boxes className="w-3.5 h-3.5" />
                  <span>首頁卡片預覽</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('markdown')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    previewMode === 'markdown'
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>專屬分頁 Markdown 預覽</span>
                </button>
              </div>

              {/* 1. Preview Mode: Card */}
              {previewMode === 'card' && (
                <div className="p-6 rounded-3xl framer-glass shadow-framer-card border border-white/[0.12] space-y-4">
                  {coverImage && (
                    <div className="rounded-2xl overflow-hidden max-h-40 border border-white/[0.08]">
                      <img src={coverImage} alt="Card preview" className="w-full h-40 object-cover" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-framer-amber/10 text-amber-300 border border-framer-amber/30">
                      {badge || '🔥 旗艦代表作'}
                    </span>
                    <span className="font-mono text-xs text-framer-subtext">
                      {year || '2026'}
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-black text-white leading-snug">
                    {title || '輸入專案名稱...'}
                  </h3>

                  <p className="text-xs text-framer-subtext line-clamp-3 leading-relaxed">
                    {summary || '此處將即時展示您輸入或 AI 提煉的專案摘要...'}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {techStackInput.split(',').slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-framer-cyan to-framer-violet text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <span>深入閱讀專案分頁 →</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Preview Mode: Markdown Rendered View */}
              {previewMode === 'markdown' && (
                <div className="p-6 rounded-3xl framer-glass shadow-framer-card border border-white/[0.12] max-h-[70vh] overflow-y-auto space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                    <span className="text-[11px] font-mono text-framer-cyan font-bold">
                      FRAMER MARKDOWN RENDERED
                    </span>
                  </div>
                  <MarkdownRenderer content={contentMd || summary} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. VIEW: INQUIRIES INBOX */}
        {activeNav === 'inbox' && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex gap-2">
              {(['all', 'unread', 'replied', 'archived'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setInboxFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    inboxFilter === filter
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  {filter === 'all' && `全部 (${inquiries.length})`}
                  {filter === 'unread' && `未讀 / 待回覆 (${unreadInquiries.length})`}
                  {filter === 'replied' && '已聯絡'}
                  {filter === 'archived' && '已歸檔'}
                </button>
              ))}
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="p-12 text-center text-framer-subtext text-sm">
                此分類目前沒有訊息。
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-6 rounded-3xl framer-glass shadow-framer-card space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-base font-display font-black text-white">
                          {inq.name}
                        </span>
                        {inq.company && (
                          <span className="text-xs text-framer-subtext font-medium">
                            • {inq.company}
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            inq.status === 'unread'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : inq.status === 'replied'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-white/[0.06] text-slate-400'
                          }`}
                        >
                          {inq.status === 'unread' ? '待回覆' : inq.status === 'replied' ? '已聯絡' : '已歸檔'}
                        </span>
                      </div>

                      <span className="text-xs font-mono text-framer-subtext">
                        {new Date(inq.createdAt).toLocaleString('zh-TW')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-framer-subtext">
                      <div>📧 Email: <strong className="text-white">{inq.email}</strong></div>
                      <div>🎯 需求: <strong className="text-white">{inq.scope}</strong></div>
                      {inq.budget && <div>💰 預算: <strong className="text-white">{inq.budget}</strong></div>}
                    </div>

                    <div className="p-4 rounded-2xl bg-[#060709] border border-white/[0.06] text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                      "{inq.message}"
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq.id, 'replied')}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-framer-emerald/20 text-emerald-300 border border-framer-emerald/30 hover:bg-framer-emerald/30 transition-colors"
                        >
                          標記為已聯絡
                        </button>
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq.id, 'archived')}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] transition-colors"
                        >
                          歸檔
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="text-rose-400 hover:text-rose-300 text-xs p-1"
                        title="刪除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. VIEW: MANAGE EXISTING PROJECTS */}
        {activeNav === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-framer-subtext">
                資料庫共有 {projects.length} 個專案
              </span>
              <button
                onClick={() => {
                  setEditingId(null);
                  setActiveNav('studio');
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-framer-cyan to-framer-violet text-slate-950 text-xs font-bold flex items-center gap-1.5 font-display"
              >
                <PlusCircle className="w-4 h-4" />
                <span>新增專案</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-3xl framer-glass shadow-framer-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {proj.coverImage && (
                      <img
                        src={proj.coverImage}
                        alt={proj.title}
                        className="w-16 h-16 rounded-2xl object-cover border border-white/[0.1] shrink-0"
                      />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="font-display font-black text-base text-white">
                          {proj.title}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-framer-amber/10 text-amber-300 border border-framer-amber/20">
                          {proj.tag}
                        </span>
                      </div>
                      <p className="text-xs text-framer-subtext line-clamp-1">
                        {proj.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <Link
                      href={`/projects/${proj.id}`}
                      target="_blank"
                      className="px-3.5 py-2 rounded-xl framer-glass text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                      title="開啟專屬獨立分頁"
                    >
                      <Eye className="w-3.5 h-3.5 text-framer-cyan" />
                      <span>查看分頁</span>
                    </Link>

                    <button
                      onClick={() => handleEditProject(proj)}
                      className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5 text-framer-violet" />
                      <span>編輯</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2.5 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs transition-colors"
                      title="刪除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
