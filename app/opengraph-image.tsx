import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/posts';

export const runtime = 'nodejs';
export const alt = 'The Grind Chronicle';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 48, fontWeight: 'bold' }}>
          THE GRIND CHRONICLE
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: '#0a0a0a', color: 'white', padding: 60, justifyContent: 'center'
      }}>
        <div style={{ fontSize: 56, fontWeight: 'bold', lineHeight: 1.1 }}>
          {post.title || 'The Grind Chronicle'}
        </div>
        <div style={{ fontSize: 24, color: '#e67e22', marginTop: 20 }}>
          THE GRIND CHRONICLE
        </div>
      </div>
    ),
    { ...size }
  );
}