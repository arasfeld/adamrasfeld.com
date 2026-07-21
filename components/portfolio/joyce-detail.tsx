import Image from 'next/image';

import {
  CaseStudyBackLink,
  FeatureList,
  StackTable,
} from '@/components/portfolio/case-study';
import { JoyceArchDiagram } from '@/components/portfolio/joyce-arch-diagram';
import { Button } from '@/components/ui/button';
import {
  DisplayHeading,
  MonoTag,
  SectionLabel,
} from '@/components/ui/typography';

const STACK_ROWS: { layer: string; tech: string }[] = [
  { layer: 'Frontend', tech: 'Next.js 16 App Router · React 19 · TypeScript' },
  {
    layer: 'Styling',
    tech: 'Tailwind CSS v4 (oklch tokens) · shadcn/ui · Radix',
  },
  { layer: 'Forms', tech: 'react-hook-form · Zod validation' },
  { layer: 'Database', tech: 'Prisma · PostgreSQL' },
  { layer: 'Models', tech: 'Artwork · Order · OrderItem' },
  { layer: 'Payments', tech: 'Stripe Checkout + webhook handler' },
  { layer: 'Media', tech: 'Cloudinary (signed uploads, transforms)' },
  { layer: 'Email', tech: 'Resend (transactional)' },
  { layer: 'Analytics', tech: '@vercel/analytics' },
  { layer: 'Deploy', tech: 'Vercel + Docker (local Postgres)' },
];

const FEATURES: string[] = [
  'Filterable artwork gallery sourced from a Cloudinary-backed Postgres table',
  'Three product lines — miniature houses, animal magnets, framed houses',
  'Per-item photo uploads for custom commissions',
  'localStorage cart, multi-item, multi-session, no account required',
  'Stripe Checkout session creation with success / cancel return URLs',
  'Webhook-driven order finalization on checkout.session.completed',
  'Resend confirmation and shipping emails',
  'Feature flag NEXT_PUBLIC_SHOP_ENABLED toggles the shop',
  'SEO — Organization + Product JSON-LD and generated OG images',
];

const META_CHIPS = [
  'Web',
  'Stripe-powered',
  'Live at joyceartstudio.com',
  'Open source',
];

export function JoyceDetail() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-20 md:px-12">
      <CaseStudyBackLink />

      <div className="ar-fade-up mb-16 flex flex-wrap items-start gap-12 [animation-delay:0.15s]">
        <div className="min-w-[280px] flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <DisplayHeading className="[font-size:clamp(2.5rem,5vw,3.5rem)]">
              Joyce Art Studio
            </DisplayHeading>
            <span className="inline-flex items-center rounded-sm border border-syntax-green/40 bg-syntax-green/10 px-2 py-0.5 font-mono text-[9px] text-syntax-green tracking-wide">
              live
            </span>
            <MonoTag>2025</MonoTag>
          </div>

          <p className="mb-6 max-w-lg font-mono text-[15px] text-foreground leading-relaxed">
            Full-stack artist portfolio and{' '}
            <span className="text-primary">custom-order e-commerce</span> shop
            for Joyce Rasfeld — gallery, cart, Stripe checkout, and a webhook-
            driven order state machine.
          </p>

          <p className="mb-7 max-w-lg font-mono text-muted-foreground text-xs leading-loose">
            Customers can browse a filterable gallery, then place custom orders
            for miniature houses, animal magnets, or framed pieces. The cart
            lives in localStorage so no account is needed — Stripe Checkout
            handles payment and a webhook flips the order to PAID, then triggers
            a Resend confirmation email.
          </p>

          <div className="mb-7 flex flex-wrap gap-1.5">
            {META_CHIPS.map(tag => (
              <MonoTag key={tag}>{tag}</MonoTag>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              render={
                <a
                  href="https://joyceartstudio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              variant="outline"
              size="default"
            >
              ↗ visit site
            </Button>
            <Button
              render={
                <a
                  href="https://github.com/JoyRasfeld/joyce-website"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              variant="ghost"
              size="default"
            >
              ⬡ view on github
            </Button>
          </div>
        </div>

        <div className="mx-auto flex-shrink-0 lg:mx-0">
          <div className="overflow-hidden rounded-md border border-border bg-card shadow-md">
            <div className="flex items-center gap-1 border-border border-b bg-background/60 px-2 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/35" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
            </div>
            <div className="relative aspect-video w-[320px] sm:w-[360px]">
              <Image
                src="/joyce-app-main.webp"
                alt="Joyce Art Studio screenshot"
                fill
                sizes="(min-width: 640px) 360px, 320px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="ar-fade-up mb-14 [animation-delay:0.3s]">
        <SectionLabel
          comment="architecture"
          heading="How It Works"
          color="accent"
          headingClassName="text-base md:text-lg"
        />
        <p className="mb-6 max-w-2xl font-mono text-muted-foreground text-xs leading-loose">
          The cart is intentionally stateless — React Context backed by
          localStorage, no auth, no accounts. On checkout, the server creates a
          Stripe session and returns a hosted checkout URL. Stripe&apos;s{' '}
          <span className="text-primary">checkout.session.completed</span>{' '}
          webhook advances the order state machine to PAID and triggers a Resend
          confirmation email. Customer photos for custom pieces upload directly
          to Cloudinary via signed uploads.
        </p>
        <JoyceArchDiagram />
      </div>

      <div className="ar-fade-up mb-14 [animation-delay:0.4s]">
        <SectionLabel
          comment="stack"
          heading="Tech Stack"
          color="accent"
          headingClassName="text-base md:text-lg"
        />
        <StackTable rows={STACK_ROWS} />
      </div>

      <div className="ar-fade-up [animation-delay:0.5s]">
        <SectionLabel
          comment="features"
          heading="Key Features"
          color="accent"
          headingClassName="text-base md:text-lg"
        />
        <FeatureList items={FEATURES} color="accent" />
      </div>
    </div>
  );
}
