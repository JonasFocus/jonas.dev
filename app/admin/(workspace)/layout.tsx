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
    <div className="cx-col">
      <a href="#admin-content" className="cx-skip">
        Skip to content
      </a>
      <header className="cx-top">
        <span className="cx-mark" aria-hidden="true">
          J
        </span>
        <span className="cx-wordmark">
          Console<Link href="/">jonasinfocus.com</Link>
        </span>
        <span className="cx-who">{user.email}</span>
        <SignOut />
      </header>
      <AdminNavigation />
      <main id="admin-content" className="cx-pane">
        {children}
      </main>
    </div>
  );
}
