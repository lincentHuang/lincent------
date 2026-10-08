import 'server-only';
import fs from 'fs/promises';
import path from 'path';
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// ==========================================
// 物件儲存：設定 R2 環境變數就用 Cloudflare R2，否則存本機 data/ 資料夾
// 內容 JSON 與圖片走同一個介面，換部署環境只需改環境變數
// ==========================================
export interface ObjectStorage {
  readonly kind: 'local' | 'r2';
  get(key: string): Promise<Buffer | null>;
  put(key: string, body: Buffer, contentType: string): Promise<void>;
  remove(key: string): Promise<void>;
  /** 公開網址（給 <img src>） */
  publicUrl(key: string): string;
}

const DATA_DIR = process.env.CONTENT_DATA_DIR || path.join(process.cwd(), 'data');

function safeJoin(key: string) {
  const full = path.resolve(DATA_DIR, key);
  if (!full.startsWith(path.resolve(DATA_DIR) + path.sep)) {
    throw new Error(`Invalid storage key: ${key}`);
  }
  return full;
}

class LocalStorage implements ObjectStorage {
  readonly kind = 'local' as const;

  async get(key: string) {
    try {
      return await fs.readFile(safeJoin(key));
    } catch (e: any) {
      if (e.code === 'ENOENT') return null;
      throw e;
    }
  }

  async put(key: string, body: Buffer) {
    const full = safeJoin(key);
    await fs.mkdir(path.dirname(full), { recursive: true });
    // 先寫暫存檔再改名，避免寫到一半當機留下壞掉的 JSON
    const tmp = `${full}.${process.pid}.tmp`;
    await fs.writeFile(tmp, body);
    await fs.rename(tmp, full);
  }

  async remove(key: string) {
    await fs.rm(safeJoin(key), { force: true });
  }

  publicUrl(key: string) {
    // 由 src/app/media/[...key]/route.ts 提供，build 後新增的檔案也讀得到
    return `/${key}`;
  }
}

class R2Storage implements ObjectStorage {
  readonly kind = 'r2' as const;
  private client: S3Client;

  constructor(
    accountId: string,
    accessKeyId: string,
    secretAccessKey: string,
    private bucket: string,
    private publicBase: string
  ) {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async get(key: string) {
    try {
      const res = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
      const bytes = await res.Body!.transformToByteArray();
      return Buffer.from(bytes);
    } catch (e: any) {
      if (e.name === 'NoSuchKey' || e.$metadata?.httpStatusCode === 404) return null;
      throw e;
    }
  }

  async put(key: string, body: Buffer, contentType: string) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: key.startsWith('media/') ? 'public, max-age=31536000, immutable' : 'no-cache',
      })
    );
  }

  async remove(key: string) {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  publicUrl(key: string) {
    return `${this.publicBase.replace(/\/$/, '')}/${key}`;
  }
}

function createStorage(): ObjectStorage {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL } = process.env;
  if (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET && R2_PUBLIC_URL) {
    return new R2Storage(R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL);
  }
  return new LocalStorage();
}

const g = globalThis as unknown as { __objectStorage?: ObjectStorage };
export const storage: ObjectStorage = g.__objectStorage ?? (g.__objectStorage = createStorage());
