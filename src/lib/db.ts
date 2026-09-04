import { prisma } from './prisma';
import { ProjectItem, InquiryItem, SiteConfig, ModularCard } from '../types';
import { defaultSiteConfig, defaultModularCards } from '../data/defaults';
import fs from 'fs';
import path from 'path';

const storagePath = path.join(process.cwd(), 'src', 'data', 'storage.json');



function readFallbackStorage() {
  try {
    if (!fs.existsSync(storagePath)) return { projects: [], inquiries: [], config: defaultSiteConfig, cards: defaultModularCards };
    const raw = fs.readFileSync(storagePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { projects: [], inquiries: [], config: defaultSiteConfig, cards: defaultModularCards };
  }
}

function writeFallbackStorage(data: any) {
  try {
    fs.writeFileSync(storagePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write storage file:', e);
  }
}

// ==========================================
// 📢 SITE CONFIG OPERATIONS
// ==========================================

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { id: 'default' },
    });
    if (config) return config as unknown as SiteConfig;
  } catch (e) {
    console.warn('Prisma getSiteConfig fallback:', e);
  }
  const data = readFallbackStorage();
  return data.config || defaultSiteConfig;
}

export async function updateSiteConfig(payload: Partial<SiteConfig>): Promise<SiteConfig> {
  try {
    const updated = await prisma.siteConfig.upsert({
      where: { id: 'default' },
      update: payload as any,
      create: { ...defaultSiteConfig, ...payload, id: 'default' } as any,
    });
    return updated as unknown as SiteConfig;
  } catch (e) {
    console.warn('Prisma updateSiteConfig fallback:', e);
  }

  const data = readFallbackStorage();
  data.config = { ...defaultSiteConfig, ...data.config, ...payload };
  writeFallbackStorage(data);
  return data.config;
}

// ==========================================
// 🧩 MODULAR BENTO CARDS OPERATIONS
// ==========================================

export async function getModularCards(): Promise<ModularCard[]> {
  try {
    const cards = await prisma.modularCard.findMany({
      orderBy: { order: 'asc' },
    });
    if (cards && cards.length > 0) {
      return cards.map((c) => ({
        id: c.id,
        type: c.type as any,
        titleZh: c.titleZh,
        titleEn: c.titleEn,
        descZh: c.descZh,
        descEn: c.descEn,
        tagZh: c.tagZh || undefined,
        tagEn: c.tagEn || undefined,
        icon: c.icon || 'Code2',
        color: c.color || 'cyan',
        metricsValue: c.metricsValue || undefined,
        items: c.items ? JSON.parse(c.items) : [],
        order: c.order,
        isVisible: c.isVisible,
        createdAt: c.createdAt.toISOString(),
      }));
    }
  } catch (e) {
    console.warn('Prisma getModularCards fallback:', e);
  }

  const data = readFallbackStorage();
  return data.cards || defaultModularCards;
}

export async function saveModularCard(card: ModularCard): Promise<ModularCard[]> {
  try {
    const payload = {
      id: card.id || `card-${Date.now()}`,
      type: card.type || 'skill',
      titleZh: card.titleZh,
      titleEn: card.titleEn || card.titleZh,
      descZh: card.descZh,
      descEn: card.descEn || card.descZh,
      tagZh: card.tagZh || null,
      tagEn: card.tagEn || null,
      icon: card.icon || 'Code2',
      color: card.color || 'cyan',
      metricsValue: card.metricsValue || null,
      items: JSON.stringify(card.items || []),
      order: card.order ?? 0,
      isVisible: card.isVisible ?? true,
    };

    await prisma.modularCard.upsert({
      where: { id: payload.id },
      update: payload,
      create: payload,
    });
  } catch (e) {
    console.warn('Prisma saveModularCard fallback:', e);
  }

  const data = readFallbackStorage();
  data.cards = data.cards || defaultModularCards;
  const idx = data.cards.findIndex((c: ModularCard) => c.id === card.id);
  if (idx >= 0) {
    data.cards[idx] = card;
  } else {
    data.cards.push(card);
  }
  writeFallbackStorage(data);

  return getModularCards();
}

