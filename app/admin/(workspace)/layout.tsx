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
  await requireOwner();
  return (
    <div className="admin-shell">
      <a href="#admin-content" className="admin-skip">
        Skip to content
      </a>
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          Jonas<span>Workspace</span>
        </Link>
        <AdminNavigation />
        <div className="admin-sidebar-bottom">
          <Link href="/">View website ↗</Link>
          <SignOut />
        </div>
      </aside>
      <main id="admin-content" className="admin-main">
        {children}
      </main>
    </div>
  );
}
