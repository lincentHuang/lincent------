import { NextRequest } from 'next/server';
import { getDocument, mutate, normalizeProject } from '../../../../server/content-repo';
import { ok, fail, revalidateSite } from '../../../../server/api';
import type { Project } from '../../../../content/types';

export const dynamic = 'force-dynamic';

/** 後台：含草稿的全部作品，依排序 */
export async function GET() {
  const doc = await getDocument();
  return ok({ projects: [...doc.projects].sort((a, b) => a.order - b.order) });
}

/** 新增或更新（依 id upsert） */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Project | null;
  if (!body?.id || !body.title?.trim()) return fail('作品 ID 與標題為必填');
  if (!/^[a-z0-9-]+$/.test(body.id)) return fail('作品 ID 只能使用小寫英文、數字與連字號（會成為網址）');

  const projects = await mutate((doc) => {
    const idx = doc.projects.findIndex((p) => p.id === body.id);
    const order = idx >= 0 ? doc.projects[idx].order : Math.max(-1, ...doc.projects.map((p) => p.order)) + 1;
    const next = normalizeProject({ ...body, order: body.order ?? order, updatedAt: new Date().toISOString() });
    if (idx >= 0) doc.projects[idx] = next;
    else doc.projects.push(next);
    return [...doc.projects].sort((a, b) => a.order - b.order);
  });
  revalidateSite();
  return ok({ projects });
}