export async function deleteModularCard(id: string): Promise<ModularCard[]> {
  try {
    await prisma.modularCard.delete({ where: { id } });
  } catch (e) {
    console.warn('Prisma deleteModularCard fallback:', e);
  }

  const data = readFallbackStorage();
  data.cards = (data.cards || defaultModularCards).filter((c: ModularCard) => c.id !== id);
  writeFallbackStorage(data);

  return getModularCards();
}

// ==========================================
// 🗂️ PROJECTS DATABASE OPERATIONS
// ==========================================

export async function getAllProjects(): Promise<ProjectItem[]> {
  try {
    const dbProjects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (dbProjects && dbProjects.length > 0) {
      return dbProjects.map((p) => ({
        id: p.id,
        title: p.title,
        titleEn: p.titleEn || undefined,
        subtitle: p.subtitle || undefined,
        subtitleEn: p.subtitleEn || undefined,
        tag: p.tag,
        tagEn: p.tagEn || undefined,
        category: p.category,
        categoryEn: p.categoryEn || undefined,
        year: p.year,
        role: p.role,
        roleEn: p.roleEn || undefined,
        company: p.company,
        companyEn: p.companyEn || undefined,
        badge: p.badge || undefined,
        badgeEn: p.badgeEn || undefined,
        themeColor: p.themeColor as any,
        isNew: p.isNew,
        summary: p.summary,
        summaryEn: p.summaryEn || undefined,
        coverImage: p.coverImage || undefined,
        contentMd: p.contentMd || undefined,
        contentMdEn: p.contentMdEn || undefined,
        painPoints: typeof p.painPoints === 'string' ? JSON.parse(p.painPoints) : p.painPoints,
        painPointsEn: p.painPointsEn ? JSON.parse(p.painPointsEn) : [],
        techStack: typeof p.techStack === 'string' ? JSON.parse(p.techStack) : p.techStack,
        aiHighlights: typeof p.aiHighlights === 'string' ? JSON.parse(p.aiHighlights) : p.aiHighlights,
        metrics: typeof p.metrics === 'string' ? JSON.parse(p.metrics) : p.metrics,
        demoUrl: p.demoUrl || undefined,
        githubUrl: p.githubUrl || undefined,
      }));
    }
  } catch (err) {
    console.warn('Prisma DB query fallback:', err);
  }

  const data = readFallbackStorage();
  return data.projects || [];
}

export async function saveProject(project: ProjectItem): Promise<ProjectItem[]> {
  try {
    const payload = {
      id: project.id,
      title: project.title,
      titleEn: project.titleEn || null,
      subtitle: project.subtitle || '',
      subtitleEn: project.subtitleEn || null,
      tag: project.tag || '精選作品',
      tagEn: project.tagEn || 'Featured',
      category: project.category || 'Frontend Architecture',
      categoryEn: project.categoryEn || 'Frontend Architecture',
      year: project.year || '2026',
      role: project.role || '資深前端工程師',
      roleEn: project.roleEn || 'Senior Frontend Engineer',
      company: project.company || 'Lincent Studio',
      companyEn: project.companyEn || 'Lincent Studio',
      badge: project.badge || null,
      badgeEn: project.badgeEn || null,
      themeColor: project.themeColor || 'yellow',
      isNew: project.isNew ?? true,
      summary: project.summary || '',
      summaryEn: project.summaryEn || null,
      coverImage: project.coverImage || null,
      contentMd: project.contentMd || '',
      contentMdEn: project.contentMdEn || null,
      painPoints: JSON.stringify(project.painPoints || []),
      painPointsEn: JSON.stringify(project.painPointsEn || []),
      techStack: JSON.stringify(project.techStack || []),
      aiHighlights: JSON.stringify(project.aiHighlights || {}),
      aiHighlightsEn: JSON.stringify(project.aiHighlights || {}),
      metrics: JSON.stringify(project.metrics || []),
      demoUrl: project.demoUrl || null,
      githubUrl: project.githubUrl || null,
    };

    await prisma.project.upsert({
      where: { id: project.id },
      update: payload,
      create: payload,
    });
  } catch (err) {
    console.warn('Prisma DB upsert fallback:', err);
  }

  const data = readFallbackStorage();
  const index = data.projects.findIndex((p: ProjectItem) => p.id === project.id);
  if (index >= 0) {
    data.projects[index] = project;
  } else {
    data.projects.unshift(project);
  }
  writeFallbackStorage(data);

  return getAllProjects();
}

