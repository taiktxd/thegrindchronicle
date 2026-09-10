import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'The Grind Chronicle - Stories Behind Greatness';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '80px',
          textAlign: 'center',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 'bold', letterSpacing: '2px', marginBottom: 20 }}>
          THE GRIND CHRONICLE
        </div>
        <div style={{ fontSize: 28, fontStyle: 'italic', color: '#e67e22' }}>
          Stories Behind Greatness.
        </div>
      </div>
    ),
    { ...size }
  );
}