// ==========================================
// 後台登入 session：HMAC 簽章的 httpOnly cookie
// 使用 Web Crypto，Edge middleware 與 Node route 都能驗證
// ==========================================
export const SESSION_COOKIE = 'lincent_admin';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 天

const DEV_FALLBACK_PASSWORD = 'admin';

export function getAdminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (pw) return pw;
  // 正式環境沒設密碼就關閉後台登入，避免用預設密碼上線
  return process.env.NODE_ENV === 'production' ? null : DEV_FALLBACK_PASSWORD;
}

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || `session:${getAdminPassword() ?? 'disabled'}`;
}

const enc = new TextEncoder();

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(getSecret()), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function createSessionToken(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `v1.${exp}`;
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !getAdminPassword()) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [v, exp, sig] = parts;
  if (Number(exp) < Date.now() / 1000) return false;
  const expected = await hmac(`${v}.${exp}`);
  return timingSafeEqual(sig, expected);
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
