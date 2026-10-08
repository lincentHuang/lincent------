'use client';

import React from 'react';
import { Field, LInput, ListEditor, SectionCard, TagsInput, TextInput, emptyL } from '../shared/fields';
import { useSiteDraft } from '../shared/site-draft';
import { Loading } from './profile-editor';
import type { AboutContent } from '../../../content/types';

export function AboutEditor() {
  const { site, update } = useSiteDraft();
  if (!site) return <Loading />;
  const a = site.about;
  const set = (patch: Partial<AboutContent>) => update((s) => ({ ...s, about: { ...s.about, ...patch } }));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-sky-100 bg-sky-50 px-5 py-3 text-xs text-sky-800">
        工作經歷在「工作經歷」分頁編輯，會同時顯示在首頁與關於我。
      </div>

      <SectionCard title="開場" description="關於我頁面最上方的標題與簡介。" previewHref="/about">
        <LInput label="標題" value={a.headline} onChange={(v) => set({ headline: v })} />
        <LInput label="座右銘" value={a.motto} onChange={(v) => set({ motto: v })} />
        <LInput label="簡介" value={a.intro} onChange={(v) => set({ intro: v })} multiline rows={4} />
      </SectionCard>

      <SectionCard title="理念關鍵字" previewHref="/about">
        <ListEditor
          items={a.principles}
          onChange={(principles) => set({ principles })}
          addLabel="新增關鍵字"
          createItem={() => ({ title: emptyL(), desc: emptyL() })}
          itemTitle={(p) => p.title.zh}
          renderItem={(p, up) => (
            <>
              <LInput label="關鍵字" value={p.title} onChange={(v) => up({ title: v })} />
              <LInput label="說明" value={p.desc} onChange={(v) => up({ desc: v })} multiline rows={2} />
            </>
          )}
        />
      </SectionCard>

      <SectionCard title="自傳段落" previewHref="/about">
        <ListEditor
          items={a.story}
          onChange={(story) => set({ story })}
          addLabel="新增段落"
          createItem={() => ({ title: emptyL(), body: emptyL() })}
          itemTitle={(s) => s.title.zh}
          renderItem={(s, up) => (
            <>
              <LInput label="段落標題" value={s.title} onChange={(v) => up({ title: v })} />
              <LInput label="內文" value={s.body} onChange={(v) => up({ body: v })} multiline rows={8} />
            </>
          )}
        />
      </SectionCard>

      <SectionCard title="技能" previewHref="/about">
        <ListEditor
          items={a.skills}
          onChange={(skills) => set({ skills })}
          addLabel="新增技能分類"
          createItem={() => ({ category: emptyL(), items: [] as string[] })}
          itemTitle={(s) => s.category.zh}
          renderItem={(s, up) => (
            <>
              <LInput label="分類名稱" value={s.category} onChange={(v) => up({ category: v })} />
              <TagsInput label="技能項目" value={s.items} onChange={(items) => up({ items })} />
            </>
          )}
        />
      </SectionCard>

      <SectionCard title="學歷" previewHref="/about">
        <ListEditor
          items={a.education}
          onChange={(education) => set({ education })}
          addLabel="新增學歷"
          createItem={() => ({ school: emptyL(), department: emptyL(), period: '', highlights: emptyL() })}
          itemTitle={(e) => e.school.zh}
          renderItem={(e, up) => (
            <>
              <LInput label="學校" value={e.school} onChange={(v) => up({ school: v })} />
              <LInput label="系所" value={e.department} onChange={(v) => up({ department: v })} />
              <Field label="期間">
                <TextInput value={e.period} onChange={(v) => up({ period: v })} />
              </Field>
              <LInput label="亮點" value={e.highlights} onChange={(v) => up({ highlights: v })} multiline rows={2} />
            </>
          )}
        />
      </SectionCard>

      <SectionCard title="語言" previewHref="/about">
        <ListEditor
          items={a.languages}
          onChange={(languages) => set({ languages })}
          addLabel="新增語言"
          createItem={() => ({ name: emptyL(), level: emptyL() })}
          itemTitle={(l) => l.name.zh}
          renderItem={(l, up) => (
            <>
              <LInput label="語言" value={l.name} onChange={(v) => up({ name: v })} />
              <LInput label="程度" value={l.level} onChange={(v) => up({ level: v })} />
            </>
          )}
        />
      </SectionCard>

      <SectionCard title="合作偏好" previewHref="/about">
        <ListEditor
          items={a.preferences}
          onChange={(preferences) => set({ preferences })}
          addLabel="新增偏好"
          createItem={() => ({ label: emptyL(), value: emptyL() })}
          itemTitle={(p) => p.label.zh}
          renderItem={(p, up) => (
            <>
              <LInput label="項目" value={p.label} onChange={(v) => up({ label: v })} />
              <LInput label="內容" value={p.value} onChange={(v) => up({ value: v })} />
            </>
          )}
        />
      </SectionCard>
    </div>
  );
}
