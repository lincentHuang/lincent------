import type { Metadata } from 'next';
import './globals.css';
import { AmbientBackground } from '../components/layouts/ambient-background';

export const metadata: Metadata = {
  title: 'Lincent Huang | Senior Frontend Architect & Product Engineer',
  description: 'A premium portfolio showcasing modern frontend architecture, design systems, and high-performance web applications.',
  icons: {
    icon: '/images/lincent-logo.svg',
    apple: '/images/lincent-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Inter:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased text-[#121218] selection:text-[#121218]">
        {children}
      </body>
    </html>
  );
}
