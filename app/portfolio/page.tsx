import type { Metadata } from 'next';

import { ProjectCard } from '@/components/portfolio/project-card';
import { Comment, DisplayHeading } from '@/components/ui/typography';
import { PROJECTS } from '@/lib/portfolio-data';
import {
  createPortfolioStructuredData,
  stringifyJsonLd,
} from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Portfolio - Adam Rasfeld Projects',
  description:
    "Explore Adam Rasfeld's portfolio of full-stack development projects — Sprout childcare tracker, Freebox marketplace, Joyce Art Studio, Electron Spotify client, Vice habit tracker, Map Game, and Family Tree explorer.",
  keywords: [
    'Adam Rasfeld Portfolio',
    'Full Stack Projects',
    'React Projects',
    'Next.js Projects',
    'TypeScript Projects',
    'React Native Apps',
    'Mobile Development',
    'Electron Apps',
    'Sprout',
    'Freebox',
    'Joyce Art Studio',
  ],
  alternates: {
    canonical: 'https://adamrasfeld.com/portfolio',
  },
  openGraph: {
    title: 'Portfolio - Adam Rasfeld Projects',
    description:
      "Explore Adam Rasfeld's portfolio of full-stack development projects.",
    url: 'https://adamrasfeld.com/portfolio',
  },
  twitter: {
    title: 'Portfolio - Adam Rasfeld Projects',
    description:
      "Explore Adam Rasfeld's portfolio of full-stack development projects.",
  },
};

export default function Portfolio() {
  const structuredData = createPortfolioStructuredData(PROJECTS);

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(structuredData),
        }}
      />
      <div className="mx-auto w-full max-w-5xl px-6 py-20 md:px-12">
        {/* Hero */}
        <div className="ar-fade-up mb-12 [animation-delay:0.1s]">
          <Comment className="mb-2.5">portfolio</Comment>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <DisplayHeading className="[font-size:clamp(2.25rem,5vw,2.75rem)]">
              Personal Projects
            </DisplayHeading>
            <div className="pb-1 font-mono text-[10px] text-muted-foreground">
              {PROJECTS.length} projects
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="ar-fade-up grid grid-cols-1 gap-4 [animation-delay:0.25s] sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
