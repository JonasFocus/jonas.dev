import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './admin.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Admin | Jonas',
  robots: { index: false, follow: false },
};
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`cx ${inter.variable}`}>{children}</div>;
}
