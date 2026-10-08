'use client';

import React, { useState } from 'react';
import { ArrowDown, ArrowLeftRight, ArrowUp, ImagePlus, Layers, Plus, Trash2 } from 'lucide-react';
import type { GalleryRow, GalleryRowLayout, GallerySlot } from '../../../types';
import { MediaPicker } from '../shared/media';
import { IconBtn, inputCls } from '../shared/fields';

const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const LAYOUTS: { key: GalleryRowLayout; label: string; widths: number[] }[] = [
  { key: 'full', label: '全寬', widths: [100] },
  { key: 'split-equal', label: '等分', widths: [50, 50] },
  { key: 'split-left-small', label: '左小右大', widths: [40, 60] },
  { key: 'split-left-large', label: '左大右小', widths: [60, 40] },
];
const widthsOf = (l: GalleryRowLayout) => LAYOUTS.find((x) => x.key === l)!.widths;
const slotCount = (l: GalleryRowLayout) => (l === 'full' ? 1 : 2);

const emptySlot = (url = ''): GallerySlot => ({ id: uid('slot'), url, fit: 'cover', aspectRatio: 'auto' });
const newRow = (layout: GalleryRowLayout, urls: string[] = []): GalleryRow => ({
  id: uid('row'),
  layout,
  slots: Array.from({ length: slotCount(layout) }, (_, i) => emptySlot(urls[i] || '')),
});

const ASPECTS = [
  { v: 'auto', l: '自動（原圖比例）' },
  { v: '16/9', l: '16:9' },
  { v: '4/3', l: '4:3' },
  { v: '1/1', l: '1:1' },
  { v: '3/4', l: '3:4' },
];

function LayoutIcon({ widths, active }: { widths: number[]; active?: boolean }) {
  return (
    <span className="flex h-5 w-9 gap-0.5">
      {widths.map((w, i) => (
        <span key={i} style={{ width: `${w}%` }} className={`h-full rounded-sm ${active ? 'bg-white' : 'bg-slate-400'}`} />
      ))}
    </span>
  );
}

