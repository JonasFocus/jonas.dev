import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCustomer } from '@/lib/crm/queries';
import { AdminForm } from '../../../forms';
import { updateCustomerAction } from '../../../actions';
import { Heading, RequestList } from '../../../shared';
export default async function Customer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getCustomer(id);
  if (!data) notFound();
  const { customer, requests } = data;
  return (
    <>
      <Link href="/admin/customers" className="admin-back">
        ← Customers
      </Link>
      <Heading
        title={customer.name}
        subtitle={customer.company || customer.email}
      />
      <div className="admin-detail-grid">
        <section className="admin-panel admin-padded">
          <h2>Contact details</h2>
          <AdminForm
            action={updateCustomerAction}
            id={id}
            label="Save customer"
          >
            <label>
              Name
              <input
                name="name"
                required
                maxLength={120}
                defaultValue={customer.name}
                autoComplete="name"
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                defaultValue={customer.email}
                autoComplete="email"
              />
            </label>
            <label>
              Company
              <input
                name="company"
                maxLength={160}
                defaultValue={customer.company || ''}
                autoComplete="organization"
              />
            </label>
            <label>
              Status
              <select name="status" defaultValue={customer.status}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </AdminForm>
        </section>
        <section className="admin-panel">
          <div className="admin-section-heading">
            <h2>Related requests</h2>
          </div>
          <RequestList requests={requests} />
        </section>
      </div>
    </>
  );
}
