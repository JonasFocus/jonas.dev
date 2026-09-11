import Link from 'next/link';
import { requireOwner } from '@/lib/crm/auth';
import { AdminNavigation } from '../navigation';
import { SignOut } from '../auth-controls';
export const dynamic = 'force-dynamic';
export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireOwner();
  return (
    <div className="admin-shell">
      <a href="#admin-content" className="admin-skip">
        Skip to content
      </a>
      <header className="admin-masthead">
        <Link href="/admin" className="admin-brand">
          <span className="admin-mark" aria-hidden="true">
            J
          </span>
          Console
        </Link>
        <Link href="/" className="admin-site-link">
          jonasinfocus.com
        </Link>
        <span className="admin-operator">{user.email}</span>
        <SignOut />
      </header>
      <AdminNavigation />
      <main id="admin-content" className="admin-main">
        {children}
      </main>
    </div>
  );
}
