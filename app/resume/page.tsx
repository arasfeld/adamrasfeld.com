import type { Metadata } from 'next';
import {
  Award,
  Briefcase,
  Calendar,
  Code,
  Database,
  Download,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  Wrench,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TypographyH1,
  TypographyH3,
  TypographyLead,
  TypographyP,
} from '@/components/ui/typography';
import { resumeStructuredData, stringifyJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Resume - Adam Rasfeld Full Stack Developer',
  description:
    "Download Adam Rasfeld's resume and view his professional experience as a Full Stack Developer. 8+ years of experience with React, Node.js, TypeScript, and enterprise software development.",
  keywords: [
    'Adam Rasfeld Resume',
    'Software Development Experience',
    'Enterprise Software Development',
    'Seamless.AI',
    'Upstart',
    'Kroger Digital',
    'Miami University Computer Science',
  ],
  alternates: {
    canonical: 'https://adamrasfeld.com/resume',
  },
  openGraph: {
    title: 'Resume - Adam Rasfeld Full Stack Developer',
    description:
      "Download Adam Rasfeld's resume and view his professional experience as a Full Stack Developer with 8+ years of experience.",
    url: 'https://adamrasfeld.com/resume',
  },
  twitter: {
    title: 'Resume - Adam Rasfeld Full Stack Developer',
    description:
      "Download Adam Rasfeld's resume and view his professional experience as a Full Stack Developer with 8+ years of experience.",
  },
};

