import 'server-only';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const ok = <T extends object>(data: T, init?: ResponseInit) =>
  NextResponse.json({ success: true, ...data }, init);

export const fail = (message: string, status = 400, extra: object = {}) =>
  NextResponse.json({ success: false, message, ...extra }, { status });

/** 後台任何內容變更後，讓前台所有頁面重新產生 */
export function revalidateSite() {
  revalidatePath('/', 'layout');
}
