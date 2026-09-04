import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma Database Seeding for Supabase/PostgreSQL...');

  // 1. Seed SiteConfig
  await prisma.siteConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      heroTitleZh: 'CRAFTING DIGITAL EXPERIENCES WITH MODERN ARCHITECTURE.',
      heroTitleEn: 'CRAFTING DIGITAL EXPERIENCES WITH MODERN ARCHITECTURE.',
      heroSubtitleZh: '資深前端架構師 • 黃令成 (Lincent)',
      heroSubtitleEn: 'Senior Frontend Architect & Product Engineer • Lincent Huang',
      bioZh: '專注於現代前端架構、極致效能優化與細緻互動體驗設計。深耕 Monorepo 模組化、原子狀態管理與 Design System，讓產品兼具工程嚴謹與視覺美學。',
      bioEn: 'Specializing in modern frontend architecture, extreme performance optimization, and interactive experiences. Deep expertise in Monorepos, atomic state management, and enterprise Design Systems.',
      statusTagZh: '可隨時到職 • 接受全職 / 專案合作',
      statusTagEn: 'Available for Full-time & Project Opportunities',
      yearsOfExp: '5+ Years',
      uiComponentsCount: '80+ UI',
      lighthouseScore: '99 / 100',
      locationZh: '台灣台北 • 支援遠端',
      locationEn: 'Taipei, Taiwan • Remote Friendly',
      email: 'lincent.work@gmail.com',
    },
  });
  console.log('✓ Seeded SiteConfig');

  // 2. Seed Modular Cards
  const cards = [
    {
      id: 'card-arch',
      type: 'skill',
      titleZh: '前端架構與狀態治理',
      titleEn: 'Frontend Architecture & State',
      descZh: '精通 Turborepo Monorepo、Jotai 原子狀態與 Optics-TS 光學變換，解決超大型專案重複開發與狀態卡頓。',
      descEn: 'Mastery in Turborepo monorepos, Jotai fine-grained atomic state, and Optics-TS optics transformation for high scalability.',
      tagZh: '核心優勢',
      tagEn: 'Core Focus',
      icon: 'Layers',
      color: 'cyan',
      order: 1,
      isVisible: true,
    },
    {
      id: 'card-design-system',
      type: 'skill',
      titleZh: '企業級 Design System',
      titleEn: 'Enterprise Design System',
      descZh: '基於 Radix UI 與 Storybook 打造無障礙 (a11y) 元件庫，建立團隊單一真理源，提升 40% 交付效率。',
      descEn: 'Architecting a11y-compliant, headless UI component libraries with Radix UI and Storybook as single source of truth.',
      tagZh: '設計工程化',
      tagEn: 'Engineering',
      icon: 'Layout',
      color: 'violet',
      order: 2,
      isVisible: true,
    },
    {
      id: 'card-tools',
      type: 'tool',
      titleZh: '現代技術工具箱',
      titleEn: 'Modern Tech Stack & Tools',
      descZh: '日常深耕與熟練運用的核心開發工具、語言與雲端服務。',
      descEn: 'Daily driver tools, modern frameworks, and cloud infrastructure for fast production delivery.',
      items: JSON.stringify(['Next.js 14', 'React 18', 'TypeScript', 'Jotai', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Prisma', 'Figma', 'Turborepo']),
      icon: 'Cpu',
      color: 'emerald',
      order: 3,
      isVisible: true,
    },
    {
      id: 'card-services',
      type: 'service',
      titleZh: '專業服務與合作項目',
      titleEn: 'Services & Collaboration',
      descZh: '從 0 到 1 產品全端架構、Core Web Vitals 極致效能調優、現代設計系統導入與技術顧問諮詢。',
      descEn: '0-to-1 Fullstack Architecture, Core Web Vitals optimization, Design System rollout, and Technical Consulting.',
      tagZh: '服務範圍',
      tagEn: 'Services',
      icon: 'Zap',
      color: 'amber',
      order: 4,
      isVisible: true,
    },
  ];

  for (const c of cards) {
    await prisma.modularCard.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    });
  }
  console.log('✓ Seeded 4 ModularCards');

  // 3. Seed projects from storage.json
  const storagePath = path.join(process.cwd(), 'src/data/storage.json');
  if (fs.existsSync(storagePath)) {
    const raw = fs.readFileSync(storagePath, 'utf-8');
    const { projects = [], inquiries = [] } = JSON.parse(raw);

    for (const p of projects) {
      const payload = {
        id: p.id,
        title: p.title,
        titleEn: p.titleEn || p.title,
        subtitle: p.subtitle || '',
        subtitleEn: p.subtitleEn || p.subtitle || '',
        tag: p.tag || '精選作品',
        tagEn: p.tagEn || 'Featured',
        category: p.category || 'Frontend Architecture',
        categoryEn: p.categoryEn || 'Frontend Architecture',
        year: p.year || '2026',
        role: p.role || '資深前端工程師',
        roleEn: p.roleEn || 'Senior Frontend Engineer',
        company: p.company || 'Lincent Studio',
        companyEn: p.companyEn || 'Lincent Studio',
        badge: p.badge || null,
        badgeEn: p.badgeEn || null,
        themeColor: p.themeColor || 'yellow',
        isNew: p.isNew ?? true,
        summary: p.summary || '',
        summaryEn: p.summaryEn || p.summary || '',
        coverImage: p.coverImage || null,
        contentMd: p.contentMd || '',
        contentMdEn: p.contentMdEn || null,
        painPoints: JSON.stringify(p.painPoints || []),
        painPointsEn: JSON.stringify(p.painPointsEn || []),
        techStack: JSON.stringify(p.techStack || []),
        aiHighlights: JSON.stringify(p.aiHighlights || {}),
        aiHighlightsEn: JSON.stringify(p.aiHighlightsEn || {}),
        metrics: JSON.stringify(p.metrics || []),
        demoUrl: p.demoUrl || null,
        githubUrl: p.githubUrl || null,
      };

      await prisma.project.upsert({
        where: { id: p.id },
        update: payload,
        create: payload,
      });
      console.log(`✓ Seeded project: ${p.title}`);
    }

    for (const inq of inquiries) {
      await prisma.inquiry.upsert({
        where: { id: inq.id },
        update: {
          name: inq.name,
          company: inq.company || null,
          email: inq.email,
          scope: inq.scope,
          budget: inq.budget || null,
          message: inq.message,
          status: inq.status || 'unread',
        },
        create: {
          id: inq.id,
          name: inq.name,
          company: inq.company || null,
          email: inq.email,
          scope: inq.scope,
          budget: inq.budget || null,
          message: inq.message,
          status: inq.status || 'unread',
        },
      });
    }
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
