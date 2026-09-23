import { getOwnerNewsletterEnabled } from '@/lib/homepage-settings';
import { AdminForm } from '../forms';
import { setNewsletterAction } from '../actions';
import Link from 'next/link';
import { getDashboard } from '@/lib/crm/queries';
import { Hero, RequestList } from '../shared';
export default async function Dashboard() {
  const [data, newsletterEnabled] = await Promise.all([
    getDashboard(),
    getOwnerNewsletterEnabled(),
  ]);
  return (
    <>
      <Hero
        title="Your work, in view."
        subtitle="A quiet place to keep track of conversations and what comes next."
      >
        <Link className="cx-figure" href="/admin/requests?status=new">
          <b>{data.newRequests}</b>
          <span>New requests</span>
        </Link>
        <Link className="cx-figure" href="/admin/follow-ups">
          <b>{data.overdueFollowUps}</b>
          <span>Overdue follow-ups</span>
        </Link>
        <Link className="cx-figure" href="/admin/customers">
          <b>{data.customers}</b>
          <span>Customers</span>
        </Link>
      </Hero>
      <section
        className="admin-panel admin-padded"
        aria-labelledby="newsletter-setting-title"
      >
        <div className="admin-section-heading">
          <h2 id="newsletter-setting-title">Homepage newsletter</h2>
          <span className="admin-badge">
            {newsletterEnabled ? 'Visible' : 'Hidden'}
          </span>
        </div>
        <p className="cs-hint">
          Show or hide the newsletter section and its navigation links. Signups
          remain closed until the newsletter is ready.
        </p>
        <AdminForm
          action={setNewsletterAction}
          id="homepage"
          label={newsletterEnabled ? 'Hide newsletter' : 'Show newsletter'}
        >
          <input
            type="hidden"
            name="enabled"
            value={String(!newsletterEnabled)}
          />
        </AdminForm>
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
