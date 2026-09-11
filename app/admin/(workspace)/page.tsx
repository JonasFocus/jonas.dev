import Link from 'next/link';
import { getDashboard } from '@/lib/crm/queries';
import { Heading, RequestList } from '../shared';
export default async function Dashboard() {
  const data = await getDashboard();
  return (
    <>
      <section className="admin-feature">
        <div className="admin-feature-art" aria-hidden="true" />
        <div className="admin-feature-body">
          <Heading
            title="Your work, in view."
            subtitle="A quiet place to keep track of conversations and what comes next."
          />
          <div className="admin-stats">
            <Link href="/admin/requests?status=new">
              <strong>{data.newRequests}</strong>
              <span>New requests</span>
            </Link>
            <Link href="/admin/follow-ups">
              <strong>{data.overdueFollowUps}</strong>
              <span>Overdue follow-ups</span>
            </Link>
            <Link href="/admin/customers">
              <strong>{data.customers}</strong>
              <span>Customers</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="admin-panel admin-recent">
        <div className="admin-section-heading">
          <h2>Recent requests</h2>
          <Link href="/admin/requests">View all →</Link>
        </div>
        <RequestList requests={data.recentRequests} />
      </section>
    </>
  );
}
