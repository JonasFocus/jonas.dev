'use client';
import Link from 'next/link';
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <main className="cx-col cx-state">
      <section className="cx-hero">
        <div className="cx-hero-art cx-art" aria-hidden="true">
          <div className="cx-dither" data-tone="warm" />
        </div>
        <div className="cx-hero-body">
          <p className="cx-hero-status cx-bad">
            <span className="cx-dot" />
            Something went wrong
          </p>
          <h1 className="cx-hero-title">Workspace unavailable</h1>
          <p className="cx-hero-sub">
            We couldn&apos;t load this page. Your saved records have not been
            changed.
          </p>
          <div className="cs-form-foot">
            <button onClick={reset} type="button" className="cs-button">
              Try again
            </button>
            <Link className="cs-quiet-link" href="/admin/login">
              Return to sign-in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
