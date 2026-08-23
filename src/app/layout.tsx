import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '黃令成 (Lincent) — 資深前端工程師 ✕ 兼具設計底蘊與商業思維',
  description: '黃令成 (Lincent) 的個人作品集與履歷系統。5~6 年前端開發與 UI/UX 經驗，專注於 Monorepo 架構、Jotai 原子化狀態管理、Design System 與極致使用者體驗。',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="28" fill="%23FFD23F"/><text y="68" x="50" font-size="52" font-weight="900" font-family="sans-serif" text-anchor="middle" fill="%230F172A">L</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-accent-yellow selection:text-slate-950 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