export default function Resume() {
  const experience = [
    {
      company: 'Seamless.AI',
      role: 'Software Engineer II',
      duration: 'Feb 2023 - Present',
      location: 'Columbus, OH',
      description:
        'Developing Chrome extensions and web platforms for sales automation, focusing on user experience optimization and security compliance.',
      technologies: [
        'Node.js',
        'React',
        'Redux',
        'PostgreSQL',
        'Chrome Extension',
        'Redis',
        'Sequelize',
        'rsuite',
      ],
      achievements: [
        'Designed and shipped dynamic, customizable datatables with column selection, filtering, sorting, row selection, and bulk actions',
        'Built the "Connect" workflow, expanding the platform into campaign management with task sequencing and automated outreach',
        'Migrated the extension from Manifest v2 to v3, ensuring compliance with updated Chrome security requirements',
        "Fixed security vulnerabilities flagged by GitHub code scanning, strengthening the platform's security posture",
        'Mentored a junior engineer and collaborated cross-team with backend and integrations groups',
      ],
    },
    {
      company: 'Upstart',
      role: 'Software Engineer IV',
      duration: 'Sep 2021 - Jan 2023',
      location: 'San Mateo, CA',
      description:
        'Architected microservices migration and performance optimization for financial technology platform, implementing modern monitoring and feature management.',
      technologies: [
        'Ruby on Rails',
        'Slim',
        'ActiveRecord',
        'PostgreSQL',
        'Redis',
        'Kafka',
        'gRPC',
        'LaunchDarkly',
        'DataDog',
      ],
      achievements: [
        'Developed reporting APIs with keyset pagination to improve query performance',
        'Supported migration from monolithic Rails codebase to microservices using Kafka for event messaging',
        'Analyzed database ownership boundaries to define data ownership across teams',
        'Integrated monitoring and feature management tools (DataDog, LaunchDarkly) to maintain reliability',
      ],
    },
    {
      company: 'Divisions Maintenance Group',
      role: 'Software Engineer III',
      duration: 'Nov 2020 - Sep 2021',
      location: 'Newport, KY',
      description:
        'Developed cross-platform mobile and web applications with modern architecture patterns, focusing on user onboarding and inter-service communication.',
      technologies: [
        'React',
        'React Native',
        'MobX',
        'C#.NET',
        'gRPC',
        'Kafka',
        'MSSQL Server',
        'Jest',
        'Datadog',
        'Sentry',
      ],
      achievements: [
        'Built a new technician onboarding experience for web (React) and mobile (React Native) apps',
        'Developed a native module enabling gRPC requests on Android and iOS',
        'Led the creation of a modular onboarding service/API, migrating service bus messaging system to gRPC and Kafka',
        'Enhanced backend logging/telemetry with Datadog and Sentry and implemented unit/integration tests with Jest',
      ],
    },
    {
      company: 'Kroger Digital',
      role: 'Software Engineer',
      duration: 'Mar 2018 - Oct 2020',
      location: 'Cincinnati, OH',
      description:
        'Built scalable e-commerce applications and developer tooling for major retail platform, emphasizing code quality and accessibility standards.',
      technologies: [
        'React',
        'Redux',
        'Node.js',
        'MongoDB',
        'Jest',
        'WebdriverIO',
        'Storybook',
        'Datadog',
      ],
      achievements: [
        'Consolidated multiple account repositories into a Lerna monorepo, improving maintainability and deployment workflows',
        'Drove unit and end-to-end test coverage above 90% using Jest and WebdriverIO',
        'Redesigned authentication flows and improved accessibility following WCAG standards',
        'Helped build a content management platform with Node.js + MongoDB',
      ],
    },
    {
      company: 'RoviSys',
      role: 'Software Developer II',
      duration: 'Dec 2014 - Feb 2018',
      location: 'Aurora, OH',
      description:
        'Developed enterprise automation systems and internal business applications, modernizing legacy systems with contemporary web technologies.',
      technologies: [
        'ASP.NET MVC',
        'Web API',
        'Entity Framework',
        'AngularJS',
        'WPF',
        'MSSQL Server',
        'AutoCAD SDK',
        'Cognex',
      ],
      achievements: [
        'Designed and maintained internal business apps streamlining project management, staffing, and reporting',
        'Modernized legacy systems by migrating WinForms → WPF, including engineering tools with AutoCAD SDK integration',
        'Built platforms for resource forecasting, asset tracking, desk reservation, and employee surveys',
        'Collaborated across teams to deliver scalable, reliable applications for internal and customer-facing use',
      ],
    },
  ];

  const education = [
    {
      degree: 'Bachelor of Science in Computer Science',
      school: 'Miami University',
      location: 'Oxford, OH',
      duration: 'Aug 2009 - Dec 2014',
    },
  ];

  const skills = [
    {
      category: 'Languages & Frameworks',
      technologies: [
        'JavaScript',
        'TypeScript',
        'React',
        'React Native',
        'Next.js',
        'Node.js',
        'Ruby on Rails',
        'C#.NET',
        'ASP.NET MVC',
        'Web API',
        'AngularJS',
        'SQL',
        'HTML/CSS',
      ],
      icon: Zap,
    },
    {
      category: 'Databases',
      technologies: ['PostgreSQL', 'MongoDB', 'MSSQL Server', 'MySQL', 'Redis'],
      icon: Database,
    },
    {
      category: 'Messaging & APIs',
      technologies: ['gRPC', 'Kafka', 'REST APIs', 'GraphQL'],
      icon: Wrench,
    },
    {
      category: 'Testing & QA',
      technologies: ['Jest', 'WebdriverIO', 'NUnit'],
      icon: Code,
    },
    {
      category: 'DevOps & Tools',
      technologies: [
        'AWS',
        'Docker',
        'Prisma',
        'LaunchDarkly',
        'Datadog',
        'Sentry',
        'GitHub',
        'Vercel',
      ],
      icon: Smartphone,
    },
    {
      category: 'Practices',
      technologies: [
        'Agile/Scrum',
        'Microservices',
        'Accessibility (WCAG)',
        'TDD',
        'CI/CD',
      ],
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(resumeStructuredData),
        }}
      />
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="space-y-6 mb-8">
            <TypographyH1 className="text-5xl md:text-6xl font-bold">
              Adam Rasfeld
            </TypographyH1>
            <TypographyH3 className="text-2xl md:text-3xl text-primary font-semibold">
              Full Stack Developer
            </TypographyH3>
            <TypographyLead className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Full Stack Software Engineer with extensive experience building
              scalable web and mobile applications, optimizing systems, and
              crafting high-performance, user-friendly interfaces. Skilled in
              React, Next.js, Node.js, Ruby on Rails, and API integrations.
              Experienced in mentoring, cross-team collaboration, and delivering
              production-ready solutions that balance performance, usability,
              and security.
            </TypographyLead>
          </div>

          {/* Contact Information */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>arasfeld@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Cincinnati, Ohio</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>(513) 746-0289</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              render={<a href="/adam-rasfeld-resume.pdf" download />}
              size="lg"
              className="group"
            >
              <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              Download Resume
            </Button>
            <Button
              render={
                <a
                  href="https://github.com/arasfeld"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              variant="outline"
              size="lg"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button
              render={
                <a
                  href="https://www.linkedin.com/in/adam-rasfeld"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              variant="outline"
              size="lg"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {/* Experience Section */}
          <section className="space-y-8">
            <div className="text-center mb-8">
              <TypographyH1 className="text-3xl font-bold flex items-center justify-center gap-3">
                <Briefcase className="w-8 h-8 text-primary" />
                Professional Experience
              </TypographyH1>
            </div>
            {experience.map((job, index) => (
              <div key={index}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                          {job.role}
                        </CardTitle>
                        <TypographyH3 className="text-lg text-primary/80">
                          {job.company}
                        </TypographyH3>
                      </div>
                      <div className="text-right text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {job.duration}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <TypographyP className="text-muted-foreground leading-relaxed">
                      {job.description}
                    </TypographyP>
                    <div>
                      <TypographyH3 className="text-lg font-semibold mb-3">
                        Technologies Used
                      </TypographyH3>
                      <div className="flex flex-wrap gap-2">
                        {job.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <TypographyH3 className="text-lg font-semibold mb-3">
                        Key Achievements
                      </TypographyH3>
                      <ul className="space-y-2">
                        {job.achievements.map(
                          (achievement, achievementIndex) => (
                            <li
                              key={achievementIndex}
                              className="flex items-start text-muted-foreground"
                            >
                              <span className="text-primary mr-2 mt-1">•</span>
                              {achievement}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </section>

          {/* Education Section */}
          <section className="space-y-8">
            <div className="text-center mb-8">
              <TypographyH1 className="text-3xl font-bold flex items-center justify-center gap-3">
                <GraduationCap className="w-8 h-8 text-primary" />
                Education
              </TypographyH1>
            </div>
            {education.map((edu, index) => (
              <div key={index}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                          {edu.degree}
                        </CardTitle>
                        <TypographyH3 className="text-lg text-primary/80">
                          {edu.school}
                        </TypographyH3>
                      </div>
                      <div className="text-right text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {edu.duration}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {edu.location}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <TypographyP className="text-muted-foreground leading-relaxed">
                      Bachelor of Science degree in Computer Science from Miami
                      University.
                    </TypographyP>
                  </CardContent>
                </Card>
              </div>
            ))}
          </section>

          {/* Skills Section */}
          <section className="space-y-8">
            <div className="text-center mb-8">
              <TypographyH1 className="text-3xl font-bold flex items-center justify-center gap-3">
                <Code className="w-8 h-8 text-primary" />
                Technical Skills
              </TypographyH1>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.map((skill, index) => {
                const IconComponent = skill.icon;
                return (
                  <div key={index}>
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-l-4 border-l-primary h-full flex flex-col">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {skill.category}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-start">
                        <div className="flex flex-wrap gap-2">
                          {skill.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
