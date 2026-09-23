import Link from 'next/link';
import { getOwnerNewsletterEnabled } from '@/lib/homepage-settings';
import { getOverview } from '@/lib/crm/queries';
import { AdminForm } from '../forms';
import { setNewsletterAction } from '../actions';
import { DateLabel, Hero, statusLabels } from '../shared';

function plural(count: number, one: string, many = `${one}s`) {
  return `${count.toLocaleString()} ${count === 1 ? one : many}`;
}

export default async function Overview() {
  const [data, newsletterEnabled] = await Promise.all([
    getOverview(),
    getOwnerNewsletterEnabled(),
  ]);
  const { counts } = data;
  const waiting = counts.unread + counts.overdue + counts.dueToday;
  const open = counts.new + counts.contacted + counts.qualified;
  const attention = [
    counts.unread && plural(counts.unread, 'unread request'),
    counts.overdue && plural(counts.overdue, 'overdue follow-up'),
    counts.dueToday &&
      plural(counts.dueToday, 'follow-up due today', 'follow-ups due today'),
  ].filter(Boolean);
  return (
    <>
      <Hero
        status={
          <span className={attention.length ? 'cx-warn' : 'cx-ok'}>
            <span
              className="cx-dot"
              data-live={attention.length ? undefined : ''}
            />
            {attention.length
              ? `${plural(waiting, 'item')} ${waiting === 1 ? 'needs' : 'need'} attention`
              : 'All caught up'}
          </span>
        }
        title={
          attention.length
            ? `${attention.join(', ')}.`
            : 'Nothing needs you right now.'
        }
        subtitle={`${plural(open, 'open request')} in the pipeline and ${plural(counts.customers, 'active customer')}.`}
      >
        <Link className="cx-figure" href="/admin/requests">
          <b>{counts.unread.toLocaleString()}</b>
          <span>unread</span>
        </Link>
        <Link className="cx-figure" href="/admin/requests?status=new">
          <b>{counts.new.toLocaleString()}</b>
          <span>new</span>
        </Link>
        <Link className="cx-figure" href="/admin/follow-ups">
          <b>{counts.dueToday.toLocaleString()}</b>
          <span>due today</span>
        </Link>
        <Link className="cx-figure" href="/admin/follow-ups">
          <b>{counts.overdue.toLocaleString()}</b>
          <span>overdue</span>
        </Link>
        <Link className="cx-figure" href="/admin/customers">
          <b>{counts.customers.toLocaleString()}</b>
          <span>customers</span>
        </Link>
        <span className="cx-figure">
          <b>{counts.conversions.toLocaleString()}</b>
          <span>converted, 30 days</span>
        </span>
      </Hero>

      <h2 className="cx-label">Needs attention</h2>
      <ul className="cx-list">
        {data.unreadRequests.map((request) => (
          <li className="cx-row" key={request.id}>
            <span className="cx-new">
              <span className="cx-dot" />
            </span>
            <Link
              className="cx-row-name"
              href={`/admin/requests/${request.id}`}
            >
              {request.name}
              <em>unread request</em>
            </Link>
            <span className="cx-row-note">
              {request.company || request.email}
            </span>
            <span className="cx-row-num">
              <DateLabel value={request.created_at} />
            </span>
          </li>
        ))}
        {data.dueFollowUps.map((item) => {
          const overdue = new Date(item.due_at) < new Date();
          return (
            <li className="cx-row" key={item.id}>
              <span className={overdue ? 'cx-bad' : 'cx-warn'}>
                <span className="cx-dot" />
              </span>
              <Link
                className="cx-row-name"
                href={`/admin/requests/${item.request_id}`}
              >
                {item.title}
                <em>{overdue ? 'overdue' : 'due today'}</em>
              </Link>
              <span className="cx-row-note">{item.requests?.name}</span>
              <span className="cx-row-num">
                <DateLabel value={item.due_at} />
              </span>
            </li>
          );
        })}
        {!data.unreadRequests.length && !data.dueFollowUps.length && (
          <li className="cx-row">
            <span className="cx-idle">
              <span className="cx-dot" />
            </span>
            <span className="cx-row-name">Nothing waiting</span>
            <span className="cx-row-note">
              unread requests and due follow-ups show up here
            </span>
            <span className="cx-row-num">—</span>
          </li>
        )}
      </ul>

      <h2 className="cx-label">Pipeline</h2>
      <ul className="cx-list">
        {(['new', 'contacted', 'qualified'] as const).map((status) => (
          <li className="cx-row" key={status}>
            <span className={status === 'new' ? 'cx-new' : 'cx-idle'}>
              <span className="cx-dot" />
            </span>
            <Link
              className="cx-row-name"
              href={`/admin/requests?status=${status}`}
            >
              {statusLabels[status]}
            </Link>
            <span className="cx-row-note">open requests</span>
            <span className="cx-row-num">
              {counts[status].toLocaleString()}
            </span>
          </li>
        ))}
      </ul>

      <h2 className="cx-label">Recent activity</h2>
      <ol className="cx-list">
        {data.activity.map((event) => (
          <li className="cx-row" key={event.id}>
            <span className="cx-idle">
              <span className="cx-dot" />
            </span>
            <Link
              className="cx-row-name"
              href={`/admin/requests/${event.request_id}`}
            >
              {event.action}
              {event.requests && <em>{event.requests.name}</em>}
            </Link>
            <span className="cx-row-note" />
            <span className="cx-row-num">
              <DateLabel value={event.created_at} />
            </span>
          </li>
        ))}
        {!data.activity.length && (
          <li className="cx-row">
            <span className="cx-idle">
              <span className="cx-dot" />
            </span>
            <span className="cx-row-name">No activity yet</span>
            <span className="cx-row-note">
              new requests and changes show up here
            </span>
            <span className="cx-row-num">—</span>
          </li>
        )}
      </ol>

      <section aria-labelledby="newsletter-setting-title">
        <h2 className="cx-label" id="newsletter-setting-title">
          Homepage newsletter
        </h2>
        <p className="cs-hint">
          Show or hide the newsletter section and its navigation links. Signups
          remain closed until the newsletter is ready.
        </p>
        <div className="cs-panel cx-setting">
          <span
            className="cs-tag"
            data-tone={newsletterEnabled ? 'ok' : undefined}
          >
            {newsletterEnabled ? 'Visible' : 'Hidden'}
          </span>
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
        </div>
      </section>
    </>
  );
}
