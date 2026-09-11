'use client';
import Link from 'next/link';
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <main className="admin-error-page">
      <h1>Workspace unavailable</h1>
      <p>
        We couldn&apos;t load this page. Your saved records have not been
        changed.
      </p>
      <button onClick={reset} className="admin-button">
        Try again
      </button>
      <Link href="/admin/login">Return to sign-in</Link>
    </main>
  );
}
