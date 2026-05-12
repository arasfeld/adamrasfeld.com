import Link from 'next/link';
import {
  Clock,
  Lock,
  MessageCircle,
  Rocket,
  Smartphone,
  Target,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TypographyH2, TypographyP } from '@/components/ui/typography';

export function PricingSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <TypographyH2 className="text-4xl md:text-5xl font-bold mb-6 text-wrap-balance">
            Available for New Projects
          </TypographyH2>
          <TypographyP className="text-xl text-muted-foreground max-w-3xl mx-auto text-wrap-pretty">
            I&apos;m currently accepting freelance and contract opportunities.
            Let&apos;s build something amazing together.
          </TypographyP>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {[
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
          ].map((pkg, index) => (
            <div key={index}>
              <Card
                className={`relative h-full ${
                  pkg.popular ? 'border-2 border-primary shadow-lg' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl mb-2">{pkg.title}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary tabular-nums">
                      {pkg.price}
                    </span>
                    <span className="text-muted-foreground">{pkg.period}</span>
                  </div>
                  <TypographyP className="text-muted-foreground mt-2 text-wrap-pretty">
                    {pkg.description}
                  </TypographyP>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span
                          className="text-primary mr-2 mt-1"
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
          <Card className="p-8 max-w-2xl mx-auto">
            <TypographyH2 className="text-2xl font-bold mb-4 text-wrap-balance">
              Why Choose Me?
            </TypographyH2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                    <Clock
                      className="w-4 h-4 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm">Fast turnaround times</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                    <Target
                      className="w-4 h-4 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm">Clear communication</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4 text-primary" aria-hidden="true" />
                  </div>
                  <span className="text-sm">Secure & reliable code</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                    <Smartphone
                      className="w-4 h-4 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm">Responsive design</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                    <Rocket
                      className="w-4 h-4 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-sm">Performance optimized</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                    <MessageCircle
                      className="w-4 h-4 text-primary"
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
