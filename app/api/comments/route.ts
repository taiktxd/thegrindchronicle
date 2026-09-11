import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { postSlug, name, message } = await req.json();

    if (!postSlug || !name?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Giới hạn độ dài cơ bản để chặn spam thô
    if (name.length > 80 || message.length > 2000) {
      return NextResponse.json({ error: 'Content too long' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('comments').insert({
      post_slug: postSlug,
      name: name.trim(),
      message: message.trim(),
      approved: false, // chờ bạn duyệt trong Supabase Table Editor
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}