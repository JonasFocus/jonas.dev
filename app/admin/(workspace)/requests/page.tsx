import Link from 'next/link';
import { Pagination, pageNumber } from '../../pagination';
import { getRequests } from '@/lib/crm/queries';
import { Hero, RequestTable, SearchIcon, statusLabels } from '../../shared';
export default async function Requests({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const filters = await searchParams;
  const page = pageNumber(filters.page);
  const requests = await getRequests({ ...filters, page });
  const visible = requests.slice(0, 50);
  const filtered = Boolean(filters.q || filters.status);
  return (
    <>
      <Hero
        title="Requests"
        subtitle="Review new inquiries and keep every conversation moving."
      />
      <form className="cs-toolbar">
        <label className="cx-search">
          <SearchIcon />
          <input
            name="q"
            type="search"
            placeholder="Search name, email or company"
            aria-label="Search requests"
            defaultValue={filters.q}
            maxLength={200}
          />
        </label>
        <select
          className="cs-select"
          name="status"
          aria-label="Status"
          defaultValue={filters.status || ''}
        >
          <option value="">All statuses</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button className="cs-button" type="submit">
          Apply filters
        </button>
        {filtered && (
          <Link className="cs-quiet-link" href="/admin/requests">
            Clear
          </Link>
        )}
        <span className="cs-count">{visible.length} shown</span>
      </form>
      <RequestTable
        requests={visible}
        empty={
          filtered
            ? 'No requests match these filters.'
            : 'New inquiries from your website will appear here.'
        }
      />
      <Pagination
        path="/admin/requests"
        page={page}
        hasNext={requests.length > 50}
        filters={{ q: filters.q, status: filters.status }}
      />
    </>
  );
}
