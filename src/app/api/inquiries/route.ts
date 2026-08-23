import { NextRequest, NextResponse } from 'next/server';
import {
  getAllInquiries,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry,
} from '../../../lib/db';

export async function GET() {
  try {
    const inquiries = await getAllInquiries();
    return NextResponse.json({ success: true, inquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, company, email, scope, budget, message } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ success: false, message: '姓名與 Email 為必填' }, { status: 400 });
    }

    const inquiries = await createInquiry({
      name,
      company,
      email,
      scope: scope || '全職 - 資深前端工程師',
      budget,
      message: message || '',
    });

    return NextResponse.json({ success: true, inquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ success: false, message: '缺少 ID 或 Status' }, { status: 400 });
    }

    const inquiries = await updateInquiryStatus(id, status);
    return NextResponse.json({ success: true, inquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少邀請 ID' }, { status: 400 });
    }

    const inquiries = await deleteInquiry(id);
    return NextResponse.json({ success: true, inquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
