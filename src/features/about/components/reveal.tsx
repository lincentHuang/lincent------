'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">{eyebrow}</span>
      <h2 id={id} className="mt-2 text-2xl sm:text-3xl font-sans font-bold tracking-tight text-[#121218]">
        {title}
      </h2>
    </div>
  );
}
