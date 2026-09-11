import type { Metadata } from 'next';
import { Geist, Geist_Mono, Lora } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const editorial = Lora({
  variable: '--font-editorial',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
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
    card: 'summary',
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
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${editorial.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
