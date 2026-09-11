import Link from 'next/link';
import { Pagination, pageNumber } from '../../pagination';
import { getCustomers } from '@/lib/crm/queries';
import { Heading, Empty } from '../../shared';
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
      <Heading
        title="Customers"
        subtitle="Contact details and the requests that started each relationship."
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
        <button className="admin-button">Search</button>
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
