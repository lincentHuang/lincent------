'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { adminApi } from './api';
import type { SiteContent } from '../../../content/types';

// ==========================================
// 網站內容草稿：個人資料、首頁區塊、關於我、經歷都編輯同一份 SiteContent
// 切換分頁不會遺失修改，統一由底部儲存列送出
// ==========================================
interface SiteDraftCtx {
  site: SiteContent | null;
  dirty: boolean;
  saving: boolean;
  error: string | null;
  lastSavedAt: string | null;
  /** 以 immutable 方式更新草稿：update(s => ({ ...s, hero: {...} })) */
  update: (fn: (s: SiteContent) => SiteContent) => void;
  save: () => Promise<void>;
  discard: () => void;
}

const Ctx = createContext<SiteDraftCtx | null>(null);

export function useSiteDraft() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSiteDraft 必須在 SiteDraftProvider 內使用');
  return ctx;
}

export function SiteDraftProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<SiteContent | null>(null);
  const [site, setSite] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    adminApi.site
      .get()
      .then(({ site, updatedAt }) => {
        setSaved(site);
        setSite(site);
        setLastSavedAt(updatedAt);
      })
      .catch((e) => setError(e.message));
  }, []);

  const dirty = useMemo(() => !!site && JSON.stringify(site) !== JSON.stringify(saved), [site, saved]);

  const update = useCallback((fn: (s: SiteContent) => SiteContent) => setSite((s) => (s ? fn(s) : s)), []);

  const save = useCallback(async () => {
    if (!site) return;
    setSaving(true);
    setError(null);
    try {
      const res = await adminApi.site.save(site);
      setSaved(res.site);
      setSite(res.site);
      setLastSavedAt(new Date().toISOString());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }, [site]);

  const discard = useCallback(() => setSite(saved), [saved]);

  // 有未儲存變更時離開頁面要提醒
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const value = useMemo(
    () => ({ site, dirty, saving, error, lastSavedAt, update, save, discard }),
    [site, dirty, saving, error, lastSavedAt, update, save, discard]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** 底部固定儲存列（Cmd/Ctrl + S 也能儲存） */
export function SaveBar({
  dirty,
  saving,
  error,
  onSave,
  onDiscard,
}: {
  dirty: boolean;
  saving: boolean;
  error?: string | null;
  onSave: () => void;
  onDiscard?: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (dirty && !saving) onSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dirty, saving, onSave]);

  if (!dirty && !error) return null;
  return (
    <div className="sticky bottom-4 z-40 mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-2xl">
      <span className="text-xs">
        {error ? <span className="text-rose-300">儲存失敗：{error}</span> : '有尚未儲存的變更'}
        <span className="ml-2 hidden text-slate-400 sm:inline">⌘S / Ctrl+S 儲存</span>
      </span>
      <div className="flex gap-2">
        {onDiscard && dirty && (
          <button onClick={onDiscard} className="rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10">
            放棄變更
          </button>
        )}
        <button
          onClick={onSave}
          disabled={saving || !dirty}
          className="rounded-lg bg-white px-4 py-1.5 text-xs font-bold text-slate-900 disabled:opacity-50"
        >
          {saving ? '儲存中…' : '儲存並發佈'}
        </button>
      </div>
    </div>
  );
}

/** 搭配 SiteDraftProvider 的儲存列 */
export function SiteSaveBar() {
  const { dirty, saving, error, save, discard } = useSiteDraft();
  return <SaveBar dirty={dirty} saving={saving} error={error} onSave={save} onDiscard={discard} />;
}
