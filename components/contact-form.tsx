'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  website: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  className?: string;
}

interface FieldLabelProps {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}

function FieldLabel({ htmlFor, required, children }: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block font-mono text-[9px] tracking-[0.15em] text-muted-foreground"
    >
      {'// '}
      {children}
      {required && <span className="ml-1 text-syntax-red">*</span>}
    </label>
  );
}

export function ContactForm({ className }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentName, setSentName] = useState<string | null>(null);
  const [sentEmail, setSentEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
    defaultValues: { website: '' },
  });

  const watched = watch();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSentName(data.firstName);
        setSentEmail(data.email);
        reset();
      } else {
        toast.error(
          result.error || 'Failed to send message. Please try again.'
        );
      }
    } catch {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sentName && sentEmail) {
    return (
      <div
        className={cn(
          'rounded-md border border-syntax-green/40 bg-syntax-green/5 p-12 text-center ar-fade-up',
          className
        )}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          className="mx-auto mb-4"
          aria-hidden="true"
        >
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke="var(--syntax-green)"
            strokeWidth="1.5"
            fill="none"
          />
          <polyline
            points="14,24 21,31 34,17"
            stroke="var(--syntax-green)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ar-check"
          />
        </svg>
        <div className="mb-2 font-mono text-sm font-bold text-foreground-bright">
          {'// message sent'}
        </div>
        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
          Thanks {sentName}. I&apos;ll get back to you at
          <br />
          <span className="text-primary">{sentEmail}</span>
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-5"
          onClick={() => {
            setSentName(null);
            setSentEmail(null);
          }}
        >
          send another
        </Button>
      </div>
    );
  }

  const hasMinFields = watched.firstName && watched.email && watched.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(className)}>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <div className="mb-4">
          <FieldLabel htmlFor="firstName" required>
            first name
          </FieldLabel>
          <Input
            id="firstName"
            placeholder="Your first name"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className="mt-1.5 font-mono text-[10px] text-syntax-red">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <FieldLabel htmlFor="lastName" required>
            last name
          </FieldLabel>
          <Input
            id="lastName"
            placeholder="Your last name"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName}
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className="mt-1.5 font-mono text-[10px] text-syntax-red">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <FieldLabel htmlFor="email" required>
          email
        </FieldLabel>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@email.com"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && (
          <p className="mt-1.5 font-mono text-[10px] text-syntax-red">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <FieldLabel htmlFor="subject">subject</FieldLabel>
        <Input
          id="subject"
          placeholder="What's this about?"
          autoComplete="off"
          aria-invalid={!!errors.subject}
          {...register('subject')}
        />
        {errors.subject && (
          <p className="mt-1.5 font-mono text-[10px] text-syntax-red">
            {errors.subject.message}
          </p>
        )}
      </div>

      <div className="mb-5">
        <FieldLabel htmlFor="message" required>
          message
        </FieldLabel>
        <Textarea
          id="message"
          rows={7}
          placeholder="Tell me about your project or opportunity..."
          aria-invalid={!!errors.message}
          className="resize-y"
          {...register('message')}
        />
        {errors.message && (
          <p className="mt-1.5 font-mono text-[10px] text-syntax-red">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <Input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('website')}
        />
      </div>

      <Button
        type="submit"
        size="default"
        disabled={isSubmitting || !isValid || !hasMinFields}
      >
        {isSubmitting ? 'sending...' : '→ send message'}
      </Button>
    </form>
  );
}
