import { NextRequest } from 'next/server';
import { getDocument, mutate } from '../../../../server/content-repo';
import { ok, fail, revalidateSite } from '../../../../server/api';
import type { SiteContent } from '../../../../content/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const doc = await getDocument();
  return ok({ site: doc.site, updatedAt: doc.updatedAt });
}

export async function PUT(req: NextRequest) {
  const site = (await req.json().catch(() => null)) as SiteContent | null;
  if (!site || typeof site !== 'object' || !site.profile || !site.hero || !site.sections) {
    return fail('網站內容格式不正確');
  }
  const saved = await mutate((doc) => {
    doc.site = site;
    return doc.site;
  });
  revalidateSite();
  return ok({ site: saved });
}
