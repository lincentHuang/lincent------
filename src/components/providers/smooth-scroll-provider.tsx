'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { SmoothScrollContextValue, ScrollToOptions } from '../../types';

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
  isReady: false,
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
  duration?: number;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({
  children,
  duration = 1.2,
}) => {
  const lenisRef = useRef<Lenis | null>(null);
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();

  // 1. Initialize Lenis Smooth Scroll
  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    try {
      const lenis = new Lenis({
        duration: prefersReducedMotion ? 0 : duration,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: !prefersReducedMotion,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.2,
        autoRaf: true,
        prevent: (node: HTMLElement) => {
          return Boolean(node.closest && node.closest('[data-lenis-prevent]'));
        },
      });

      lenisRef.current = lenis;
      setIsReady(true);

      // 2. Global Anchor Smooth Scroll Interceptor
      const handleAnchorClick = (e: MouseEvent) => {
        const target = (e.target as HTMLElement)?.closest?.('a');
        if (!target) return;

        const href = target.getAttribute('href');
        if (!href) return;

        let hash = '';
        const currentPath = window.location.pathname;

        if (href.startsWith('#') && href.length > 1) {
          hash = href;
        } else if (
          href.startsWith('/#') &&
          (currentPath === '/' || currentPath === '')
        ) {
          hash = href.replace('/', '');
        }

        if (hash && hash !== '#') {
          const targetEl = document.querySelector(hash);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl as HTMLElement, {
              offset: -32,
              duration: prefersReducedMotion ? 0 : duration,
            });
            window.history.pushState(null, '', hash);
          }
        }
      };

      document.addEventListener('click', handleAnchorClick, { passive: false });

      // Check initial hash in URL
      if (typeof window !== 'undefined' && window.location.hash) {
        const initialEl = document.querySelector(window.location.hash);
        if (initialEl) {
          setTimeout(() => {
            lenis.scrollTo(initialEl as HTMLElement, {
              offset: -32,
              duration: prefersReducedMotion ? 0 : duration,
            });
          }, 350);
        }
      }

      return () => {
        document.removeEventListener('click', handleAnchorClick);
        lenis.destroy();
        lenisRef.current = null;
        setIsReady(false);
      };
    } catch (err) {
      console.warn('SmoothScrollProvider: Failed to initialize Lenis, falling back to native scroll.', err);
    }
  }, [duration]);

  // 3. Reset scroll position on route transitions when no hash is present
  useEffect(() => {
    if (lenisRef.current && !window.location.hash) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  const scrollTo = useCallback((target: string | number | HTMLElement, options?: ScrollToOptions) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    } else if (typeof window !== 'undefined') {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  return (
    <SmoothScrollContext.Provider
      value={{
        scrollTo,
        stop,
        start,
        isReady,
      }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
};
