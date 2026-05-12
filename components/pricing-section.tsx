import {
  Clock,
  Lock,
  MessageCircle,
  Rocket,
  Smartphone,
  Target,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TypographyH2, TypographyP } from '@/components/ui/typography';

const PRICING_PACKAGES = [
  {
    title: 'Quick Fixes & Small Projects',
    price: '$75-125',
    period: '/hour',
    description:
      'Perfect for bug fixes, small features, or quick consultations',
    features: [
      'Bug fixes and debugging',
      'Small feature additions',
      'Code reviews',
      'Technical consulting',
      'Performance optimization',
    ],
    popular: false,
  },
  {
    title: 'Full-Stack Development',
    price: '$100-150',
    period: '/hour',
    description:
      'Complete web applications and mobile apps from concept to deployment',
    features: [
      'Full-stack web development',
      'Mobile app development',
      'API design & development',
      'Database design',
      'Deployment & DevOps',
      'Ongoing maintenance',
    ],
    popular: true,
  },
  {
    title: 'Enterprise Solutions',
    price: 'Custom',
    period: 'pricing',
    description:
      'Large-scale applications and system architecture for enterprise clients',
    features: [
      'System architecture design',
      'Microservices development',
      'Scalable infrastructure',
      'Team collaboration',
      'Long-term partnerships',
      'Dedicated support',
    ],
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <TypographyH2 className="mb-6 font-bold text-4xl text-wrap-balance md:text-5xl">
            Available for New Projects
          </TypographyH2>
          <TypographyP className="mx-auto max-w-3xl text-muted-foreground text-wrap-pretty text-xl">
            I&apos;m currently accepting freelance and contract opportunities.
            Let&apos;s build something amazing together.
          </TypographyP>
        </div>

        <div className="mb-12 grid gap-8 lg:grid-cols-3">
          {PRICING_PACKAGES.map(pkg => (
            <div key={pkg.title}>
              <Card
                className={`relative h-full ${
                  pkg.popular ? 'border-2 border-primary shadow-lg' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                    <div className="rounded-full bg-primary px-4 py-1 font-semibold text-primary-foreground text-sm">
                      Most Popular
                    </div>
                  </div>
                )}
                <CardHeader className="pb-4 text-center">
                  <CardTitle className="mb-2 text-2xl">{pkg.title}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-bold text-4xl text-primary tabular-nums">
                      {pkg.price}
                    </span>
                    <span className="text-muted-foreground">{pkg.period}</span>
                  </div>
                  <TypographyP className="mt-2 text-muted-foreground text-wrap-pretty">
                    {pkg.description}
                  </TypographyP>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {pkg.features.map(feature => (
                      <li key={feature} className="flex items-start">
                        <span
                          className="mt-1 mr-2 text-primary"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    <Button
                      render={<Link href="/contact" />}
                      className="w-full"
                      variant={pkg.popular ? 'default' : 'outline'}
                    >
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Card className="mx-auto max-w-2xl p-8">
            <TypographyH2 className="mb-4 font-bold text-2xl text-wrap-balance">
              Why Choose Me?
            </TypographyH2>
            <div className="grid gap-6 text-left md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                    <Clock
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm">Fast turnaround times</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                    <Target
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm">Clear communication</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                    <Lock className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                  <span className="text-sm">Secure & reliable code</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                    <Smartphone
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm">Responsive design</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                    <Rocket
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm">Performance optimized</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                    <MessageCircle
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm">Ongoing support</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
