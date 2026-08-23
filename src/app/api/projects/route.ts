import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, saveProject, deleteProject } from '../../../lib/db';

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newProject = await request.json();
    if (!newProject.id || !newProject.title) {
      return NextResponse.json({ success: false, message: 'ID 與 Title 為必填' }, { status: 400 });
    }

    const projects = await saveProject(newProject);
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: '缺少專案 ID' }, { status: 400 });
    }

    const projects = await deleteProject(id);
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
