import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import './globals.css';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { rootStructuredData, stringifyJsonLd } from '@/lib/structured-data';

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Adam Rasfeld - Full Stack Developer',
    template: '%s | Adam Rasfeld',
  },
  description:
    'Full Stack Developer with 8+ years of experience building scalable web applications, mobile apps, and system architectures. Specializing in React, Node.js, TypeScript, and modern web technologies.',
  keywords: [
    'Full Stack Developer',
    'React Developer',
    'Node.js Developer',
    'TypeScript Developer',
    'Web Development',
    'Mobile App Development',
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'System Architecture',
    'Cincinnati Developer',
    'Remote Developer',
  ],
  authors: [{ name: 'Adam Rasfeld', url: 'https://adamrasfeld.com' }],
  creator: 'Adam Rasfeld',
  publisher: 'Adam Rasfeld',
  metadataBase: new URL('https://adamrasfeld.com'),
  alternates: {
    canonical: 'https://adamrasfeld.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://adamrasfeld.com',
    title: 'Adam Rasfeld - Full Stack Developer',
    description:
      'Full Stack Developer with 8+ years of experience building scalable web applications, mobile apps, and system architectures.',
    siteName: 'Adam Rasfeld Portfolio',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Adam Rasfeld - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adam Rasfeld - Full Stack Developer',
    description:
      'Full Stack Developer with 8+ years of experience building scalable web applications, mobile apps, and system architectures.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '-R-KI3oaQCkFTCZykSq3Xrv3V3E0U6EBq5zrhuEktyo',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: stringifyJsonLd(rootStructuredData),
          }}
        />
      </head>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:border focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg"
          >
            Skip to content
          </a>
          <div className="flex h-full min-h-screen w-full flex-col">
            <Header />
            <main id="main-content" className="mx-auto w-full flex-auto">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            closeButton
            duration={4000}
            theme="system"
          />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
