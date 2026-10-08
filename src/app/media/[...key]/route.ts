import { storage } from '../../../server/storage';

// 本機儲存模式下提供 data/media 的圖片（R2 模式圖片直接走 R2 公開網址）
export async function GET(_req: Request, { params }: { params: { key: string[] } }) {
  const name = params.key.join('/');
  if (!/^[a-z0-9-]+\.(webp|gif)$/.test(name)) return new Response('Not found', { status: 404 });
  const buf = await storage.get(`media/${name}`);
  if (!buf) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(buf), {
    headers: {
      'Content-Type': name.endsWith('.gif') ? 'image/gif' : 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
