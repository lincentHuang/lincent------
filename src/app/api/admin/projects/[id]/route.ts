import { mutate } from '../../../../../server/content-repo';
import { ok, fail, revalidateSite } from '../../../../../server/api';

export const dynamic = 'force-dynamic';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const removed = await mutate((doc) => {
    const before = doc.projects.length;
    doc.projects = doc.projects.filter((p) => p.id !== params.id);
    return before !== doc.projects.length;
  });
  if (!removed) return fail('找不到這個作品', 404);
  revalidateSite();
  return ok({});
}
