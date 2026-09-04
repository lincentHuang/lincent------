'use client';

import React, { useState } from 'react';
import { useI18n } from '../../../i18n';
import { submitInquiryAction } from '../server/actions';
import { Send, CheckCircle2, Mail, MapPin } from 'lucide-react';

export const InquirySection: React.FC = () => {
  const { t, isEn } = useI18n();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [scope, setScope] = useState('Full-time / 全職');
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
          setErrorMessage(firstErr || (isEn ? 'Submission failed. Please check form fields.' : '提交失敗，請檢查欄位格式'));
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || (isEn ? 'Failed to send. Please try again later.' : '傳送失敗，請稍後再試'));
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
              {t.contact.tag}
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-slate-900 leading-[1.1]">
              {t.contact.titlePrefix} <br />
              <span className="font-serif italic font-normal text-slate-800">{t.contact.titleItalic}</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {t.contact.subtitle}
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-800" />
                <span className="text-slate-800 font-semibold">lincent.work@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-lime-600" />
                <span>Taipei, Taiwan • {isEn ? 'Available for projects' : '可隨時到職'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form (7 Cols) */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="p-8 rounded-2xl bg-lime-50 border border-lime-300 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-lime-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">
                  {t.contact.successTitle}
                </h3>
                <p className="text-xs text-slate-600">
                  {t.contact.successDesc}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2 rounded-full bg-white text-xs font-semibold text-slate-800 border border-slate-200 shadow-xs hover:bg-slate-50"
                >
                  {t.contact.sendAnother}
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
                      {t.contact.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.contact.namePlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">
                      {t.contact.companyLabel}
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={t.contact.companyPlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    {t.contact.emailLabel}
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
                    {t.contact.scopeLabel}
                  </label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white transition-all"
                  >
                    <option value={t.contact.scopeOptions.fulltime}>
                      {t.contact.scopeOptions.fulltime}
                    </option>
                    <option value={t.contact.scopeOptions.consulting}>
                      {t.contact.scopeOptions.consulting}
                    </option>
                    <option value={t.contact.scopeOptions.project}>
                      {t.contact.scopeOptions.project}
                    </option>
                    <option value={t.contact.scopeOptions.general}>
                      {t.contact.scopeOptions.general}
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    {t.contact.messageLabel}
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.contact.messagePlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#121218] text-white font-semibold text-xs hover:bg-black transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? t.contact.submitting : t.contact.submitBtn}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
