import Link from 'next/link';
import { getDashboard } from '@/lib/crm/queries';
import { Heading, RequestList } from '../shared';
export default async function Dashboard() {
  const data = await getDashboard();
  return (
    <>
      <Heading
        title="Your work, in view."
        subtitle="A quiet place to keep track of conversations and what comes next."
      />
      <div className="admin-stats">
        <Link href="/admin/requests?status=new">
          <span>New requests</span>
          <strong>{data.newRequests}</strong>
        </Link>
        <Link href="/admin/follow-ups">
          <span>Overdue follow-ups</span>
          <strong>{data.overdueFollowUps}</strong>
        </Link>
        <Link href="/admin/customers">
          <span>Customers</span>
          <strong>{data.customers}</strong>
        </Link>
      </div>
      <section className="admin-panel">
        <div className="admin-section-heading">
          <h2>Recent requests</h2>
          <Link href="/admin/requests">View all →</Link>
        </div>
        <RequestList requests={data.recentRequests} />
      </section>
    </>
  );
}
