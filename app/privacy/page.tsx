import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy | Jonas',
  description: 'How project inquiry information is used.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20 text-sm leading-7">
      <Link href="/" className="underline underline-offset-4">
        Back to Jonas
      </Link>
      <h1 className="mt-10 font-serif text-4xl">Privacy</h1>
      <p className="mt-6">
        When you submit an inquiry, this website collects your name, email
        address, project details, and any optional company, budget, or timing
        information you provide. If you request a case study walkthrough, that
        selection is saved with your request.
      </p>
      <h2 className="mt-8 text-xl">How your information is used</h2>
      <p className="mt-3">
        Jonas uses these details to review your project, respond to your
        inquiry, and keep notes and follow-ups about potential work together.
        The website does not send automated emails or subscribe you to a mailing
        list.
      </p>
      <h2 className="mt-8 text-xl">Storage and access</h2>
      <p className="mt-3">
        Requests are stored in Supabase and reviewed through a private admin
        area. Vercel hosts this website. These services process information
        needed to run the site. Technical request information may be processed
        to prevent abuse and diagnose failures. Admin sign-in uses
        authentication cookies.
      </p>
      <h2 className="mt-8 text-xl">Your choices</h2>
      <p className="mt-3">
        Optional fields can be left blank. Please do not include passwords,
        payment information, or other sensitive information. To ask about
        correcting or deleting a request, use the{' '}
        <Link href="/#contact" className="underline">
          inquiry form
        </Link>{' '}
        and include your request reference if available.
      </p>
    </main>
  );
}
