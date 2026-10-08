'use client';

import React from 'react';
import { Field, LInput, SectionCard, TextInput } from '../shared/fields';
import { ImageField } from '../shared/media';
import { useSiteDraft } from '../shared/site-draft';
import type { Profile } from '../../../content/types';

export function Loading() {
  return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">載入中…</div>;
}

export function ProfileEditor() {
  const { site, update } = useSiteDraft();
  if (!site) return <Loading />;
  const p = site.profile;
  const setP = (patch: Partial<Profile>) => update((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
  const setSeo = (patch: Partial<typeof site.seo>) => update((s) => ({ ...s, seo: { ...s.seo, ...patch } }));

  return (
    <div className="space-y-6">
      <SectionCard title="基本資料" description="顯示於側欄、首頁、關於我與頁尾。" previewHref="/">
        <LInput label="姓名" value={p.name} onChange={(v) => setP({ name: v })} />
        <LInput label="職稱" value={p.title} onChange={(v) => setP({ title: v })} />
        <LInput label="一句話介紹" value={p.tagline} onChange={(v) => setP({ tagline: v })} multiline rows={2} />
        <LInput label="所在地" value={p.location} onChange={(v) => setP({ location: v })} />
        <LInput label="接案狀態" value={p.availability} onChange={(v) => setP({ availability: v })} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Email">
            <TextInput value={p.email} onChange={(v) => setP({ email: v })} type="email" />
          </Field>
          <Field label="電話" hint="留空則不公開">
            <TextInput value={p.phone} onChange={(v) => setP({ phone: v })} />
          </Field>
          <Field label="GitHub 連結">
            <TextInput value={p.githubUrl} onChange={(v) => setP({ githubUrl: v })} placeholder="https://github.com/..." />
          </Field>
          <Field label="LinkedIn 連結">
            <TextInput value={p.linkedinUrl} onChange={(v) => setP({ linkedinUrl: v })} placeholder="https://linkedin.com/in/..." />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="形象圖片" description="三張圖分別用在不同位置。">
        <div className="grid gap-4 md:grid-cols-3">
          <ImageField label="大頭照" hint="側欄與關於我" aspect="aspect-square" value={p.avatar} onChange={(v) => setP({ avatar: v })} />
          <ImageField label="首頁人像" hint="首頁右側去背人像，建議透明背景 PNG" aspect="aspect-[3/4]" value={p.heroImage} onChange={(v) => setP({ heroImage: v })} />
          <ImageField label="關於我橫幅" hint="關於我頁面頂部" value={p.aboutCover} onChange={(v) => setP({ aboutCover: v })} />
        </div>
      </SectionCard>

      <SectionCard title="SEO" description="搜尋結果與社群分享時顯示的資訊。">
        <LInput label="網站標題" value={site.seo.title} onChange={(v) => setSeo({ title: v })} />
        <LInput label="網站描述" value={site.seo.description} onChange={(v) => setSeo({ description: v })} multiline rows={3} />
        <ImageField label="分享圖 (OG Image)" hint="建議尺寸 1200×630" aspect="aspect-[1200/630]" value={site.seo.ogImage} onChange={(v) => setSeo({ ogImage: v })} />
      </SectionCard>
    </div>
  );
}
