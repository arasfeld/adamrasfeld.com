import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Adam Rasfeld - Full Stack Developer';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '40px',
          maxWidth: '1000px',
        }}
      >
        {/* Name */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          Adam Rasfeld
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '48px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '30px',
            fontWeight: '600',
          }}
        >
          Full Stack Developer
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '32px',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '40px',
            lineHeight: '1.4',
            maxWidth: '800px',
          }}
        >
          11+ years building scalable web applications, mobile apps, and system
          architectures
        </div>

        {/* Tech Stack */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          {['React', 'Node.js', 'TypeScript', 'Next.js'].map(tech => (
            <div
              key={tech}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '24px',
                fontWeight: '500',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom accent */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '8px',
          background:
            'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
        }}
      />
    </div>,
    {
      ...size,
    }
  );
}
