'use client';

import React, { useEffect, useState } from 'react';

export const AmbientBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('pointermove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base Canvas */}
      <div className="absolute inset-0 bg-[#07080B]" />

      {/* Perspective Grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Dynamic Morphing Aurora Gradients */}
      <div className="absolute -top-[20%] -left-[10%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-br from-cyan-500/15 via-purple-500/10 to-transparent blur-[120px] animate-aurora opacity-70" />
      <div
        className="absolute top-[35%] -right-[15%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-bl from-rose-500/12 via-amber-500/10 to-transparent blur-[140px] animate-aurora opacity-60"
        style={{ animationDelay: '-6s', animationDuration: '24s' }}
      />
      <div
        className="absolute bottom-[-10%] left-[20%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-transparent blur-[130px] animate-aurora opacity-50"
        style={{ animationDelay: '-12s', animationDuration: '20s' }}
      />

      {/* Interactive Mouse Follower Spotlight */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full transition-transform duration-300 ease-out opacity-25"
        style={{
          transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
          background: 'radial-gradient(circle, rgba(0,240,255,0.18) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)',
        }}
      />

      {/* Film Grain Texture */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
