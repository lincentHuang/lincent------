'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUp, ArrowDown, Plus, Trash2, ExternalLink, X } from 'lucide-react';
import type { L } from '../../../content/types';

// ==========================================
// 後台共用表單元件：所有編輯頁都用這一套，操作方式一致
// ==========================================

export const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10';

export function Field({
  label,
  hint,
  children,
  className = '',
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="block text-xs font-semibold text-slate-700">{label}</span>
      {children}
      {hint && <span className="block text-[11px] leading-relaxed text-slate-400">{hint}</span>}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  multiline,
  rows = 3,
  ...rest
}: {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  type?: string;
}) {
  return multiline ? (
    <textarea className={inputCls} rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />
  ) : (
    <input className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />
  );
}

/** 雙語欄位：中英並排，手機上下排 */
export function LInput({
  label,
  hint,
  value,
  onChange,
  multiline,
  rows,
}: {
  label: string;
  hint?: string;
  value: L | undefined;
  onChange: (v: L) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const v = value || { zh: '', en: '' };
  return (
    <div className="space-y-1.5">
      <span className="block text-xs font-semibold text-slate-700">{label}</span>
      <div className="grid gap-2 md:grid-cols-2">
        {(['zh', 'en'] as const).map((lang) => (
          <div key={lang} className="relative">
            <span className="pointer-events-none absolute right-2 top-2 z-10 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
              {lang === 'zh' ? '中' : 'EN'}
            </span>
            <TextInput
              value={v[lang]}
              onChange={(text) => onChange({ ...v, [lang]: text })}
              multiline={multiline}
              rows={rows}
            />
          </div>
        ))}
      </div>
      {hint && <span className="block text-[11px] text-slate-400">{hint}</span>}
    </div>
  );
}

/** 標籤輸入：Enter 或逗號新增 */
export function TagsInput({
  label,
  value,
  onChange,
  placeholder = '輸入後按 Enter',
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');
  const commit = () => {
    const parts = draft
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !value.includes(s));
    if (parts.length) onChange([...value, ...parts]);
    setDraft('');
  };
  return (
    <div className="space-y-1.5">
      <span className="block text-xs font-semibold text-slate-700">{label}</span>
      <div className={`${inputCls} flex flex-wrap items-center gap-1.5`}>
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} aria-label={`移除 ${tag}`}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          className="min-w-[120px] flex-1 bg-transparent text-sm outline-none"
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              commit();
            } else if (e.key === 'Backspace' && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={commit}
        />
      </div>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left"
    >
      <span>
        <span className="block text-sm font-medium text-slate-800">{label}</span>
        {hint && <span className="block text-[11px] text-slate-400">{hint}</span>}
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-slate-900' : 'bg-slate-300'}`}>
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </span>
    </button>
  );
}

/** 編輯區塊卡片：標題旁附「在前台查看」，讓後台每一塊都對應得到前台位置 */
export function SectionCard({
  title,
  description,
  previewHref,
  actions,
  children,
}: {
  title: string;
  description?: string;
  previewHref?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          {description && <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {previewHref && (
            <a
              href={previewHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              在前台查看 <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

/** 通用清單編輯：新增、刪除、上下移動、展開收合 */
export function ListEditor<T>({
  items,
  onChange,
  createItem,
  itemTitle,
  renderItem,
  addLabel = '新增一筆',
  max,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  itemTitle: (item: T, index: number) => string;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  addLabel?: string;
  max?: number;
}) {
  const [open, setOpen] = useState<number | null>(items.length ? 0 : null);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    onChange(next);
    setOpen(to);
  };

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60">
            <div className="flex items-center gap-2 px-3 py-2">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-[11px] font-bold text-slate-500 ring-1 ring-slate-200">
                  {i + 1}
                </span>
                <span className="truncate text-sm font-medium text-slate-800">{itemTitle(item, i) || '（未命名）'}</span>
                {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </button>
              <IconBtn label="上移" onClick={() => move(i, i - 1)} disabled={i === 0}>
                <ArrowUp className="h-3.5 w-3.5" />
              </IconBtn>
              <IconBtn label="下移" onClick={() => move(i, i + 1)} disabled={i === items.length - 1}>
                <ArrowDown className="h-3.5 w-3.5" />
              </IconBtn>
              <IconBtn
                label="刪除"
                danger
                onClick={() => {
                  if (confirm(`確定刪除第 ${i + 1} 筆「${itemTitle(item, i) || '未命名'}」？`)) {
                    onChange(items.filter((_, j) => j !== i));
                    setOpen(null);
                  }
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </IconBtn>
            </div>
            {isOpen && (
              <div className="space-y-4 border-t border-slate-200 bg-white p-4">
                {renderItem(item, (patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it))), i)}
              </div>
            )}
          </div>
        );
      })}
      {(!max || items.length < max) && (
        <button
          type="button"
          onClick={() => {
            onChange([...items, createItem()]);
            setOpen(items.length);
          }}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-600 hover:border-slate-900 hover:text-slate-900"
        >
          <Plus className="h-3.5 w-3.5" /> {addLabel}
        </button>
      )}
    </div>
  );
}

export function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md p-1.5 transition-colors disabled:opacity-30 ${
        danger ? 'text-slate-400 hover:bg-rose-50 hover:text-rose-600' : 'text-slate-400 hover:bg-slate-200 hover:text-slate-900'
      }`}
    >
      {children}
    </button>
  );
}

export const emptyL = (): L => ({ zh: '', en: '' });
