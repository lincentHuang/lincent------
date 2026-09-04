'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { langAtom, siteConfigAtom } from '../../../store/atoms';
import { ArrowUpRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [lang] = useAtom(langAtom);
  const [config] = useAtom(siteConfigAtom);

  return (
    <section className="pt-2 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Giant Rounded Hero Bento Container */}
      <div className="rounded-[32px] sm:rounded-[44px] bg-gradient-to-b from-[#E7E9EC] via-[#EEF0F3] to-[#E4E6EA] border border-[#D5D9E0] overflow-hidden relative p-8 sm:p-12 lg:p-16 min-h-[580px] lg:min-h-[640px] flex flex-col justify-between shadow-portfolio-card">
        {/* Background Subtle Noise / Mesh Gradient */}
        <div className="absolute inset-0 bg-radial-gradient from-white/60 via-transparent to-transparent pointer-events-none" />

        {/* Top & Left Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-20">
          <div className="lg:col-span-7 space-y-7 max-w-2xl">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-[#121218] leading-[1.06]">
              {lang === 'en' ? (
                <>
                  Craft better <br />
                  brands, <span className="font-serif italic font-normal text-slate-400">faster</span>
                </>
              ) : (
                <>
                  以現代架構打造 <br />
                  頂級品牌，<span className="font-serif italic font-normal text-slate-400">更高效</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-lg">
              {lang === 'en'
                ? 'I design refined brands, websites, and interfaces for ambitious founders and creative teams.'
                : '專注於打造優雅的數位品牌、現代前端架構與極致效能體驗，賦能雄心勃勃的團隊與創作者。'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Button 1: View Projects */}
              <a
                href="#projects"
                className="relative group overflow-hidden rounded-full px-7 py-3.5 bg-[#121218] text-white text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center min-w-[140px] active:scale-95"
              >
                {/* Dynamic animated glow background */}
                <div
                  className="absolute inset-0 bg-[url('/images/button-glow.gif')] bg-cover bg-center opacity-85 mix-blend-screen group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 pointer-events-none"
                />
                <span className="relative z-10 font-medium tracking-wide">
                  {lang === 'en' ? 'View projects' : '瀏覽精選作品'}
                </span>
              </a>

              {/* Button 2: Get in touch */}
              <a
                href="#contact"
                className="rounded-full px-6 py-3.5 bg-white/70 hover:bg-white text-slate-800 border border-slate-300/80 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-xs"
              >
                {lang === 'en' ? 'Get in touch' : '聯繫諮詢'}
              </a>
            </div>
          </div>
        </div>

        {/* Right Side Portrait Cutout (Desktop) */}
        <div className="hidden lg:block absolute right-0 bottom-0 top-0 w-[46%] pointer-events-none z-10">
          <img
            src="/images/hero-portrait.png"
            alt="Lincent Portrait"
            className="w-full h-full object-contain object-bottom select-none"
          />
        </div>

        {/* Mobile / Tablet Portrait Cutout */}
        <div className="lg:hidden flex justify-center -mb-8 pt-2 relative z-10 pointer-events-none">
          <div className="relative [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]">
            <img
              src="/images/hero-portrait.png"
              alt="Lincent Portrait"
              className="h-60 sm:h-72 object-contain select-none"
            />
          </div>
        </div>

        {/* Floating Frosted Glass Capsule (Bottom Right of Hero) */}
        <div className="hidden sm:flex absolute bottom-8 right-8 z-30 p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 text-white max-w-[340px] shadow-2xl items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-300 font-mono block">
              {lang === 'en' ? 'Select project' : '專案預約'}
            </span>
            <h4 className="text-sm font-bold text-white leading-tight">
              {lang === 'en' ? 'Available for projects' : '可承接全職與專案合作'}
            </h4>
            <p className="text-[11px] text-slate-300 leading-tight">
              {lang === 'en'
                ? 'Share a few details, and I will get back with a clear direction.'
                : '簡述您的需求，我將在 24 小時內回覆明確方案。'}
            </p>
          </div>
          <a
            href="#contact"
            className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center shrink-0 hover:scale-110 transition-transform shadow-md"
            title="Get in touch"
          >
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>

        {/* Bottom Left Stats Row */}
        <div className="pt-12 sm:pt-16 mt-8 relative z-20 flex flex-wrap gap-8 sm:gap-14 border-t border-slate-300/60 max-w-xl">
          <div className="space-y-0.5">
            <span className="font-sans font-bold text-2xl sm:text-3xl text-[#121218] block">
              30+
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'en' ? 'Projects completed' : '專案交付'}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="font-sans font-bold text-2xl sm:text-3xl text-[#121218] block">
              8yr
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'en' ? 'Experience' : '專業經歷'}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="font-sans font-bold text-2xl sm:text-3xl text-[#121218] block">
              40+
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'en' ? 'Happy clients' : '合作團隊與夥伴'}
            </span>
          </div>
        </div>
      </div>

      {/* Client Logos / Tech Stack Marquee */}
      <div className="pt-14 pb-4 px-4 flex flex-wrap items-center justify-between gap-6 sm:gap-10 opacity-70 hover:opacity-100 transition-opacity">
        {[
          { name: 'Landify', icon: '🔷' },
          { name: 'Flexify', icon: '🔳' },
          { name: 'Codify', icon: '💠' },
          { name: 'Flowboard', icon: '🔹' },
          { name: 'Agentify', icon: '🔺' },
          { name: 'TodoFusion', icon: '◼️' },
          { name: 'Identity', icon: '✳️' },
        ].map((brand) => (
          <div
            key={brand.name}
            className="flex items-center gap-2 text-sm font-sans font-bold text-slate-800 grayscale hover:grayscale-0 transition-all cursor-default"
          >
            <span className="text-xs">{brand.icon}</span>
            <span>{brand.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
