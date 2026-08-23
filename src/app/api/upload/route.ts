import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: '未找到上傳檔案' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate safe clean filename with .webp extension
    const originalExt = path.extname(file.name);
    const cleanName = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${Date.now()}-${cleanName}.webp`;
    const filePath = path.join(uploadsDir, filename);

    let webpBuffer: Buffer;
    let originalSize = rawBuffer.length;

    // Convert to WebP format using sharp
    try {
      webpBuffer = await sharp(rawBuffer)
        .webp({ quality: 85, effort: 4 })
        .toBuffer();
    } catch (sharpErr) {
      console.warn('Sharp WebP conversion fallback:', sharpErr);
      webpBuffer = rawBuffer;
    }

    fs.writeFileSync(filePath, webpBuffer);

    const publicUrl = `/uploads/${filename}`;
    const base64 = `data:image/webp;base64,${webpBuffer.toString('base64')}`;
    const savedSize = webpBuffer.length;
    const compressionRatio = originalSize > 0 
      ? Math.round((1 - savedSize / originalSize) * 100) 
      : 0;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      base64,
      filename,
      originalFormat: originalExt,
      convertedFormat: 'webp',
      originalSize: `${(originalSize / 1024).toFixed(1)} KB`,
      optimizedSize: `${(savedSize / 1024).toFixed(1)} KB`,
      compressionRatio: `${compressionRatio}%`,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, message: '上傳失敗', error: error.message },
      { status: 500 }
    );
  }
}
