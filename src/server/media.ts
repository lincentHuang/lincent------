import 'server-only';
import crypto from 'crypto';
import sharp from 'sharp';
import { storage } from './storage';
import type { MediaItem } from '../content/types';

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const FULL_MAX_EDGE = 2400;
const THUMB_MAX_WIDTH = 800;

const ACCEPTED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/heic', 'image/heif']);

export class UploadError extends Error {}

/**
 * 上傳圖片處理流程：
 * 1. 檢查格式與大小
 * 2. 依 EXIF 轉正 → 長邊縮到 2400px → WebP
 * 3. 另產 800px 小圖與 16px 模糊預覽
 * GIF 保留原檔（避免動畫被轉成靜態）
 */
export async function processUpload(file: File, alt = ''): Promise<MediaItem> {
  if (!ACCEPTED.has(file.type)) {
    throw new UploadError(`不支援的格式：${file.type || '未知'}（支援 JPG、PNG、WebP、AVIF、GIF、HEIC）`);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError(`檔案太大：${(file.size / 1024 / 1024).toFixed(1)}MB（上限 20MB）`);
  }

  const input = Buffer.from(await file.arrayBuffer());
  const id = `${Date.now().toString(36)}-${crypto.randomBytes(4).toString('hex')}`;
  const isGif = file.type === 'image/gif';

  let image: ReturnType<typeof sharp>;
  try {
    image = sharp(input, { animated: isGif }).rotate();
  } catch {
    throw new UploadError('無法讀取這張圖片，檔案可能已損毀');
  }

  const fullKey = `media/${id}.${isGif ? 'gif' : 'webp'}`;
  const thumbKey = `media/${id}-sm.webp`;

  const full = isGif
    ? { data: input, info: await sharp(input).metadata().then((m) => ({ width: m.width!, height: m.pageHeight || m.height! })) }
    : await image
        .clone()
        .resize({ width: FULL_MAX_EDGE, height: FULL_MAX_EDGE, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toBuffer({ resolveWithObject: true });

  const thumb = await sharp(input)
    .rotate()
    .resize({ width: THUMB_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toBuffer();

  const blur = await sharp(input).rotate().resize(16, 16, { fit: 'inside' }).webp({ quality: 40 }).toBuffer();

  await Promise.all([
    storage.put(fullKey, full.data, isGif ? 'image/gif' : 'image/webp'),
    storage.put(thumbKey, thumb, 'image/webp'),
  ]);

  return {
    id,
    url: storage.publicUrl(fullKey),
    thumbUrl: storage.publicUrl(thumbKey),
    width: full.info.width,
    height: full.info.height,
    blurDataUrl: `data:image/webp;base64,${blur.toString('base64')}`,
    bytes: full.data.length,
    originalName: file.name,
    alt,
    mime: isGif ? 'image/gif' : 'image/webp',
    createdAt: new Date().toISOString(),
  };
}

/** 從公開網址反推儲存 key（只刪得到媒體庫自己管理的檔案） */
export async function deleteMediaFiles(item: MediaItem) {
  const keys = [item.url, item.thumbUrl]
    .map((u) => {
      const i = u.indexOf('media/');
      return i >= 0 ? u.slice(i) : null;
    })
    .filter((k): k is string => !!k);
  await Promise.all([...new Set(keys)].map((k) => storage.remove(k)));
}
