'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import type { Project } from '../../../content/types';
import { adminApi } from '../shared/api';
import { IconBtn } from '../shared/fields';
import { ProjectEditor, createEmptyProject } from './project-editor';

type Filter = 'all' | 'published' | 'draft';

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [editing, setEditing] = useState<{ project: Project; isNew: boolean } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const flash = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(null), 2200);
  };

  const setUrl = (id: string | null) => {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set('project', id);
    else url.searchParams.delete('project');
    window.history.replaceState(null, '', url.toString());
  };

  useEffect(() => {
    adminApi.projects
      .list()
      .then((r) => {
        setProjects(r.projects);
        const id = new URLSearchParams(window.location.search).get('project');
        const found = id && r.projects.find((p) => p.id === id);
        if (found) setEditing({ project: found, isNew: false });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...projects].sort((a, b) => a.order - b.order);
  const visible = sorted.filter((p) => filter === 'all' || (filter === 'published' ? p.published : !p.published));

  const quickToggle = async (p: Project, field: 'published' | 'featured') => {
    setBusyId(p.id);
    setError(null);
    try {
      const r = await adminApi.projects.save({ ...p, [field]: !p[field] });
      setProjects(r.projects);
      flash(field === 'published' ? (p.published ? '已改為草稿' : '已發佈') : p.featured ? '已取消首頁精選' : '已設為首頁精選');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const reorder = async (p: Project, dir: -1 | 1) => {
    const ids = sorted.map((x) => x.id);
    const i = ids.indexOf(p.id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    setBusyId(p.id);
    try {
      const r = await adminApi.projects.reorder(ids);
      setProjects(r.projects);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (p: Project) => {
    if (!confirm(`確定刪除作品「${p.title || p.id}」？此動作無法復原。`)) return;
    setBusyId(p.id);
    try {
      await adminApi.projects.remove(p.id);
      setProjects((l) => l.filter((x) => x.id !== p.id));
      flash('作品已刪除');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const open = (p: Project, isNew = false) => {
    setEditing({ project: p, isNew });
    setUrl(isNew ? null : p.id);
  };
  const close = useCallback(() => {
    setEditing(null);
    setUrl(null);
  }, []);

  if (loading) return <div className="py-16 text-center text-sm text-slate-500">載入中…</div>;

  if (editing) {
    return (
      <ProjectEditor
        key={editing.project.id || 'new'}
        initial={editing.project}
        isNew={editing.isNew}
        onBack={close}
        onSaved={(list, saved) => {
          setProjects(list);
          if (editing.isNew) {
            setEditing({ project: saved, isNew: false });
            setUrl(saved.id);
          }
        }}
      />
    );
  }

  const count = (f: Filter) => (f === 'all' ? projects.length : projects.filter((p) => (f === 'published' ? p.published : !p.published)).length);
  const chips: { key: Filter; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'published', label: '已發佈' },
    { key: 'draft', label: '草稿' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">作品管理</h2>
          <p className="text-xs text-slate-500">列表順序即前台顯示順序。</p>
        </div>
        <div className="flex items-center gap-3">
          {toast && <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">{toast}</span>}
          <button
            onClick={() => open(createEmptyProject(projects.length), true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
          >
            <Plus className="h-3.5 w-3.5" /> 新增作品
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === c.key ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.label} <span className="opacity-60">{count(c.key)}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {error}
          <button className="ml-3 underline" onClick={() => setError(null)}>關閉</button>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500">
          {projects.length === 0 ? '還沒有作品，按右上角「新增作品」開始' : '這個分類下沒有作品'}
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((p) => {
            const idx = sorted.findIndex((x) => x.id === p.id);
            const busy = busyId === p.id;
            return (
              <li key={p.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
                <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-20 sm:w-32">
                  {p.coverImage ? (
                    <img src={p.coverImage} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[11px] text-slate-400">無封面</div>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => open(p)} className="truncate text-left text-sm font-bold text-slate-900 hover:underline">
                      {p.title || p.id}
                    </button>
                    <span className="text-xs text-slate-400">{p.year}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${p.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {p.published ? '已發佈' : '草稿'}
                    </span>
                    {p.featured && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">首頁精選</span>}
                    <span className="text-[11px] text-slate-400">相簿 {p.galleryRows?.length || 0} 列</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <button
                      disabled={busy}
                      onClick={() => quickToggle(p, 'published')}
                      className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      {p.published ? '改為草稿' : '發佈'}
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => quickToggle(p, 'featured')}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      <Star className={`h-3 w-3 ${p.featured ? 'fill-amber-400 text-amber-500' : ''}`} /> {p.featured ? '取消精選' : '設為精選'}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 self-end sm:self-center">
                  <IconBtn label="上移" disabled={busy || idx === 0 || filter !== 'all'} onClick={() => reorder(p, -1)}>
                    <ArrowUp className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn label="下移" disabled={busy || idx === sorted.length - 1 || filter !== 'all'} onClick={() => reorder(p, 1)}>
                    <ArrowDown className="h-4 w-4" />
                  </IconBtn>
                  {p.published && (
                    <a
                      href={`/projects/${p.id}`}
                      target="_blank"
                      rel="noreferrer"
                      title="預覽"
                      aria-label="預覽"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-900"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => open(p)}
                    className="ml-1 inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    <Pencil className="h-3 w-3" /> 編輯
                  </button>
                  <IconBtn label="刪除" danger disabled={busy} onClick={() => remove(p)}>
                    <Trash2 className="h-4 w-4" />
                  </IconBtn>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {filter !== 'all' && <p className="text-[11px] text-slate-400">排序僅能在「全部」檢視下調整。</p>}
    </div>
  );
}
