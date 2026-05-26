import { ImageResponse } from 'next/og';
import { LOGO_PATH_D } from '@/lib/brand';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#21252b',
      }}
    >
      <svg
        width="108"
        height="108"
        viewBox="0 0 420 420"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#61afef" />
            <stop offset="1" stopColor="#c678dd" />
          </linearGradient>
        </defs>
        <path fill="url(#g)" d={LOGO_PATH_D} />
      </svg>
    </div>,
    { ...size }
  );
}
