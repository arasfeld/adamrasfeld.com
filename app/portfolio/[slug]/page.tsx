import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FluxDetail } from '@/components/portfolio/flux-detail';
import { FreeboxDetail } from '@/components/portfolio/freebox-detail';
import { JoyceDetail } from '@/components/portfolio/joyce-detail';
import { MapGameDetail } from '@/components/portfolio/map-game-detail';
import { RazzifyDetail } from '@/components/portfolio/razzify-detail';
import { SproutDetail } from '@/components/portfolio/sprout-detail';
import { getDetailSlugs, getProject } from '@/lib/portfolio-data';

const DETAIL_COMPONENTS: Record<string, () => React.ReactElement> = {
  sprout: SproutDetail,
  freebox: FreeboxDetail,
  razzify: RazzifyDetail,
  'joyce-art-studio': JoyceDetail,
  flux: FluxDetail,
  'map-game': MapGameDetail,
};

export function generateStaticParams() {
  return getDetailSlugs().map(slug => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.hasDetail) {
    return { title: 'Project Not Found' };
  }

  const url = `https://adamrasfeld.com/portfolio/${project.id}`;
  return {
    title: `${project.title} - Adam Rasfeld`,
    description: project.description ?? project.tagline,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} - Adam Rasfeld`,
      description: project.description ?? project.tagline,
      url,
    },
    twitter: {
      title: `${project.title} - Adam Rasfeld`,
      description: project.description ?? project.tagline,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project?.hasDetail) {
    notFound();
  }

  const Detail = DETAIL_COMPONENTS[slug];
  if (!Detail) notFound();

  return (
    <div className="min-h-screen">
      <Detail />
    </div>
  );
}
