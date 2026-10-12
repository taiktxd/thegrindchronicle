import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { postSlug, name, message, approved } = await req.json();

    if (!postSlug || !name?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Chặn độ dài cơ bản tránh spam
    if (name.length > 80 || message.length > 2000) {
      return NextResponse.json({ error: 'Content too long' }, { status: 400 });
    }

    // TÒA SOẠN THE GRIND CHRONICLE TRẢ LỜI: TỰ ĐỘNG DUYỆT NGAY LẬP TỨC
    const isAutoApproved =
      approved === true ||
      name.trim().toLowerCase() === 'the grind chronicle' ||
      name.trim().toLowerCase() === 'hoopsoul';

    const { error } = await supabaseAdmin.from('comments').insert({
      post_slug: postSlug,
      name: name.trim(),
      message: message.trim(),
      approved: isAutoApproved,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    // Không dùng : any, an toàn tuyệt đối với TypeScript & ESLint
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}