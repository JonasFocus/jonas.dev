export default function Loading() {
  return (
    <div aria-busy="true">
      <div className="cx-skeleton-hero" />
      <p className="cx-label">Loading…</p>
      <div className="cx-list">
        <div className="cx-skeleton" />
        <div className="cx-skeleton" />
        <div className="cx-skeleton" />
      </div>
    </div>
  );
}
