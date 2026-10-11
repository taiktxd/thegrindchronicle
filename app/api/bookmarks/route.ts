import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/bookmarks?slug=...&email=...
// Kiểm tra xem bài viết đã được lưu trên Supabase Database hay chưa
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const email = searchParams.get('email');

    if (!slug || !email) {
      return NextResponse.json({ isBookmarked: false });
    }

    if (!supabaseUrl || !supabaseKey) {
      console.warn('[BOOKMARK_GET_WARN]: Supabase credentials not found in environment.');
      return NextResponse.json({ isBookmarked: false });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanSlug = slug.trim();

    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_email', cleanEmail)
      .eq('post_slug', cleanSlug)
      .maybeSingle();

    if (error) {
      console.error('[BOOKMARK_GET_ERROR]:', error);
      return NextResponse.json({ isBookmarked: false });
    }

    return NextResponse.json({ isBookmarked: !!data });
  } catch (err) {
    console.error('[BOOKMARK_GET_EXCEPTION]:', err);
    return NextResponse.json({ isBookmarked: false });
  }
}

// POST /api/bookmarks
// Thêm hoặc xóa bài viết đã lưu trên Supabase Database
export async function POST(req: Request) {
  try {
    const { slug, email, action } = await req.json();

    if (!slug?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Missing slug or email' }, { status: 400 });
    }

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database service not configured' }, { status: 500 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanSlug = slug.trim();

    if (action === 'remove') {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_email', cleanEmail)
        .eq('post_slug', cleanSlug);

      if (error) {
        console.error('[BOOKMARK_DELETE_ERROR]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ isBookmarked: false });
    } else {
      // action === 'add'
      const { error } = await supabase
        .from('bookmarks')
        .upsert(
          {
            user_email: cleanEmail,
            post_slug: cleanSlug,
            created_at: new Date().toISOString(),
          },
          { onConflict: 'user_email,post_slug' }
        );

      if (error) {
        console.error('[BOOKMARK_UPSERT_ERROR]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ isBookmarked: true });
    }
  } catch (err) {
    console.error('[BOOKMARK_POST_EXCEPTION]:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}