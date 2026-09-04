import { NextRequest, NextResponse } from 'next/server';
import { getModularCards, saveModularCard, deleteModularCard } from '../../../lib/db';

export async function GET() {
  try {
    const cards = await getModularCards();
    return NextResponse.json({ success: true, cards });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.titleZh) {
      return NextResponse.json({ success: false, message: '中文標題為必填' }, { status: 400 });
    }
    const cards = await saveModularCard(body);
    return NextResponse.json({ success: true, cards });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: '缺少卡片 ID' }, { status: 400 });
    }
    const cards = await deleteModularCard(id);
    return NextResponse.json({ success: true, cards });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
