import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCustomer } from '@/lib/crm/queries';
import { AdminForm } from '../../../forms';
import { updateCustomerAction } from '../../../actions';
import { Hero, RequestList } from '../../../shared';
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
      <p className="cs-crumb">
        <Link href="/admin/customers">← All customers</Link>
      </p>
      <Hero
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
            <label className="cs-field">
              <span>Name</span>
              <input
                name="name"
                required
                maxLength={120}
                defaultValue={customer.name}
                autoComplete="name"
              />
            </label>
            <label className="cs-field">
              <span>Email</span>
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                defaultValue={customer.email}
                autoComplete="email"
              />
            </label>
            <label className="cs-field">
              <span>Company</span>
              <input
                name="company"
                maxLength={160}
                defaultValue={customer.company || ''}
                autoComplete="organization"
              />
            </label>
            <label className="cs-field">
              <span>Status</span>
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
