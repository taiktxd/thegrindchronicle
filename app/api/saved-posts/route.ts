import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

// GET: Kiểm tra xem email này đã lưu bài viết này trong Supabase chưa
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email')?.trim().toLowerCase();
  const slug = searchParams.get('slug');

  if (!email || !slug) {
    return NextResponse.json({ isSaved: false });
  }

  const { data } = await supabase
    .from('saved_posts')
    .select('id')
    .eq('user_email', email)
    .eq('post_slug', slug)
    .maybeSingle();

  return NextResponse.json({ isSaved: !!data });
}

// POST: Lưu hoặc hủy lưu bài viết trực tiếp trên Supabase
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, slug, title } = body;

    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !slug) {
      return NextResponse.json(
        { error: 'Email and post slug are required.' },
        { status: 400 }
      );
    }

    // 1. Kiểm tra bài viết đã có trong DB của email này chưa
    const { data: existing } = await supabase
      .from('saved_posts')
      .select('id')
      .eq('user_email', cleanEmail)
      .eq('post_slug', slug)
      .maybeSingle();

    if (existing) {
      // Nếu đã lưu => Hủy lưu (xóa khỏi Supabase)
      await supabase
        .from('saved_posts')
        .delete()
        .eq('id', existing.id);

      return NextResponse.json({ isSaved: false, message: 'Removed from saved stories.' });
    } else {
      // Nếu chưa lưu => Thêm bản ghi mới vào Supabase
      const { error: insertError } = await supabase
        .from('saved_posts')
        .insert([
          {
            user_email: cleanEmail,
            post_slug: slug,
            post_title: title || '',
          },
        ]);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ isSaved: true, message: 'Story saved to your account!' });
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}