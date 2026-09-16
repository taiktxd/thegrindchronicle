import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'The Grind Chronicle';
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
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 'bold' }}>THE GRIND CHRONICLE</div>
        <div style={{ fontSize: 28, color: '#e67e22', marginTop: 16 }}>
          Stories Behind Greatness.
        </div>
      </div>
    ),
    { ...size }
  );
}