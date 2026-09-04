'use client';

import React from 'react';
import { Terminal, Sparkles, Quote, ExternalLink } from 'lucide-react';

interface MarkdownRendererProps {
  content?: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content = '', className = '' }) => {
  if (!content) {
    return <p className="text-slate-400 italic text-sm">尚無詳細 Markdown 內容說明。</p>;
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
          <div key={`code-${index}`} className="my-6 rounded-2xl bg-[#121218] border border-slate-800 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.05] border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-slate-400 ml-2">{codeLanguage || 'code'}</span>
              </div>
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <pre className="p-4 sm:p-5 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
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
        <div key={`hr-${index}`} className="my-8 h-[1px] bg-slate-200" />
      );
      return;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${index}`} className="text-2xl sm:text-3xl font-sans font-bold text-[#121218] tracking-tight mt-8 mb-4">
          {line.slice(2)}
        </h1>
      );
      return;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${index}`} className="text-xl sm:text-2xl font-sans font-bold text-[#121218] tracking-tight mt-8 mb-4 flex items-center gap-2.5 border-b border-slate-200 pb-3">
          <Sparkles className="w-5 h-5 text-lime-600 shrink-0" />
          <span>{line.slice(3)}</span>
        </h2>
      );
      return;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${index}`} className="text-base sm:text-lg font-sans font-bold text-[#121218] tracking-tight mt-6 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#121218]" />
          <span>{line.slice(4)}</span>
        </h3>
      );
      return;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <div key={`quote-${index}`} className="my-5 p-5 rounded-2xl bg-slate-50 border-l-4 border-[#121218] text-slate-800 text-sm sm:text-base leading-relaxed shadow-xs flex items-start gap-3.5">
          <Quote className="w-5 h-5 text-[#121218] shrink-0 mt-0.5" />
          <div className="font-sans font-normal">{renderInlineMarkdown(line.slice(2))}</div>
        </div>
      );
      return;
    }

    // Bullet List
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={`li-${index}`} className="flex items-start gap-3 my-2 text-sm sm:text-base text-slate-700 leading-relaxed font-sans pl-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#121218] mt-2.5 shrink-0" />
          <div className="flex-1">{renderInlineMarkdown(line.slice(2))}</div>
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
        <div key={`img-${index}`} className="my-6 rounded-2xl overflow-hidden">
          <img src={src} alt={alt} className="w-full h-auto rounded-2xl object-cover max-h-[480px]" />
        </div>
      );
      return;
    }

    // Empty line
    if (!line.trim()) {
      elements.push(<div key={`space-${index}`} className="h-3" />);
      return;
    }

    // Regular paragraph (Clean, high-contrast, perfectly readable)
    elements.push(
      <p key={`p-${index}`} className="text-sm sm:text-base text-slate-700 leading-relaxed my-3 font-sans font-normal">
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
        <strong key={i} className="text-[#121218] font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-900 font-mono text-[12px] border border-slate-200">
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
          className="text-[#121218] hover:text-black font-semibold underline underline-offset-4 inline-flex items-center gap-0.5"
        >
          <span>{linkMatch[1]}</span>
          <ExternalLink className="w-3 h-3 inline" />
        </a>
      );
    }
    return part;
  });
}
