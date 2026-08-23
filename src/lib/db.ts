import { prisma } from './prisma';
import { ProjectItem, InquiryItem } from '../store/atoms';
import fs from 'fs';
import path from 'path';

const storagePath = path.join(process.cwd(), 'src', 'data', 'storage.json');

// Helper to read fallback storage file
function readFallbackStorage() {
  try {
    if (!fs.existsSync(storagePath)) return { projects: [], inquiries: [] };
    const raw = fs.readFileSync(storagePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { projects: [], inquiries: [] };
  }
}

// Helper to write fallback storage file
function writeFallbackStorage(data: any) {
  try {
    fs.writeFileSync(storagePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write storage file:', e);
  }
}

// ==========================================
// 🚀 PROJECTS DATABASE OPERATIONS
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
        subtitle: p.subtitle,
        tag: p.tag,
        category: p.category,
        year: p.year,
        role: p.role,
        company: p.company,
        badge: p.badge || undefined,
        themeColor: p.themeColor as any,
        isNew: p.isNew,
        summary: p.summary,
        coverImage: p.coverImage || undefined,
        contentMd: p.contentMd || undefined,
        painPoints: typeof p.painPoints === 'string' ? JSON.parse(p.painPoints) : p.painPoints,
        techStack: typeof p.techStack === 'string' ? JSON.parse(p.techStack) : p.techStack,
        aiHighlights: typeof p.aiHighlights === 'string' ? JSON.parse(p.aiHighlights) : p.aiHighlights,
        metrics: typeof p.metrics === 'string' ? JSON.parse(p.metrics) : p.metrics,
        demoUrl: p.demoUrl || undefined,
        githubUrl: p.githubUrl || undefined,
      }));
    }
  } catch (err) {
    console.warn('Prisma DB query fallback to local storage:', err);
  }

  // Fallback to storage.json
  const data = readFallbackStorage();
  return data.projects || [];
}

export async function saveProject(project: ProjectItem): Promise<ProjectItem[]> {
  try {
    const payload = {
      id: project.id,
      title: project.title,
      subtitle: project.subtitle || '',
      tag: project.tag || '精選作品',
      category: project.category || 'Frontend Architecture',
      year: project.year || '2026',
      role: project.role || '資深前端工程師',
      company: project.company || 'Lincent Studio',
      badge: project.badge || null,
      themeColor: project.themeColor || 'yellow',
      isNew: project.isNew ?? true,
      summary: project.summary || '',
      coverImage: project.coverImage || null,
      contentMd: project.contentMd || '',
      painPoints: JSON.stringify(project.painPoints || []),
      techStack: JSON.stringify(project.techStack || []),
      aiHighlights: JSON.stringify(project.aiHighlights || {}),
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
    console.warn('Prisma DB upsert fallback to local storage:', err);
  }

  // Sync to fallback storage.json
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
