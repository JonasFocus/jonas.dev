import Link from 'next/link';

export function pageNumber(value: string | string[] | undefined): number {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) && page <= 1_000_000 ? page : 1;
}

export function Pagination({
  path,
  page,
  hasNext,
  filters = {},
}: {
  path: string;
  page: number;
  hasNext: boolean;
  filters?: Record<string, string | undefined>;
}) {
  function href(target: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters))
      if (value) params.set(key, value);
    params.set('page', String(target));
    return `${path}?${params.toString()}`;
  }
  return (
    <nav className="admin-pagination" aria-label="Pagination">
      {page > 1 ? (
        <Link className="admin-button" href={href(page - 1)} rel="prev">
          ← Previous
        </Link>
      ) : (
        <span />
      )}
      <span>Page {page}</span>
      {hasNext ? (
        <Link className="admin-button" href={href(page + 1)} rel="next">
          Next →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
