import { ImageResponse } from 'next/og';

export const alt = 'Jonas | Websites, SaaS & web apps';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        background: '#151515',
        backgroundImage:
          'radial-gradient(circle at 85% 15%, rgba(70, 166, 239, 0.35), transparent 55%)',
        color: '#eff2f5',
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 600 }}>Jonas</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: -2 }}>
          Websites, SaaS & web apps
        </div>
        <div style={{ fontSize: 32, color: '#888d92' }}>
          Independent design and development, from idea to launch.
        </div>
      </div>
      <div style={{ fontSize: 28, color: '#46a6ef' }}>jonasinfocus.com</div>
    </div>,
    size,
  );
}
