import { NextRequest } from 'next/server';
import { findMediaUsages, getDocument, mutate } from '../../../../server/content-repo';
import { processUpload, UploadError } from '../../../../server/media';
import { ok, fail } from '../../../../server/api';

export const dynamic = 'force-dynamic';

/** 媒體庫列表（新到舊），附上每張圖被哪些地方使用 */
export async function GET() {
  const doc = await getDocument();
  const media = [...doc.media]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((m) => ({ ...m, usages: findMediaUsages(doc, m) }));
  return ok({ media });
}

/** 上傳單一檔案（前端逐檔送出才能顯示個別進度） */
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) return fail('沒有收到檔案');

  try {
    const item = await processUpload(file, String(form?.get('alt') || ''));
    await mutate((doc) => {
      doc.media.push(item);
    });
    return ok({ media: { ...item, usages: [] } });
  } catch (e) {
    if (e instanceof UploadError) return fail(e.message, 415);
    console.error('[media] upload failed', e);
    return fail('圖片處理失敗，請換一張或稍後再試', 500);
  }
}
