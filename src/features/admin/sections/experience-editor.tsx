'use client';

import React from 'react';
import { Field, LInput, ListEditor, SectionCard, TagsInput, TextInput, emptyL } from '../shared/fields';
import { ImageField } from '../shared/media';
import { useSiteDraft } from '../shared/site-draft';
import { Loading } from './profile-editor';
import type { ExperienceItem, SectionHeader } from '../../../content/types';

export function HeaderFields({ value, onChange }: { value: SectionHeader; onChange: (h: SectionHeader) => void }) {
  return (
    <div className="space-y-4 rounded-xl bg-slate-50 p-4">
      <LInput label="區塊小標 (tag)" value={value.tag} onChange={(v) => onChange({ ...value, tag: v })} />
      <LInput label="區塊標題" value={value.title} onChange={(v) => onChange({ ...value, title: v })} />
      <LInput label="區塊副標" value={value.subtitle} onChange={(v) => onChange({ ...value, subtitle: v })} multiline rows={2} />
    </div>
  );
}

export function ExperienceEditor() {
  const { site, update } = useSiteDraft();
  if (!site) return <Loading />;
  const ex = site.experience;
  const set = (patch: Partial<typeof ex>) => update((s) => ({ ...s, experience: { ...s.experience, ...patch } }));

  return (
    <div className="space-y-6">
      <SectionCard
        title="工作經歷"
        description="同時顯示在首頁的工作經歷區塊與 /about 頁面。"
        previewHref="/#experience"
      >
        <HeaderFields value={ex} onChange={(h) => set({ tag: h.tag, title: h.title, subtitle: h.subtitle })} />
        <ListEditor<ExperienceItem>
          items={ex.items}
          onChange={(items) => set({ items })}
          addLabel="新增一段經歷"
          itemTitle={(it) => `${it.company.zh}${it.role.zh ? ' · ' + it.role.zh : ''}`}
          createItem={() => ({
            id: `exp-${Date.now()}`,
            company: emptyL(),
            role: emptyL(),
            period: '',
            duration: emptyL(),
            location: emptyL(),
            summary: emptyL(),
            highlights: [],
            techTags: [],
          })}
          renderItem={(it, up) => (
            <>
              <div className="grid gap-4 md:grid-cols-[1fr_120px]">
                <div className="space-y-4">
                  <LInput label="公司" value={it.company} onChange={(v) => up({ company: v })} />
                  <LInput label="職稱" value={it.role} onChange={(v) => up({ role: v })} />
                </div>
                <div className="max-w-[120px]">
                  <ImageField label="公司 Logo" aspect="aspect-square" value={it.logo} onChange={(v) => up({ logo: v })} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="期間" hint="例如 2023/10 — 2026/8">
                  <TextInput value={it.period} onChange={(v) => up({ period: v })} />
                </Field>
              </div>
              <LInput label="時長" value={it.duration} onChange={(v) => up({ duration: v })} />
              <LInput label="地點" value={it.location} onChange={(v) => up({ location: v })} />
              <LInput label="標章（選填）" value={it.badge || emptyL()} onChange={(v) => up({ badge: v })} />
              <LInput label="摘要" value={it.summary} onChange={(v) => up({ summary: v })} multiline rows={3} />
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-700">重點成果</span>
                <ListEditor
                  items={it.highlights}
                  onChange={(highlights) => up({ highlights })}
                  addLabel="新增重點"
                  createItem={emptyL}
                  itemTitle={(h, i) => h.zh.slice(0, 30) || `重點 ${i + 1}`}
                  renderItem={(h, hu) => (
                    <LInput label="內容" value={h} onChange={(v) => hu(v)} multiline rows={2} />
                  )}
                />
              </div>
              <TagsInput label="技術標籤" value={it.techTags} onChange={(techTags) => up({ techTags })} />
            </>
          )}
        />
      </SectionCard>
    </div>
  );
}
