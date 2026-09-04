'use client';

import React from 'react';
import {
  Layers,
  Shield,
  Radio,
  Sparkles,
  Cpu,
  Zap,
  Boxes,
  Globe,
} from 'lucide-react';
import { ProjectItem } from '../../../types';

export const ProjectBadgeIcon: React.FC<{ id: string; className?: string }> = ({
  id,
  className = 'w-5 h-5',
}) => {
  switch (id) {
    case 'cms-playground':
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
          <Layers className={className} />
        </div>
      );
    case 'kryptogo-official':
      return (
        <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
          <Shield className={className} />
        </div>
      );
    case 'vortex-audio':
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
          <Radio className={className} />
        </div>
      );
    case 'noodle-avatar':
      return (
        <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
          <Sparkles className={className} />
        </div>
      );
    case 'matrix-os':
      return (
        <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
          <Cpu className={className} />
        </div>
      );
    case 'nft-quiz-campaign':
      return (
        <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
          <Zap className={className} />
        </div>
      );
    case 'weifeng-industry':
      return (
        <div className="w-10 h-10 rounded-xl bg-slate-500/15 text-slate-300 flex items-center justify-center shrink-0 border border-slate-400/30">
          <Boxes className={className} />
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
          <Globe className={className} />
        </div>
      );
  }
};

export function getShortProjectTitle(p: ProjectItem, lang: 'zh' | 'en' = 'zh'): string {
  const full = lang === 'en' ? (p.titleEn || p.title) : p.title;
  return full.split('—')[0].split(' - ')[0].trim();
}
