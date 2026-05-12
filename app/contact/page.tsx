import type { Metadata } from 'next';

import { ContactForm } from '@/components/contact-form';
import { Comment, DisplayHeading } from '@/components/ui/typography';
import { ABOUT } from '@/lib/about-data';
import { contactStructuredData, stringifyJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Contact Adam Rasfeld - Full Stack Developer',
  description:
    'Get in touch with Adam Rasfeld for your next software development project. Available for freelance work, consulting, and full-time opportunities.',
  alternates: {
    canonical: 'https://adamrasfeld.com/contact',
  },
  openGraph: {
    title: 'Contact Adam Rasfeld',
    description:
      'Get in touch with Adam Rasfeld for your next software development project.',
    url: 'https://adamrasfeld.com/contact',
  },
  twitter: {
    title: 'Contact Adam Rasfeld',
    description:
      'Get in touch with Adam Rasfeld for your next software development project.',
  },
};

const CONTACT_LINKS = [
  { label: 'email', value: ABOUT.email, href: `mailto:${ABOUT.email}` },
  { label: 'github', value: 'github.com/arasfeld', href: ABOUT.github },
  {
    label: 'linkedin',
    value: 'linkedin.com/in/adam-rasfeld',
    href: ABOUT.linkedin,
  },
  { label: 'location', value: ABOUT.location, href: null as string | null },
];

const SERVICES = [
  'Full-stack web development',
  'Mobile app development (iOS + Android)',
  'System architecture + microservices',
  'API design and integration',
  'Performance optimization',
  'Technical consulting',
];

export default function Contact() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyJsonLd(contactStructuredData),
        }}
      />
      <div className="mx-auto w-full max-w-5xl px-6 py-20 md:px-12">
        {/* Hero */}
        <div className="mb-12 ar-fade-up [animation-delay:0.1s]">
          <Comment className="mb-2.5">contact</Comment>
          <DisplayHeading className="[font-size:clamp(2.25rem,5vw,2.75rem)]">
            Get in Touch
          </DisplayHeading>
          <p className="mt-3 max-w-md font-mono text-xs leading-relaxed text-muted-foreground">
            Open to new opportunities, interesting projects, and good
            conversations. I respond within a day or two.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px] ar-fade-up [animation-delay:0.2s]">
          {/* Form */}
          <div>
            <Comment className="mb-5">send a message</Comment>
            <ContactForm />
          </div>

          {/* Sidebar */}
          <aside>
            <div className="mb-7 border-b border-border pb-7">
              <Comment className="mb-4">direct</Comment>
              <dl className="space-y-2.5">
                {CONTACT_LINKS.map(({ label, value, href }) => (
                  <div
                    key={label}
                    className="grid grid-cols-[64px_1fr] items-baseline gap-3"
                  >
                    <dt className="font-mono text-[9px] tracking-wide text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="break-all font-mono text-[11px]">
                      {href ? (
                        <a
                          href={href}
                          target={
                            href.startsWith('http') ? '_blank' : undefined
                          }
                          rel="noopener noreferrer"
                          className="text-primary transition-opacity hover:opacity-70"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="text-foreground">{value}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mb-7 border-b border-border pb-7">
              <Comment className="mb-3">availability</Comment>
              <div className="mb-2.5 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-syntax-green"
                />
                <span className="font-mono text-[11px] font-semibold text-foreground-bright">
                  Open to new opportunities
                </span>
              </div>
              <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                Available for full-time roles, contract work, and consulting
                engagements. Response time typically within 24–48 hours.
              </p>
            </div>

            <div>
              <Comment className="mb-3">services</Comment>
              <ul>
                {SERVICES.map((service, i) => (
                  <li
                    key={service}
                    className={`flex items-start gap-2.5 py-2 ${
                      i < SERVICES.length - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-px flex-shrink-0 font-mono text-[11px] text-primary"
                    >
                      →
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {service}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
