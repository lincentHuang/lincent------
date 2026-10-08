import { NextRequest } from 'next/server';
import { findMediaUsages, getDocument, mutate } from '../../../../../server/content-repo';
import { deleteMediaFiles } from '../../../../../server/media';
import { ok, fail } from '../../../../../server/api';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { alt } = await req.json().catch(() => ({ alt: undefined }));
  const item = await mutate((doc) => {
    const m = doc.media.find((x) => x.id === params.id);
    if (m && typeof alt === 'string') m.alt = alt;
    return m;
  });
  if (!item) return fail('找不到這張圖片', 404);
  return ok({ media: item });
}

/** 被使用中的圖片預設不能刪，避免前台破圖；?force=1 才強制刪除 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const force = req.nextUrl.searchParams.get('force') === '1';
  const doc = await getDocument();
  const item = doc.media.find((m) => m.id === params.id);
  if (!item) return fail('找不到這張圖片', 404);

  const usages = findMediaUsages(doc, item);
  if (usages.length && !force) {
    return fail('這張圖片仍在使用中，刪除會造成前台破圖', 409, { usages });
  }

  await mutate((d) => {
    d.media = d.media.filter((m) => m.id !== params.id);
  });
  await deleteMediaFiles(item).catch((e) => console.error('[media] delete files failed', e));
  return ok({});
}
