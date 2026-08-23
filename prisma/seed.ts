import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma Database Seeding for Supabase/PostgreSQL...');

  const storagePath = path.join(process.cwd(), 'src/data/storage.json');
  if (!fs.existsSync(storagePath)) {
    console.log('No storage.json found, skipping seed.');
    return;
  }

  const raw = fs.readFileSync(storagePath, 'utf-8');
  const { projects = [], inquiries = [] } = JSON.parse(raw);

  // Seed projects
  for (const p of projects) {
    const payload = {
      id: p.id,
      title: p.title,
      subtitle: p.subtitle || '',
      tag: p.tag || '精選作品',
      category: p.category || 'Frontend Architecture',
      year: p.year || '2026',
      role: p.role || '資深前端工程師',
      company: p.company || 'Lincent Studio',
      badge: p.badge || null,
      themeColor: p.themeColor || 'yellow',
      isNew: p.isNew ?? true,
      summary: p.summary || '',
      coverImage: p.coverImage || null,
      contentMd: p.contentMd || '',
      painPoints: JSON.stringify(p.painPoints || []),
      techStack: JSON.stringify(p.techStack || []),
      aiHighlights: JSON.stringify(p.aiHighlights || {}),
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

  // Seed inquiries
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
    console.log(`✓ Seeded inquiry from: ${inq.name}`);
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
