import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCustomer } from '@/lib/crm/queries';
import { AdminForm } from '../../../forms';
import { updateCustomerAction } from '../../../actions';
import { DateLabel, Hero, RequestTable } from '../../../shared';
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
        tone="cool"
        status={
          <>
            <span
              className="cs-tag"
              data-tone={customer.status === 'active' ? 'ok' : undefined}
            >
              {customer.status === 'active' ? 'Active' : 'Inactive'}
            </span>
            {customer.email}
          </>
        }
        title={customer.name}
        subtitle={
          <>
            {customer.company || 'No company on file'} · customer since{' '}
            <DateLabel value={customer.created_at} />
          </>
        }
      >
        <span className="cx-figure">
          <b>{requests.length}</b>
          <span>{requests.length === 1 ? 'request' : 'requests'}</span>
        </span>
        <span className="cx-figure">
          <b>
            {
              requests.filter(
                (request) =>
                  request.status !== 'closed' && request.status !== 'spam',
              ).length
            }
          </b>
          <span>open</span>
        </span>
      </Hero>

      <h2 className="cx-label">Contact details</h2>
      <div className="cs-panel">
        <AdminForm action={updateCustomerAction} id={id} label="Save customer">
          <div className="cs-form-grid">
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
          </div>
        </AdminForm>
      </div>

      <h2 className="cx-label">Related requests</h2>
      <RequestTable
        requests={requests}
        empty="No requests are linked to this customer."
      />
    </>
  );
}
