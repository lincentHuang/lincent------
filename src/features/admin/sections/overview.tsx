'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { adminApi } from '../shared/api';
import { useMediaLibrary } from '../shared/media';
import { SectionCard } from '../shared/fields';
import type { AdminTab } from '../admin-shell';

const MAP: { where: string; tab: AdminTab; label: string }[] = [
  { where: '首頁 Hero／優勢／價值／服務／流程／評價', tab: 'home', label: '首頁區塊' },
  { where: '首頁工作經歷', tab: 'experience', label: '工作經歷' },
  { where: '精選作品 與 /projects', tab: 'projects', label: '作品管理' },
  { where: '/about 關於我', tab: 'about', label: '關於我頁面' },
  { where: '頁尾／側欄社群連結', tab: 'profile', label: '個人資料與 SEO' },
  { where: '聯絡表單收件', tab: 'inquiries', label: '詢問信箱' },
];

function Tile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
  );
}

export function Overview({ onNavigate }: { onNavigate: (tab: AdminTab) => void }) {
  const { media } = useMediaLibrary();
  const [published, setPublished] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<number | null>(null);
  const [unread, setUnread] = useState<number | null>(null);

  useEffect(() => {
    adminApi.projects
      .list()
      .then(({ projects }) => {
        setPublished(projects.filter((p) => p.published).length);
        setDrafts(projects.filter((p) => !p.published).length);
      })
      .catch(() => {});
    adminApi.inquiries
      .list()
      .then(({ inquiries }) => setUnread(inquiries.filter((i) => i.status === 'unread').length))
      .catch(() => {});
  }, []);

  const unused = media.filter((m) => m.usages.length === 0).length;
  const n = (v: number | null) => (v === null ? '—' : v);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Tile label="已發佈作品" value={n(published)} />
        <Tile label="草稿" value={n(drafts)} />
        <Tile label="未讀詢問" value={n(unread)} />
        <Tile label="媒體庫圖片" value={media.length} />
        <Tile label="未使用圖片" value={unused} />
      </div>

      <SectionCard title="網站結構對照" description="前台每個位置的內容，都能從這裡找到對應的編輯分頁。">
        <ul className="divide-y divide-slate-100">
          {MAP.map((m) => (
            <li key={m.where} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <span className="text-sm text-slate-700">{m.where}</span>
              <button
                type="button"
                onClick={() => onNavigate(m.tab)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {m.label} <ArrowRight className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="圖片流程">
        <p className="text-sm leading-relaxed text-slate-600">
          上傳 → 自動轉正並壓縮成 WebP、產生縮圖 → 進入媒體庫 → 在各欄位選用。使用中的圖片無法誤刪。
        </p>
      </SectionCard>
    </div>
  );
}
