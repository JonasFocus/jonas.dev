import type { Metadata } from 'next';
import { Geist, Geist_Mono, Lora } from 'next/font/google';
import { VisitTracker } from '@/components/visit-tracker';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// The landing page ships its own Inter/Fraunces/JetBrains faces, so these two are
// only ever painted on /admin and /privacy: keep them out of the preload set.
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  preload: false,
});

const editorial = Lora({
  variable: '--font-editorial',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jonasinfocus.com'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Jonas | Websites, SaaS & web apps',
    description:
      'Independent design and development. Work with us from idea to launch.',
    url: '/',
    siteName: 'Jonas',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jonas | Websites, SaaS & web apps',
    description:
      'Independent design and development. Work with us from idea to launch.',
  },
  title: 'Jonas | Websites, SaaS & web apps',
  description:
    'Thoughtful websites and custom web applications. We take your idea from first conversation to launch.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${editorial.variable} antialiased`}
      >
        {children}
        <VisitTracker />
      </body>
    </html>
  );
}
