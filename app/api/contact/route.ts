import { type NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Contact form validation schema
const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  website: z.string().optional(), // Honeypot field
});

// Helper to detect long sequences of characters without spaces (often a sign of bot spam)
const hasLongContinuousStrings = (str: string) => {
  return /[^\s]{20,}/.test(str);
};

// Common spammy TLDs and keywords
const SPAMMY_TLDS = [
  '.ru',
  '.xyz',
  '.top',
  '.click',
  '.monster',
  '.icu',
  '.gdn',
  '.biz',
];
const SPAMMY_KEYWORDS = [
  'crypto',
  'bitcoin',
  'pills',
  'casino',
  'viagra',
  'seo ranking',
  'marketing agency',
];

export async function POST(request: NextRequest) {
  try {
    const userAgent = request.headers.get('user-agent') || '';
    const body = await request.json();

    // Validate the request body
    const validatedData = contactSchema.parse(body);

    // 1. Honeypot check
    if (validatedData.website) {
      console.warn('Bot detected: Honeypot field filled');
      return NextResponse.json(
        { message: 'Email sent successfully' },
        { status: 200 }
      );
    }

    // 2. Gibberish check
    if (
      hasLongContinuousStrings(validatedData.firstName) ||
      hasLongContinuousStrings(validatedData.lastName) ||
      hasLongContinuousStrings(validatedData.subject) ||
      hasLongContinuousStrings(validatedData.message)
    ) {
      console.warn('Bot detected: Gibberish strings');
      return NextResponse.json(
        { message: 'Email sent successfully' },
        { status: 200 }
      );
    }

    // 3. Spammy TLD check
    const emailLower = validatedData.email.toLowerCase();
    if (SPAMMY_TLDS.some(tld => emailLower.endsWith(tld))) {
      console.warn(`Bot detected: Spammy TLD (${emailLower})`);
      return NextResponse.json(
        { message: 'Email sent successfully' },
        { status: 200 }
      );
    }

    // 4. Spammy Keyword check
    const contentLower =
      `${validatedData.subject} ${validatedData.message}`.toLowerCase();
    if (SPAMMY_KEYWORDS.some(keyword => contentLower.includes(keyword))) {
      console.warn('Bot detected: Spammy keywords');
      return NextResponse.json(
        { message: 'Email sent successfully' },
        { status: 200 }
      );
    }

    // 5. Basic User-Agent check (Headless browsers often have very generic UAs)
    if (
      !userAgent ||
      userAgent.includes('headless') ||
      userAgent === 'axios' ||
      userAgent === 'node-fetch'
    ) {
      console.warn(`Bot detected: Suspect User-Agent (${userAgent})`);
      return NextResponse.json(
        { message: 'Email sent successfully' },
        { status: 200 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Resend's default sending address
      to: ['arasfeld@gmail.com'],
      subject: `New Contact Form Submission: ${validatedData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #555;">Contact Information</h3>
            <p><strong>Name:</strong> ${validatedData.firstName} ${
              validatedData.lastName
            }</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Subject:</strong> ${validatedData.subject}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #555;">Message</h3>
            <p style="line-height: 1.6; color: #333;">${validatedData.message.replace(
              /\n/g,
              '<br>'
            )}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #666; font-size: 14px;">
            <p>This message was sent from your portfolio contact form at ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Email sent successfully', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
