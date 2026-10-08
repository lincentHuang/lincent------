import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from './lib/session';

// 後台 API 一律需要登入；/admin 頁面本身會自己顯示登入畫面
export async function middleware(req: NextRequest) {
  const ok = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!ok) {
    return NextResponse.json({ success: false, message: '請先登入後台' }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*', '/api/ai-translate', '/api/ai-generate'],
};
