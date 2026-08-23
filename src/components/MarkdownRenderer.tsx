'use client';

import React from 'react';
import { Terminal, Sparkles, CheckCircle2, Quote, ArrowRight, ExternalLink } from 'lucide-react';

interface MarkdownRendererProps {
  content?: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content = '', className = '' }) => {
  if (!content) {
    return <p className="text-framer-subtext italic text-sm">尚無詳細 Markdown 內容說明。</p>;
  }

  // Parse lines
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLanguage = '';

  lines.forEach((line, index) => {
    // Code block open/close
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // Close code block
        elements.push(
          <div key={`code-${index}`} className="my-6 rounded-2xl bg-[#060709] border border-white/[0.1] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-framer-subtext ml-2">{codeLanguage || 'code'}</span>
              </div>
              <Terminal className="w-3.5 h-3.5 text-framer-subtext" />
            </div>
            <pre className="p-4 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push(
        <div key={`hr-${index}`} className="my-8 h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
      );
      return;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${index}`} className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight mt-8 mb-4">
          {line.slice(2)}
        </h1>
      );
      return;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${index}`} className="text-xl sm:text-2xl font-display font-black text-framer-cyan tracking-tight mt-8 mb-4 flex items-center gap-2.5 border-b border-white/[0.08] pb-3">
          <Sparkles className="w-5 h-5 text-framer-cyan shrink-0" />
          <span>{line.slice(3)}</span>
        </h2>
      );
      return;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${index}`} className="text-base sm:text-lg font-display font-bold text-white tracking-tight mt-6 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-framer-violet" />
          <span>{line.slice(4)}</span>
        </h3>
      );
      return;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <div key={`quote-${index}`} className="my-5 p-5 rounded-2xl bg-gradient-to-r from-framer-cyan/10 via-framer-violet/10 to-transparent border-l-4 border-framer-cyan text-slate-200 text-sm leading-relaxed shadow-framer-glow-cyan/10 flex items-start gap-3.5">
          <Quote className="w-5 h-5 text-framer-cyan shrink-0 mt-0.5" />
          <div className="font-sans">{renderInlineMarkdown(line.slice(2))}</div>
        </div>
      );
      return;
    }

    // Bullet List
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={`li-${index}`} className="flex items-start gap-3 my-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans pl-1">
          <div className="w-1.5 h-1.5 rounded-full bg-framer-amber mt-2 shrink-0" />
          <div>{renderInlineMarkdown(line.slice(2))}</div>
        </div>
      );
      return;
    }

    // Image
    const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const alt = imgMatch[1];
      const src = imgMatch[2];
      elements.push(
        <div key={`img-${index}`} className="my-6 rounded-3xl overflow-hidden framer-glass p-2 border border-white/[0.1]">
          <img src={src} alt={alt} className="w-full h-auto rounded-2xl object-cover max-h-[460px]" />
          {alt && <p className="text-center text-xs text-framer-subtext mt-2 font-mono">{alt}</p>}
        </div>
      );
      return;
    }

    // Empty line
    if (!line.trim()) {
      elements.push(<div key={`space-${index}`} className="h-2" />);
      return;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${index}`} className="text-xs sm:text-sm text-slate-300 leading-relaxed my-2.5 font-sans">
        {renderInlineMarkdown(line)}
      </p>
    );
  });

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
};

// Inline parser for bold, code, links
function renderInlineMarkdown(text: string): React.ReactNode {
  // Bold: **text**
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-white font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded-md bg-white/[0.06] text-framer-cyan font-mono text-[12px] border border-white/[0.08]">
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
          className="text-framer-cyan hover:underline font-bold inline-flex items-center gap-0.5"
        >
          <span>{linkMatch[1]}</span>
          <ExternalLink className="w-3 h-3 inline" />
        </a>
      );
    }
    return part;
  });
}