export async function deleteProject(id: string): Promise<ProjectItem[]> {
  try {
    await prisma.project.delete({ where: { id } });
  } catch (err) {
    console.warn('Prisma DB delete fallback:', err);
  }

  const data = readFallbackStorage();
  data.projects = data.projects.filter((p: ProjectItem) => p.id !== id);
  writeFallbackStorage(data);

  return getAllProjects();
}

// ==========================================
// 📥 INQUIRIES DATABASE OPERATIONS
// ==========================================

export async function getAllInquiries(): Promise<InquiryItem[]> {
  try {
    const dbInquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (dbInquiries && dbInquiries.length > 0) {
      return dbInquiries.map((inq) => ({
        id: inq.id,
        name: inq.name,
        company: inq.company || '',
        email: inq.email,
        scope: inq.scope,
        budget: inq.budget || '',
        message: inq.message,
        status: inq.status as any,
        createdAt: inq.createdAt.toISOString(),
      }));
    }
  } catch (err) {
    console.warn('Prisma DB inquiries fallback:', err);
  }

  const data = readFallbackStorage();
  return data.inquiries || [];
}

export async function createInquiry(payload: {
  name: string;
  company?: string;
  email: string;
  scope: string;
  budget?: string;
  message: string;
}): Promise<InquiryItem[]> {
  const newInq: InquiryItem = {
    id: `inq-${Date.now()}`,
    name: payload.name,
    company: payload.company || '',
    email: payload.email,
    scope: payload.scope,
    budget: payload.budget || '',
    message: payload.message,
    status: 'unread',
    createdAt: new Date().toISOString(),
  };

  try {
    await prisma.inquiry.create({
      data: {
        id: newInq.id,
        name: newInq.name,
        company: newInq.company || null,
        email: newInq.email,
        scope: newInq.scope,
        budget: newInq.budget || null,
        message: newInq.message,
        status: 'unread',
      },
    });
  } catch (err) {
    console.warn('Prisma DB create inquiry fallback:', err);
  }

  const data = readFallbackStorage();
  data.inquiries.unshift(newInq);
  writeFallbackStorage(data);

  return getAllInquiries();
}

export async function updateInquiryStatus(id: string, status: 'unread' | 'replied' | 'archived'): Promise<InquiryItem[]> {
  try {
    await prisma.inquiry.update({
      where: { id },
      data: { status },
    });
  } catch (err) {
    console.warn('Prisma DB update inquiry fallback:', err);
  }

  const data = readFallbackStorage();
  const found = data.inquiries.find((inq: InquiryItem) => inq.id === id);
  if (found) {
    found.status = status;
  }
  writeFallbackStorage(data);

  return getAllInquiries();
}

export async function deleteInquiry(id: string): Promise<InquiryItem[]> {
  try {
    await prisma.inquiry.delete({ where: { id } });
  } catch (err) {
    console.warn('Prisma DB delete inquiry fallback:', err);
  }

  const data = readFallbackStorage();
  data.inquiries = data.inquiries.filter((inq: InquiryItem) => inq.id !== id);
  writeFallbackStorage(data);

  return getAllInquiries();
}
