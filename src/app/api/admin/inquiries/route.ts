import { NextRequest } from 'next/server';
import { getDocument, mutate } from '../../../../server/content-repo';
import { ok, fail } from '../../../../server/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  const doc = await getDocument();
  return ok({ inquiries: doc.inquiries });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json().catch(() => ({}));
  if (!id || !['unread', 'replied', 'archived'].includes(status)) return fail('缺少 ID 或狀態不正確');
  const inquiries = await mutate((doc) => {
    const found = doc.inquiries.find((i) => i.id === id);
    if (found) found.status = status;
    return doc.inquiries;
  });
  return ok({ inquiries });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return fail('缺少 ID');
  const inquiries = await mutate((doc) => {
    doc.inquiries = doc.inquiries.filter((i) => i.id !== id);
    return doc.inquiries;
  });
  return ok({ inquiries });
}
