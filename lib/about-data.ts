/**
 * Shared content for Adam Rasfeld — used by home, about, portfolio.
 * Mirrors the design prototype's `data.jsx`.
 */

export const ABOUT = {
  name: 'Adam Rasfeld',
  title: 'Full Stack Developer',
  location: 'Cincinnati, Ohio',
  email: 'arasfeld@gmail.com',
  github: 'https://github.com/arasfeld',
  linkedin: 'https://www.linkedin.com/in/adam-rasfeld',
  intro:
    'Full Stack Software Engineer with 11+ years building scalable web and mobile applications. I work across the entire stack — React, Svelte, Next.js, Node.js, .NET, gRPC, Kafka — and I care equally about systems that scale and interfaces that feel good to use.',
  summary:
    "From breaking apart Rails monoliths into Kafka-driven microservices at Upstart, to shipping Chrome extensions and data tables at Seamless.AI, to building Filevine's F2 finance platform, I've spent the last decade making complex systems feel simple. I care about clean architecture, sharp craft, and shipping software people actually want to use.",
};

export type Job = {
  year: string;
  company: string;
  role: string;
  location: string;
  blurb: string;
  stack: string[];
};

export const JOURNEY: Job[] = [
  {
    year: '2025 — Now',
    company: 'Filevine',
    role: 'Software Engineer',
    location: 'Remote',
    blurb:
      'On the F2 (Filevine Finance) team, building a financial platform layered onto Filevine — full-stack work across a Svelte + TanStack Query frontend and a C# / Node.js backend, with AG-Grid powering the heavier data surfaces. Leaning into AI-assisted development with Claude Code as a daily driver.',
    stack: [
      'C#',
      'Node.js',
      'TypeScript',
      'Svelte',
      'TanStack Query',
      'AG-Grid',
    ],
  },
  {
    year: '2023 — 2025',
    company: 'Seamless.AI',
    role: 'Software Engineer II',
    location: 'Columbus, OH',
    blurb:
      "Chrome extensions and sales-engagement web platforms. Shipped customizable datatables, built the 'Connect' campaign workflow, migrated the extension to Manifest v3, and mentored a junior engineer.",
    stack: ['React', 'Redux', 'Node.js', 'PostgreSQL', 'Redis', 'Chrome MV3'],
  },
  {
    year: '2021 — 2023',
    company: 'Upstart',
    role: 'Software Engineer IV',
    location: 'San Mateo, CA',
    blurb:
      'Helped break apart a Rails monolith into Kafka-backed microservices. Built reporting APIs with keyset pagination, defined data ownership boundaries across teams, and wired up DataDog/LaunchDarkly for reliability.',
    stack: ['Ruby on Rails', 'Kafka', 'gRPC', 'PostgreSQL', 'DataDog'],
  },
  {
    year: '2020 — 2021',
    company: 'Divisions Maintenance Group',
    role: 'Software Engineer III',
    location: 'Newport, KY',
    blurb:
      'Built technician onboarding for web (React) and mobile (React Native). Wrote a native module to make gRPC calls work on iOS and Android. Migrated a service-bus messaging system to gRPC + Kafka.',
    stack: ['React Native', 'MobX', 'C# .NET', 'gRPC', 'Kafka', 'MSSQL'],
  },
  {
    year: '2018 — 2020',
    company: 'Kroger Digital',
    role: 'Software Engineer',
    location: 'Cincinnati, OH',
    blurb:
      'Consumer-facing e-commerce at scale. Consolidated repos into a Lerna monorepo, drove test coverage past 90% with Jest + WebdriverIO, and rebuilt auth flows to meet WCAG accessibility standards.',
    stack: ['React', 'Redux', 'Node.js', 'MongoDB', 'Storybook', 'Jest'],
  },
  {
    year: '2014 — 2018',
    company: 'RoviSys',
    role: 'Software Developer II',
    location: 'Aurora, OH',
    blurb:
      'Enterprise automation. Modernized WinForms apps to WPF, integrated with the AutoCAD SDK, and built internal platforms for resource forecasting, asset tracking, and desk reservations.',
    stack: ['ASP.NET MVC', 'AngularJS', 'WPF', 'Entity Framework', 'MSSQL'],
  },
];

export const EDUCATION = {
  degree: 'B.S. Computer Science',
  school: 'Miami University',
  location: 'Oxford, OH',
  year: '2009 — 2014',
};

export type SkillCategoryName =
  | 'Languages'
  | 'Frontend'
  | 'Backend'
  | 'Data'
  | 'Platform';

export interface SkillGroup {
  name: SkillCategoryName;
  items: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Ruby', 'C#', 'SQL', 'Rust'],
  },
  {
    name: 'Frontend',
    items: [
      'React',
      'React Native',
      'Next.js',
      'Svelte',
      'TanStack Query',
      'Redux',
    ],
  },
  {
    name: 'Backend',
    items: ['Node.js', 'Rails', '.NET', 'gRPC', 'GraphQL', 'Kafka'],
  },
  { name: 'Data', items: ['PostgreSQL', 'MongoDB', 'MSSQL', 'Redis'] },
  { name: 'Platform', items: ['AWS', 'Docker', 'Vercel', 'DataDog'] },
];

/** Maps a skill category to its syntax color token (Atom One palette). */
export const skillCategoryColor: Record<
  SkillCategoryName,
  'yellow' | 'accent' | 'red' | 'green' | 'purple'
> = {
  Languages: 'yellow',
  Frontend: 'accent',
  Backend: 'red',
  Data: 'green',
  Platform: 'purple',
};

export const INTERESTS: { label: string; items: string[] }[] = [
  {
    label: 'Family & home',
    items: ['wife + two kids', 'two cats', 'suburban Cincinnati'],
  },
  { label: 'Gaming', items: ['PC', 'Steam Deck', 'World of Warcraft'] },
  { label: 'Music', items: ['trombone', 'concerts', 'music festivals'] },
  {
    label: 'Fitness',
    items: ['running', 'first half marathon', 'weightlifting'],
  },
  { label: 'Cincy sports', items: ['Bengals', 'Reds', 'FC Cincinnati'] },
  {
    label: 'Around the house',
    items: ['yardwork', 'side projects', 'TV & movies'],
  },
];

export const VALUES: { title: string; description: string }[] = [
  {
    title: 'Systems thinking',
    description:
      'Approach problems architecturally — understand the whole before touching the parts. Good design emerges from understanding constraints, not just requirements.',
  },
  {
    title: 'Clean code',
    description:
      'Readable, maintainable code is a feature. I write for the next engineer as much as the compiler — naming, structure, and documentation are craft, not overhead.',
  },
  {
    title: 'Collaboration',
    description:
      'The best solutions come from close partnership with teams and stakeholders. I communicate early, share context freely, and treat code review as a learning tool.',
  },
  {
    title: 'Continuous learning',
    description:
      'Technology moves fast. I stay current with the stack I use, explore adjacent tools with curiosity, and enjoy building things just to understand how they work.',
  },
];
