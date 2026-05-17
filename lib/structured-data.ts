import type {
  AboutPage,
  CollectionPage,
  ContactPage,
  Person,
  WebPage,
  WebSite,
  WithContext,
} from 'schema-dts';

/**
 * Safely stringify JSON-LD data with XSS protection
 * Replaces < characters with unicode equivalent to prevent XSS attacks
 */
export function stringifyJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * Base person schema for Adam Rasfeld
 */
export const basePersonSchema: WithContext<Person> = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://adamrasfeld.com/#person',
  name: 'Adam Rasfeld',
  alternateName: 'Adam Rasfeld',
  url: 'https://adamrasfeld.com',
  image: 'https://adamrasfeld.com/opengraph-image',
  description:
    'Full Stack Developer with 11+ years of experience building scalable web applications, mobile apps, and system architectures.',
  jobTitle: 'Full Stack Developer',
  worksFor: {
    '@type': 'Organization',
    name: 'Freelance',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Cincinnati',
    addressRegion: 'OH',
    addressCountry: 'US',
  },
  email: 'arasfeld@gmail.com',
  telephone: '+1-513-746-0289',
  sameAs: [
    'https://github.com/arasfeld',
    'https://www.linkedin.com/in/adam-rasfeld',
  ],
  knowsAbout: [
    'React',
    'Node.js',
    'TypeScript',
    'Next.js',
    'JavaScript',
    'Full Stack Development',
    'Web Development',
    'Mobile App Development',
    'System Architecture',
    'API Development',
  ],
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Miami University',
    description: 'Bachelor of Science in Computer Science',
  },
};

/**
 * Website schema
 */
export const websiteSchema: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://adamrasfeld.com/#website',
  url: 'https://adamrasfeld.com',
  name: 'Adam Rasfeld - Full Stack Developer',
  description:
    'Portfolio of Adam Rasfeld, a Full Stack Developer specializing in React, Node.js, and TypeScript.',
  publisher: {
    '@id': 'https://adamrasfeld.com/#person',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://adamrasfeld.com/search?q={search_term_string}',
  },
};

/**
 * WebPage schema
 */
export const webpageSchema: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://adamrasfeld.com/#webpage',
  url: 'https://adamrasfeld.com',
  name: 'Adam Rasfeld - Full Stack Developer',
  isPartOf: {
    '@id': 'https://adamrasfeld.com/#website',
  },
  about: {
    '@id': 'https://adamrasfeld.com/#person',
  },
  description:
    'Full Stack Developer with 11+ years of experience building scalable web applications, mobile apps, and system architectures.',
};

/**
 * Root layout structured data combining all base schemas
 */
export const rootStructuredData = [
  basePersonSchema,
  websiteSchema,
  webpageSchema,
];

/**
 * Portfolio structured data
 */
import type { Project } from '@/types';

export function createPortfolioStructuredData(
  projects: Project[]
): WithContext<CollectionPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Adam Rasfeld Portfolio - Personal Projects',
    description:
      'A collection of projects showcasing full-stack development skills, modern technologies, and creative problem-solving.',
    url: 'https://adamrasfeld.com/portfolio',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((project, index) => {
        const detailUrl = project.hasDetail
          ? `https://adamrasfeld.com/portfolio/${project.id}`
          : null;
        return {
          '@type': 'SoftwareApplication',
          position: index + 1,
          name: project.title,
          description: project.description ?? project.tagline,
          url: detailUrl ?? project.live ?? project.github ?? undefined,
          applicationCategory: 'WebApplication',
          operatingSystem:
            project.type === 'mobile'
              ? 'iOS, Android'
              : project.type === 'desktop'
                ? 'macOS, Windows, Linux'
                : 'Web Browser',
          programmingLanguage: project.stack,
          dateCreated: project.year,
          author: {
            '@type': 'Person',
            name: 'Adam Rasfeld',
            url: 'https://adamrasfeld.com',
          },
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        };
      }),
    },
  };
}

/**
 * Resume structured data
 */
export const resumeStructuredData: WithContext<Person> = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Adam Rasfeld',
  jobTitle: 'Full Stack Developer',
  description:
    'Full Stack Developer with 11+ years of experience building scalable web applications, mobile apps, and system architectures.',
  url: 'https://adamrasfeld.com/resume',
  email: 'arasfeld@gmail.com',
  telephone: '+1-513-746-0289',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Cincinnati',
    addressRegion: 'OH',
    addressCountry: 'US',
  },
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Miami University',
    description: 'Bachelor of Science in Computer Science',
  },
  hasOccupation: [
    {
      '@type': 'Occupation',
      name: 'Software Engineer',
    },
  ],
  knowsAbout: [
    'React',
    'Svelte',
    'Node.js',
    'TypeScript',
    'JavaScript',
    'C#',
    '.NET',
    'Next.js',
    'Full Stack Development',
    'Web Development',
    'Mobile App Development',
    'System Architecture',
    'API Development',
  ],
  sameAs: [
    'https://github.com/arasfeld',
    'https://www.linkedin.com/in/adam-rasfeld',
  ],
};

/**
 * Contact page structured data
 */
export const contactStructuredData: WithContext<ContactPage> = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Adam Rasfeld - Full Stack Developer',
  description:
    'Get in touch with Adam Rasfeld for your next software development project. Available for freelance work, consulting, and full-time opportunities.',
  url: 'https://adamrasfeld.com/contact',
  mainEntity: {
    '@type': 'Person',
    name: 'Adam Rasfeld',
    jobTitle: 'Full Stack Developer',
    email: 'arasfeld@gmail.com',
    telephone: '+1-513-746-0289',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cincinnati',
      addressRegion: 'OH',
      addressCountry: 'US',
    },
    sameAs: [
      'https://github.com/arasfeld',
      'https://www.linkedin.com/in/adam-rasfeld',
    ],
    description:
      'Available for freelance work, consulting, and full-time opportunities in software development.',
  },
};

/**
 * About page structured data
 */
export const aboutStructuredData: WithContext<AboutPage> = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Adam Rasfeld - Full Stack Developer',
  description:
    'Learn about Adam Rasfeld, a passionate Full Stack Developer with 11+ years of experience. From Miami University to leading enterprise applications, discover his journey in software development.',
  url: 'https://adamrasfeld.com/about',
  mainEntity: {
    '@type': 'Person',
    name: 'Adam Rasfeld',
    jobTitle: 'Full Stack Developer',
    description:
      'Passionate Full Stack Developer with 11+ years of experience building scalable web applications, mobile apps, and system architectures.',
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Miami University',
      description: 'Bachelor of Science in Computer Science',
    },
    knowsAbout: [
      'React',
      'Node.js',
      'TypeScript',
      'JavaScript',
      'Next.js',
      'Full Stack Development',
      'Web Development',
      'Mobile App Development',
      'System Architecture',
      'API Development',
    ],
    sameAs: [
      'https://github.com/arasfeld',
      'https://www.linkedin.com/in/adam-rasfeld',
    ],
  },
};
