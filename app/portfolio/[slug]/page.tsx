import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SproutDetail } from '@/components/portfolio/sprout-detail';
import { getDetailSlugs, getProject } from '@/lib/portfolio-data';

const DETAIL_COMPONENTS: Record<string, () => React.ReactElement> = {
  sprout: SproutDetail,
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
  if (!project || !project.hasDetail) {
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

  if (!project || !project.hasDetail) {
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
