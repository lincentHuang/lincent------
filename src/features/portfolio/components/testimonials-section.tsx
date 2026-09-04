'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { langAtom } from '../../../store/atoms';
import { Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [lang] = useAtom(langAtom);

  const testimonials = [
    {
      quoteZh: '與令成合作非常順暢。他對現代前端架構與 Design System 的掌握極為精準，讓團隊在短時間內突破了渲染與編譯效能瓶頸。',
      quoteEn: 'Working with Lincent was incredibly smooth. His mastery in modern architecture and Design Systems helped our team overcome complex state bottlenecks effortlessly.',
      author: 'Ethan Brooks',
      roleZh: 'Product Lead / 技術負責人',
      roleEn: 'Product Lead',
    },
    {
      quoteZh: '開發流程高度結構化且組織嚴密。每一個技術決策都經過深思熟慮，最終交付的產品在效能與視覺細節上都無可挑剔。',
      quoteEn: 'The process was thoughtful, fast, and highly organized. Every engineering decision felt intentional, resulting in an exceptionally polished web application.',
      author: 'Maya Chen',
      roleZh: 'Design Director / 設計總監',
      roleEn: 'Design Director',
    },
    {
      quoteZh: '他不僅能寫出高品質的程式碼，更能站在使用者體驗與商業價值的高度對齊產品。是少見兼具設計底蘊與架構深度的資深工程師。',
      quoteEn: 'He combines engineering rigor with aesthetic craft. A rare senior engineer who delivers both scalable code architecture and delightful UX.',
      author: 'Marcus Vance',
      roleZh: 'Founder & CEO',
      roleEn: 'Founder & CEO',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="space-y-3 mb-12">
        <div className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs">
          {lang === 'en' ? 'Testimonials' : '同行與團隊評價'}
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-slate-900">
          {lang === 'en' ? 'What teams say' : '值得信賴的工程交付評價'}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
          {lang === 'en'
            ? 'Thoughtful feedback from founders and teams who trusted the process, direction, and final result.'
            : '來自產品負責人、設計總監與技術團隊的真實協作反饋。'}
        </p>
      </div>

      {/* 3 Testimonial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="p-7 sm:p-8 portfolio-card flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                <Quote className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-normal leading-relaxed">
                "{lang === 'en' ? t.quoteEn : t.quoteZh}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#121218] text-white font-bold text-xs flex items-center justify-center">
                {t.author.charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t.author}</h4>
                <span className="text-[11px] text-slate-500 font-mono">
                  {lang === 'en' ? t.roleEn : t.roleZh}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