function RowPreview({ row }: { row: GalleryRow }) {
  const widths = widthsOf(row.layout);
  return (
    <div className="flex h-16 w-full gap-1 sm:h-20 sm:w-44 sm:shrink-0">
      {widths.map((w, i) => {
        const s = row.slots[i];
        return (
          <div
            key={i}
            style={{ width: `${w}%`, backgroundColor: s?.bgColor || undefined }}
            className="relative overflow-hidden rounded-md border border-slate-200 bg-slate-100"
          >
            {s?.url ? (
              <img src={s.url} alt="" className={`h-full w-full ${s.fit === 'contain' ? 'object-contain' : 'object-cover'}`} />
            ) : (
              <span className="flex h-full items-center justify-center text-[10px] text-slate-400">空白</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function GalleryRowsEditor({ rows, onChange }: { rows: GalleryRow[]; onChange: (rows: GalleryRow[]) => void }) {
  const [batchOpen, setBatchOpen] = useState(false);
  const [strategy, setStrategy] = useState<'full' | 'pair'>('full');
  const [addLayout, setAddLayout] = useState<GalleryRowLayout>('full');
  const [pickSlot, setPickSlot] = useState<{ rowId: string; index: number } | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const updateRow = (id: string, fn: (r: GalleryRow) => GalleryRow) => onChange(rows.map((r) => (r.id === id ? fn(r) : r)));
  const updateSlot = (rowId: string, index: number, patch: Partial<GallerySlot>) =>
    updateRow(rowId, (r) => ({ ...r, slots: r.slots.map((s, i) => (i === index ? { ...s, ...patch } : s)) }));

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const changeLayout = (row: GalleryRow, layout: GalleryRowLayout) => {
    if (layout === row.layout) return;
    const need = slotCount(layout);
    let slots = row.slots.slice(0, need);
    if (row.slots.length > need && row.slots[1]?.url) {
      if (!confirm('改成全寬後，右側那張圖片會從這一列移除（圖片仍在媒體庫）。確定嗎？')) return;
    }
    while (slots.length < need) slots = [...slots, emptySlot()];
    updateRow(row.id, (r) => ({ ...r, layout, slots }));
  };

  const batchAdd = (urls: string[]) => {
    if (!urls.length) return;
    const created: GalleryRow[] = [];
    if (strategy === 'full') {
      urls.forEach((u) => created.push(newRow('full', [u])));
    } else {
      for (let i = 0; i < urls.length; i += 2) {
        if (i + 1 < urls.length) created.push(newRow('split-equal', [urls[i], urls[i + 1]]));
        else created.push(newRow('full', [urls[i]]));
      }
    }
    onChange([...rows, ...created]);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
        <Layers className="mr-1 inline h-3.5 w-3.5" />
        前台專案頁會依照這裡的列順序由上往下顯示。每一列可以是一張全寬圖，或兩張並排。
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setBatchOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
        >
          <ImagePlus className="h-3.5 w-3.5" /> ＋ 批次加入圖片
        </button>
        <div className="inline-flex overflow-hidden rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setStrategy('full')}
            className={`px-3 py-2 font-medium ${strategy === 'full' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}
          >
            全部全寬
          </button>
          <button
            type="button"
            onClick={() => setStrategy('pair')}
            className={`px-3 py-2 font-medium ${strategy === 'pair' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}
          >
            兩兩並排
          </button>
        </div>
        <span className="text-[11px] text-slate-400">
          {strategy === 'full' ? '每張圖各佔一列' : '依選取順序兩張一列，剩下單張用全寬'}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <select value={addLayout} onChange={(e) => setAddLayout(e.target.value as GalleryRowLayout)} className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs">
            {LAYOUTS.map((l) => (
              <option key={l.key} value={l.key}>
                {l.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              const r = newRow(addLayout);
              onChange([...rows, r]);
              setOpenId(r.id);
            }}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Plus className="h-3.5 w-3.5" /> 新增單列
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center">
          <p className="text-sm font-semibold text-slate-700">還沒有相簿圖片</p>
          <p className="mt-1 text-xs text-slate-500">沒有相簿時，專案頁會只顯示封面圖。按上方「批次加入圖片」開始。</p>
        </div>
      ) : (
        <ol className="space-y-3">
          {rows.map((row, i) => {
            const isOpen = openId === row.id;
            return (
              <li key={row.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-500">{i + 1}</span>
                  <RowPreview row={row} />
                  <div className="flex flex-1 flex-wrap items-center gap-1">
                    {LAYOUTS.map((l) => (
                      <button
                        key={l.key}
                        type="button"
                        title={l.label}
                        onClick={() => changeLayout(row, l.key)}
                        className={`flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] ${
                          row.layout === l.key ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <LayoutIcon widths={l.widths} active={row.layout === l.key} />
                        {l.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {row.slots.length === 2 && (
                      <IconBtn label="左右對調" onClick={() => updateRow(row.id, (r) => ({ ...r, slots: [r.slots[1], r.slots[0]] }))}>
                        <ArrowLeftRight className="h-3.5 w-3.5" />
                      </IconBtn>
                    )}
                    <IconBtn label="上移" onClick={() => move(i, -1)} disabled={i === 0}>
                      <ArrowUp className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn label="下移" onClick={() => move(i, 1)} disabled={i === rows.length - 1}>
                      <ArrowDown className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn
                      label="刪除這一列"
                      danger
                      onClick={() => {
                        if (confirm(`確定刪除第 ${i + 1} 列？（圖片仍保留在媒體庫）`)) onChange(rows.filter((r) => r.id !== row.id));
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </IconBtn>
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : row.id)}
                      className="ml-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {isOpen ? '收合' : '編輯圖片'}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="grid gap-4 border-t border-slate-200 bg-slate-50/60 p-4 md:grid-cols-2">
                    {row.slots.map((slot, si) => (
                      <div key={slot.id} className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">{row.slots.length === 1 ? '圖片' : si === 0 ? '左側圖片' : '右側圖片'}</span>
                          <button
                            type="button"
                            onClick={() => setPickSlot({ rowId: row.id, index: si })}
                            className="rounded-lg bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white"
                          >
                            {slot.url ? '更換圖片' : '選擇圖片'}
                          </button>
                        </div>
                        <div
                          className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                          style={{ backgroundColor: slot.bgColor || undefined }}
                        >
                          {slot.url ? (
                            <img src={slot.url} alt="" className={`h-full w-full ${slot.fit === 'contain' ? 'object-contain' : 'object-cover'}`} />
                          ) : (
                            <span className="text-xs text-slate-400">尚未選擇圖片</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <label className="space-y-1">
                            <span className="block text-[11px] font-semibold text-slate-600">填滿方式</span>
                            <select className={inputCls} value={slot.fit || 'cover'} onChange={(e) => updateSlot(row.id, si, { fit: e.target.value as 'cover' | 'contain' })}>
                              <option value="cover">裁切填滿 (cover)</option>
                              <option value="contain">完整顯示 (contain)</option>
                            </select>
                          </label>
                          <label className="space-y-1">
                            <span className="block text-[11px] font-semibold text-slate-600">長寬比</span>
                            <select className={inputCls} value={slot.aspectRatio || 'auto'} onChange={(e) => updateSlot(row.id, si, { aspectRatio: e.target.value })}>
                              {ASPECTS.map((a) => (
                                <option key={a.v} value={a.v}>
                                  {a.l}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <label className="block space-y-1">
                          <span className="block text-[11px] font-semibold text-slate-600">圖說（選填）</span>
                          <input className={inputCls} value={slot.caption || ''} onChange={(e) => updateSlot(row.id, si, { caption: e.target.value })} />
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-600">背景色（選填）</span>
                          <input
                            type="color"
                            value={slot.bgColor || '#0a0a0e'}
                            onChange={(e) => updateSlot(row.id, si, { bgColor: e.target.value })}
                            className="h-7 w-10 cursor-pointer rounded border border-slate-200"
                          />
                          {slot.bgColor && (
                            <button type="button" className="text-[11px] text-slate-500 underline" onClick={() => updateSlot(row.id, si, { bgColor: undefined })}>
                              清除
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}

      <MediaPicker multiple open={batchOpen} onClose={() => setBatchOpen(false)} onSelect={batchAdd} title="批次加入相簿圖片（依點選順序排列）" />
      <MediaPicker
        open={!!pickSlot}
        onClose={() => setPickSlot(null)}
        onSelect={([url]) => pickSlot && updateSlot(pickSlot.rowId, pickSlot.index, { url })}
        title="選擇這個格位的圖片"
      />
    </div>
  );
}
