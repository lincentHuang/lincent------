import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { ok, fail } from '../../../server/api';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  getAdminPassword,
  timingSafeEqual,
  verifySessionToken,
} from '../../../lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const authed = await verifySessionToken(cookies().get(SESSION_COOKIE)?.value);
  return ok({ authenticated: authed, passwordConfigured: !!process.env.ADMIN_PASSWORD });
}

export async function POST(req: NextRequest) {
  const expected = getAdminPassword();
  if (!expected) return fail('伺服器尚未設定 ADMIN_PASSWORD，後台登入已停用', 503);

  const { password } = await req.json().catch(() => ({ password: '' }));
  // 失敗時稍微延遲，降低暴力嘗試速度
  if (typeof password !== 'string' || !timingSafeEqual(password, expected)) {
    await new Promise((r) => setTimeout(r, 600));
    return fail('密碼錯誤，請重新輸入', 401);
  }

  cookies().set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return ok({ authenticated: true });
}

export async function DELETE() {
  cookies().delete(SESSION_COOKIE);
  return ok({ authenticated: false });
}
