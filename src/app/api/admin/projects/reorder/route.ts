import { NextRequest } from 'next/server';
import { mutate } from '../../../../../server/content-repo';
import { ok, fail, revalidateSite } from '../../../../../server/api';

export const dynamic = 'force-dynamic';

/** body: { ids: string[] } 依陣列順序重新編號 */
export async function POST(req: NextRequest) {
  const { ids } = await req.json().catch(() => ({ ids: null }));
  if (!Array.isArray(ids)) return fail('缺少排序清單');
  const projects = await mutate((doc) => {
    for (const p of doc.projects) {
      const i = ids.indexOf(p.id);
      p.order = i >= 0 ? i : ids.length + p.order;
    }
    return [...doc.projects].sort((a, b) => a.order - b.order);
  });
  revalidateSite();
  return ok({ projects });
}
