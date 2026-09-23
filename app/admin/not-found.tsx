import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="cx-col cx-state">
      <section className="cx-hero">
        <div className="cx-hero-art cx-art" aria-hidden="true">
          <div className="cx-dither" data-tone="cool" />
        </div>
        <div className="cx-hero-body">
          <h1 className="cx-hero-title">Record not found</h1>
          <p className="cx-hero-sub">This record may no longer be available.</p>
          <div className="cs-form-foot">
            <Link className="cs-button" href="/admin">
              Back to overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
