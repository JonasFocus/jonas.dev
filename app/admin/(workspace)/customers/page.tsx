import Link from 'next/link';
import { Pagination, pageNumber } from '../../pagination';
import { getCustomers } from '@/lib/crm/queries';
import { DateLabel, Hero, SearchIcon } from '../../shared';
export default async function Customers({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const filters = await searchParams;
  const page = pageNumber(filters.page);
  const customers = await getCustomers({ q: filters.q, page });
  const visible = customers.slice(0, 50);
  return (
    <>
      <Hero
        tone="warm"
        title="Customers"
        subtitle="Contact details and the requests that started each relationship."
      />
      <form className="cs-toolbar">
        <label className="cx-search">
          <SearchIcon />
          <input
            name="q"
            type="search"
            placeholder="Search name, email or company"
            aria-label="Search customers"
            defaultValue={filters.q}
            maxLength={200}
          />
        </label>
        <button className="cs-button" type="submit">
          Search
        </button>
        {filters.q && (
          <Link className="cs-quiet-link" href="/admin/customers">
            Clear
          </Link>
        )}
        <span className="cs-count">{visible.length} shown</span>
      </form>
      <table className="cx-table cr-customers">
        {visible.length > 0 && (
          <thead className="cx-thead">
            <tr>
              <th scope="col">Customer</th>
              <th scope="col">Status</th>
              <th scope="col">Since</th>
            </tr>
          </thead>
        )}
        <tbody>
          {visible.length === 0 && (
            <tr>
              <td className="cx-empty" colSpan={3}>
                {filters.q
                  ? `No customer matches “${filters.q}”.`
                  : 'Convert a request to a customer when you start working together.'}
              </td>
            </tr>
          )}
          {visible.map((customer) => (
            <tr className="cx-trow" key={customer.id}>
              <td className="cs-name">
                <Link href={`/admin/customers/${customer.id}`}>
                  {customer.name}
                </Link>
                <span>{customer.company || customer.email}</span>
              </td>
              <td>
                <span
                  className="cs-tag"
                  data-tone={customer.status === 'active' ? 'ok' : undefined}
                >
                  {customer.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="cs-date">
                <DateLabel value={customer.created_at} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        path="/admin/customers"
        page={page}
        hasNext={customers.length > 50}
        filters={{ q: filters.q }}
      />
    </>
  );
}
