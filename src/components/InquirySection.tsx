'use client';

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { inquiriesAtom } from '../store/atoms';
import confetti from 'canvas-confetti';
import {
  Send,
  Mail,
  Check,
  Sparkles,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import { resumeData } from '../data/resumeData';

export const InquirySection: React.FC = () => {
  const [, setInquiries] = useAtom(inquiriesAtom);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [scope, setScope] = useState('全職 - 資深前端工程師');
  const [budget, setBudget] = useState('月薪 80,000 ~ 100,000 元');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scopes = [
    '全職 - 資深前端工程師',
    '全職 - 前端架構師 / Lead',
    '專案合作 - Design System 建置',
    '專案合作 - 官網與活動頁開發',
    '顧問諮詢 - 效能與狀態優化',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          company,
          email,
          scope,
          budget,
          message,
        }),
      });

      const data = await res.json();
      if (data.success && data.inquiries) {
        setInquiries(data.inquiries);
      }

      // Fire confetti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00F0FF', '#8B5CF6', '#F59E0B', '#FF4D4D'],
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit inquiry', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inquiry-section" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-framer-coral mb-2">
          <Send className="w-3.5 h-3.5" />
          <span>CONTACT & INVITATION</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white">
          發送面試與合作邀請
        </h2>
        <p className="text-framer-subtext text-sm mt-1 max-w-xl">
          歡迎隨時填寫下方表單，您的訊息將即時送達獨立管理後台收件匣，我將於 24 小時內儘速回覆！
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl framer-glass shadow-framer-card">
          {isSubmitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-framer-emerald/20 text-framer-emerald flex items-center justify-center mx-auto border border-framer-emerald/30 shadow-framer-glow-emerald">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-display font-black text-white">
                邀請訊息已成功送出！
              </h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                非常感謝您的來信，該訊息已同步儲存於後台系統中，我將盡快與您聯繫。
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setName('');
                  setCompany('');
                  setEmail('');
                  setMessage('');
                }}
                className="px-6 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-bold text-white transition-colors"
              >
                發送另一則訊息
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    您的姓名 / 稱呼 *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="王主管 / Alex Chen"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-framer-cyan transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    公司 / 團隊名稱
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="NextGen Software Co."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-framer-cyan transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    電子郵件 (Email) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-framer-cyan transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    預算範圍 / 薪酬架構
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="月薪 80k~100k+ / 專案報價"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-framer-cyan transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  合作類型 / 職缺性質
                </label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08090C] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-framer-cyan transition-colors"
                >
                  {scopes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  邀請細節或想聊的內容
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="請簡單描述專案背景、團隊規模或職務亮點..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-framer-cyan transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-framer-cyan via-framer-violet to-framer-amber text-slate-950 font-display font-black text-sm uppercase tracking-wider shadow-framer-glow-cyan transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? '正在發送至後台...' : '確認送出邀請'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Direct Contacts (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-7 rounded-3xl framer-glass shadow-framer-card space-y-5">
            <h3 className="font-display font-black text-base text-framer-cyan">
              黃令成 (Lincent) • 聯繫資訊
            </h3>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <Mail className="w-4 h-4 text-framer-violet shrink-0" />
                <div>
                  <span className="text-[10px] text-framer-subtext block font-mono">電子郵件</span>
                  <a href={`mailto:${resumeData.contact.email}`} className="font-mono font-bold hover:underline text-white">
                    {resumeData.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <Phone className="w-4 h-4 text-framer-emerald shrink-0" />
                <div>
                  <span className="text-[10px] text-framer-subtext block font-mono">主要聯絡手機</span>
                  <span className="font-mono font-bold text-white">{resumeData.contact.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <MapPin className="w-4 h-4 text-framer-coral shrink-0" />
                <div>
                  <span className="text-[10px] text-framer-subtext block font-mono">通訊與工作地點</span>
                  <span className="text-white">{resumeData.contact.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <Calendar className="w-4 h-4 text-framer-amber shrink-0" />
                <div>
                  <span className="text-[10px] text-framer-subtext block font-mono">最快可到職日</span>
                  <span className="font-mono font-bold text-white">{resumeData.contact.availableDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
