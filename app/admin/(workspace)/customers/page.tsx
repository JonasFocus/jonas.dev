import Link from 'next/link';
import { Pagination, pageNumber } from '../../pagination';
import { getCustomers } from '@/lib/crm/queries';
import { Hero, SearchIcon, Empty } from '../../shared';
export default async function Customers({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const filters = await searchParams;
  const page = pageNumber(filters.page);
  const customers = await getCustomers({ q: filters.q, page });
  return (
    <>
      <Hero
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
      </form>
      <section className="admin-panel">
        {customers.length ? (
          <div className="admin-list">
            {customers.slice(0, 50).map((customer) => (
              <Link
                key={customer.id}
                href={`/admin/customers/${customer.id}`}
                className="admin-request"
              >
                <div>
                  <strong>{customer.name}</strong>
                  <p>{customer.company || customer.email}</p>
                </div>
                <span className="admin-badge">{customer.status}</span>
              </Link>
            ))}
          </div>
        ) : (
          <Empty
            title="No customers yet"
            body="Convert a request to a customer when you start working together."
          />
        )}
      </section>
      <Pagination
        path="/admin/customers"
        page={page}
        hasNext={customers.length > 50}
        filters={{ q: filters.q }}
      />
    </>
  );
}
