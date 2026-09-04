import { NextRequest, NextResponse } from 'next/server';
import { getSiteConfig, updateSiteConfig } from '../../../lib/db';

export async function GET() {
  try {
    const config = await getSiteConfig();
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config = await updateSiteConfig(body);
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
