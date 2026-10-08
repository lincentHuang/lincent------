'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Archive, CheckCheck, Mail, MailOpen, Reply, Trash2 } from 'lucide-react';
import type { InquiryItem } from '../../../types';
import { adminApi } from '../shared/api';

type Filter = 'all' | InquiryItem['status'];

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'unread', label: '未讀' },
  { key: 'replied', label: '已回覆' },
  { key: 'archived', label: '封存' },
];

const STATUS_BADGE: Record<InquiryItem['status'], { label: string; cls: string }> = {
  unread: { label: '未讀', cls: 'bg-amber-100 text-amber-800' },
  replied: { label: '已回覆', cls: 'bg-emerald-100 text-emerald-800' },
  archived: { label: '封存', cls: 'bg-slate-100 text-slate-600' },
};

export function InquiriesInbox() {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => {
    adminApi.inquiries
      .list()
      .then((r) => setItems(r.inquiries))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(
    () => [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [items]
  );
  const unreadCount = items.filter((i) => i.status === 'unread').length;
  const visible = sorted.filter((i) => filter === 'all' || i.status === filter);
  const countOf = (f: Filter) => (f === 'all' ? items.length : items.filter((i) => i.status === f).length);

  const setStatus = async (item: InquiryItem, status: InquiryItem['status'], msg: string) => {
    setBusyId(item.id);
    try {
      const r = await adminApi.inquiries.setStatus(item.id, status);
      setItems(r.inquiries);
      flash(msg);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (item: InquiryItem) => {
    if (!confirm(`確定刪除「${item.name}」的詢問？此動作無法復原。`)) return;
    setBusyId(item.id);
    try {
      const r = await adminApi.inquiries.remove(item.id);
      setItems(r.inquiries);
      flash('已刪除');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const reply = (item: InquiryItem) => {
    const subject = encodeURIComponent(`Re: 關於「${item.scope || '合作洽詢'}」的詢問`);
    window.location.href = `mailto:${item.email}?subject=${subject}`;
    if (item.status === 'unread') setStatus(item, 'replied', '已標記為已回覆');
  };

  const btn =
    'inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">詢問信箱</h2>
          <p className="text-xs text-slate-500">
            共 {items.length} 封，<span className="font-semibold text-amber-700">{unreadCount} 封未讀</span>
          </p>
        </div>
        {toast && <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">{toast}</span>}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === f.key ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.label} <span className="opacity-60">{countOf(f.key)}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {error}
          <button className="ml-3 underline" onClick={() => setError(null)}>
            關閉
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">載入中…</div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <MailOpen className="h-8 w-8 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">{items.length === 0 ? '還沒有收到任何詢問' : '這個分類下沒有詢問'}</p>
          <p className="text-xs text-slate-500">訪客從前台聯絡表單送出的訊息會顯示在這裡</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => {
            const badge = STATUS_BADGE[item.status];
            const disabled = busyId === item.id;
            return (
              <li
                key={item.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm ${item.status === 'unread' ? 'border-amber-300' : 'border-slate-200'}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{item.name}</span>
                      {item.company && <span className="text-xs text-slate-500">· {item.company}</span>}
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.cls}`}>{badge.label}</span>
                    </div>
                    <a href={`mailto:${item.email}`} className="text-xs text-blue-600 hover:underline">
                      {item.email}
                    </a>
                  </div>
                  <time className="text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleString('zh-TW', { hour12: false })}
                  </time>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600">
                  <span>
                    <span className="text-slate-400">需求：</span>
                    {item.scope || '—'}
                  </span>
                  {item.budget && (
                    <span>
                      <span className="text-slate-400">預算：</span>
                      {item.budget}
                    </span>
                  )}
                </div>

                <p className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-800">{item.message}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button className={btn} disabled={disabled} onClick={() => reply(item)}>
                    <Reply className="h-3.5 w-3.5" /> 回信
                  </button>
                  {item.status !== 'replied' && (
                    <button className={btn} disabled={disabled} onClick={() => setStatus(item, 'replied', '已標記為已回覆')}>
                      <CheckCheck className="h-3.5 w-3.5" /> 標記已回覆
                    </button>
                  )}
                  {item.status !== 'archived' && (
                    <button className={btn} disabled={disabled} onClick={() => setStatus(item, 'archived', '已封存')}>
                      <Archive className="h-3.5 w-3.5" /> 封存
                    </button>
                  )}
                  {item.status !== 'unread' && (
                    <button className={btn} disabled={disabled} onClick={() => setStatus(item, 'unread', '已標回未讀')}>
                      <Mail className="h-3.5 w-3.5" /> 標回未讀
                    </button>
                  )}
                  <button className={`${btn} ml-auto text-rose-600 hover:bg-rose-50`} disabled={disabled} onClick={() => remove(item)}>
                    <Trash2 className="h-3.5 w-3.5" /> 刪除
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
