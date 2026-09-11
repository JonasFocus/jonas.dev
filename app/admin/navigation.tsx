'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const links = [
  ['/admin', 'Overview'],
  ['/admin/requests', 'Requests'],
  ['/admin/customers', 'Customers'],
  ['/admin/follow-ups', 'Follow-ups'],
  ['/admin/security', 'Security'],
];
export function AdminNavigation() {
  const path = usePathname();
  return (
    <nav aria-label="Admin" className="admin-nav">
      {links.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={
            (href === '/admin' ? path === href : path.startsWith(href))
              ? 'page'
              : undefined
          }
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
