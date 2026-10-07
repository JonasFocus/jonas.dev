import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getVisitSession } from '@/lib/analytics/queries';
import { Hero } from '../../../shared';
import { TimeLabel, client, duration, eventLabels, source } from '../format';

export default async function VisitDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getVisitSession(id);
  if (!detail) notFound();
  const { session, events } = detail;
  const start = new Date(session.started_at).getTime();
  return (
    <>
      <p className="cs-crumb">
        <Link href="/admin/analytics">← Analytics</Link>
      </p>
      <Hero
        tone="cool"
        title={`Visit landing on ${session.landing_path}`}
        subtitle={
          <>
            {client(session)} · from {source(session)} · started{' '}
            <TimeLabel value={session.started_at} />
          </>
        }
      >
        <span className="cx-figure">
          <b>{duration(session.engaged_seconds)}</b>
          <span>time on site</span>
        </span>
        <span className="cx-figure">
          <b>{session.pageviews.toLocaleString()}</b>
          <span>page views</span>
        </span>
        <span className="cx-figure">
          <b>{session.events.toLocaleString()}</b>
          <span>events</span>
        </span>
        <span className="cx-figure">
          <b>
            <TimeLabel value={session.last_seen_at} />
          </b>
          <span>last seen</span>
        </span>
      </Hero>
      <h2 className="cx-label">Timeline</h2>
      <ol className="cx-list">
        {events.map((event) => (
          <li className="cx-row" key={event.id}>
            <span className={event.type === 'pageview' ? 'cx-new' : 'cx-idle'}>
              <span className="cx-dot" />
            </span>
            <span className="cx-row-name">
              {eventLabels[event.type] ?? event.type}{' '}
              {event.type === 'pageview' ? event.path : event.label}
              {event.type !== 'pageview' && <em>on {event.path}</em>}
            </span>
            <span className="cx-row-note">
              +{duration((new Date(event.created_at).getTime() - start) / 1000)}
            </span>
            <span className="cx-row-num">
              <TimeLabel value={event.created_at} />
            </span>
          </li>
        ))}
        {!events.length && (
          <li className="cx-row">
            <span className="cx-idle">
              <span className="cx-dot" />
            </span>
            <span className="cx-row-name">No events recorded</span>
            <span className="cx-row-num">-</span>
          </li>
        )}
      </ol>
    </>
  );
}
