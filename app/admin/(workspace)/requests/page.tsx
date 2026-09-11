import { Pagination, pageNumber } from '../../pagination';
import { getRequests } from '@/lib/crm/queries';
import { Heading, RequestList, statusLabels } from '../../shared';
export default async function Requests({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const filters = await searchParams;
  const page = pageNumber(filters.page);
  const requests = await getRequests({ ...filters, page });
  const visible = requests.slice(0, 50);
  return (
    <>
      <Heading
        title="Requests"
        subtitle="Review new inquiries and keep every conversation moving."
      />
      <form className="admin-filters">
        <label>
          Search
          <input
            name="q"
            type="search"
            placeholder="Name, email or company"
            defaultValue={filters.q}
            maxLength={200}
          />
        </label>
        <label>
          Status
          <select name="status" defaultValue={filters.status || ''}>
            <option value="">All statuses</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button className="admin-button">Apply filters</button>
      </form>
      <section className="admin-panel">
        <div className="admin-section-heading">
          <h2>Inbox</h2>
          <span>{visible.length} shown</span>
        </div>
        <RequestList requests={visible} />
      </section>
      <Pagination
        path="/admin/requests"
        page={page}
        hasNext={requests.length > 50}
        filters={{ q: filters.q, status: filters.status }}
      />
    </>
  );
}
