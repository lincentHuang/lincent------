'use client';

import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { langAtom } from '../../../store/atoms';
import { submitInquiryAction } from '../server/actions';
import { Send, CheckCircle2, Mail, MapPin } from 'lucide-react';

export const InquirySection: React.FC = () => {
  const [lang] = useAtom(langAtom);

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [scope, setScope] = useState('全職 - 資深前端工程師 / 架構師');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await submitInquiryAction({
        name,
        company,
        email,
        scope,
        message,
      });

      if (res.success) {
        setSubmitted(true);
        setName('');
        setCompany('');
        setEmail('');
        setMessage('');
      } else {
        if (typeof res.error === 'string') {
          setErrorMessage(res.error);
        } else if (res.error) {
          const firstErr = Object.values(res.error).flat()[0];
          setErrorMessage(firstErr || '提交失敗，請檢查欄位格式');
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || '傳送失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
      <div className="p-8 sm:p-14 portfolio-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Intro (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
              {lang === 'en' ? 'Contact' : '聯繫洽談'}
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-slate-900 leading-[1.1]">
              {lang === 'en' ? (
                <>
                  Let's work <br />
                  <span className="font-serif italic font-normal text-slate-800">together</span>
                </>
              ) : (
                <>
                  開啟對話， <br />
                  <span className="font-serif italic font-normal text-slate-800">創造卓越產品</span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {lang === 'en'
                ? 'Share a few details about your team, project, or role, and I will get back with a clear direction within 24 hours.'
                : '無論是全職資深前端職缺、架構諮詢或專案合作，歡迎直接填寫表單或透過 Email 聯繫，我會在 24 小時內回覆。'}
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-800" />
                <span className="text-slate-800 font-semibold">lincent.work@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-lime-600" />
                <span>Taipei, Taiwan • {lang === 'en' ? 'Available for projects' : '可隨時到職'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form (7 Cols) */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="p-8 rounded-2xl bg-lime-50 border border-lime-300 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-lime-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">
                  {lang === 'en' ? 'Message Delivered!' : '訊息已成功送達！'}
                </h3>
                <p className="text-xs text-slate-600">
                  {lang === 'en' ? 'Thank you for reaching out. I will get back to you shortly.' : '感謝您的邀請，我已收到您的訊息，會盡快與您聯繫！'}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2 rounded-full bg-white text-xs font-semibold text-slate-800 border border-slate-200 shadow-xs hover:bg-slate-50"
                >
                  {lang === 'en' ? 'Send another note' : '發送另一則訊息'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    {errorMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">
                      {lang === 'en' ? 'Your Name *' : '您的姓名 *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'en' ? 'e.g. Alex Smith' : '例：林經理 / Alex'}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">
                      {lang === 'en' ? 'Company / Team' : '公司或團隊名稱'}
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={lang === 'en' ? 'e.g. Acme Inc.' : '例：Awesome Tech Inc.'}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    {lang === 'en' ? 'Email Address *' : '電子郵件 (Email) *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    {lang === 'en' ? 'Project Scope' : '合作性質'}
                  </label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white transition-all"
                  >
                    <option value="全職 - 資深前端工程師 / 架構師">
                      {lang === 'en' ? 'Full-time Senior Frontend / Architect' : '全職 - 資深前端工程師 / 架構師'}
                    </option>
                    <option value="技術顧問 / 架構諮詢">
                      {lang === 'en' ? 'Technical Consulting / Architecture Review' : '技術顧問 / 架構與效能諮詢'}
                    </option>
                    <option value="短期專案合作">
                      {lang === 'en' ? 'Project Collaboration / MVP Development' : '短期專案合作 / 產品 MVP 開發'}
                    </option>
                    <option value="其他洽談交流">
                      {lang === 'en' ? 'General Inquiry' : '其他洽談交流'}
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    {lang === 'en' ? 'Message' : '訊息內容 (Message)'}
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={lang === 'en' ? 'Tell me about your project goals or role...' : '請簡述您的團隊、專案需求或職缺資訊...'}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#121218] text-white font-semibold text-xs hover:bg-black transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? (lang === 'en' ? 'Sending...' : '正在發送...') : (lang === 'en' ? 'Get in touch →' : '送出邀請訊息 →')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
