import Link from 'next/link';
import type {
  SessionRecord,
  VisitEventRecord,
  VisitorStats,
} from '@/lib/analytics/queries';
import { Hero } from '../../shared';
import { Pagination } from '../../pagination';
import { TimeLabel, client, duration, eventLabels, source } from './format';

const rangeOptions = [1, 7, 30, 90] as const;
const rangeNames: Record<number, string> = {
  1: '24 hours',
  7: '7 days',
  30: '30 days',
  90: '90 days',
};

function Ranking({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: { label: string; count: number }[];
  empty: string;
}) {
  const top = Math.max(1, ...rows.map((row) => row.count));
  return (
    <section className="ca-card" aria-label={title}>
      <h2 className="cx-label">{title}</h2>
      <ol className="ca-rank">
        {rows.map((row) => (
          <li key={row.label}>
            <span
              className="ca-rank-bar"
              style={{ width: `${(row.count / top) * 100}%` }}
              aria-hidden="true"
            />
            <span className="ca-rank-label">{row.label}</span>
            <span className="ca-rank-num">{row.count.toLocaleString()}</span>
          </li>
        ))}
        {!rows.length && <li className="ca-rank-empty">{empty}</li>}
      </ol>
    </section>
  );
}

export function AnalyticsView({
  stats,
  sessions,
  events,
  days,
  page,
}: {
  stats: VisitorStats;
  sessions: SessionRecord[];
  events: VisitEventRecord[];
  days: number;
  page: number;
}) {
  const { totals } = stats;
  const peak = Math.max(1, ...stats.daily.map((day) => day.sessions));
  return (
    <>
      <Hero
        tone="cool"
        status={
          <span className={stats.live ? 'cx-ok' : 'cx-idle'}>
            <span className="cx-dot" data-live={stats.live ? '' : undefined} />
            {stats.live
              ? `${stats.live.toLocaleString()} on the site now`
              : 'Nobody on the site right now'}
          </span>
        }
        title={`${totals.sessions.toLocaleString()} ${totals.sessions === 1 ? 'visit' : 'visits'} in the last ${rangeNames[days]}, averaging ${duration(totals.avgEngaged)} on the site.`}
        subtitle="Time on site counts only while the page is open and visible. Visitors are counted once per day without cookies or stored IP addresses, and your own visits are skipped."
      >
        <span className="cx-figure">
          <b>{totals.visitors.toLocaleString()}</b>
          <span>visitors</span>
        </span>
        <span className="cx-figure">
          <b>{totals.pageviews.toLocaleString()}</b>
          <span>page views</span>
        </span>
        <span className="cx-figure">
          <b>{duration(totals.avgEngaged)}</b>
          <span>average time on site</span>
        </span>
        <span className="cx-figure">
          <b>{duration(totals.medianEngaged)}</b>
          <span>median time on site</span>
        </span>
        <span className="cx-figure">
          <b>{totals.pagesPerSession.toLocaleString()}</b>
          <span>pages per visit</span>
        </span>
        <span className="cx-figure">
          <b>{totals.bounceRate}%</b>
          <span>bounce rate</span>
        </span>
      </Hero>

      <nav aria-label="Date range" className="cs-toolbar">
        {rangeOptions.map((option) => (
          <Link
            key={option}
            className="cs-filter"
            href={`/admin/analytics?days=${option}`}
            aria-current={option === days ? 'page' : undefined}
          >
            {rangeNames[option]}
          </Link>
        ))}
      </nav>

      <h2 className="cx-label">Visits per day</h2>
      {stats.daily.length ? (
        <ol className="ca-chart" aria-label="Visits per day, Central time">
          {stats.daily.map((day) => {
            const tip = `${day.day}: ${day.sessions} visits, ${day.visitors} visitors, ${day.pageviews} page views, ${duration(day.avgEngaged)} average`;
            return (
              <li key={day.day} className="ca-col">
                <span className="cx-sr-only">{tip}</span>
                <span
                  className="ca-bar"
                  style={{
                    height: `${Math.max(2, (day.sessions / peak) * 100)}%`,
                  }}
                />
                <span className="ca-tip" aria-hidden="true">
                  <b>{day.day}</b>
                  {day.sessions} visits · {day.visitors} visitors
                  <br />
                  {day.pageviews} page views · {duration(day.avgEngaged)}{' '}
                  average
                </span>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="cs-hint">No visits recorded in this range yet.</p>
      )}

      <div className="ca-grid">
        <Ranking
          title="Top pages"
          rows={stats.pages}
          empty="No page views yet"
        />
        <Ranking title="Sources" rows={stats.referrers} empty="No visits yet" />
        <Ranking
          title="Clicks and forms"
          rows={stats.clicks}
          empty="No clicks yet"
        />
        <Ranking
          title="Countries"
          rows={stats.countries}
          empty="No visits yet"
        />
        <Ranking title="Devices" rows={stats.devices} empty="No visits yet" />
        <Ranking title="Browsers" rows={stats.browsers} empty="No visits yet" />
      </div>

      <h2 className="cx-label">Live log</h2>
      <ol className="cx-list">
        {events.map((event) => (
          <li className="cx-row" key={event.id}>
            <span className={event.type === 'pageview' ? 'cx-new' : 'cx-idle'}>
              <span className="cx-dot" />
            </span>
            <Link
              className="cx-row-name"
              href={`/admin/analytics/${event.session_id}`}
            >
              {eventLabels[event.type] ?? event.type}{' '}
              {event.type === 'pageview' ? event.path : event.label}
              {event.type !== 'pageview' && <em>on {event.path}</em>}
            </Link>
            <span className="cx-row-note" />
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
            <span className="cx-row-name">No activity yet</span>
            <span className="cx-row-note">
              page views, clicks and form submissions show up here
            </span>
            <span className="cx-row-num">-</span>
          </li>
        )}
      </ol>

      <h2 className="cx-label">Visits</h2>
      <table className="cx-table ca-sessions">
        {sessions.length > 0 && (
          <thead className="cx-thead">
            <tr>
              <th scope="col">Landed on</th>
              <th scope="col">Source</th>
              <th scope="col">Pages</th>
              <th scope="col">Time</th>
              <th scope="col">Started</th>
            </tr>
          </thead>
        )}
        <tbody>
          {!sessions.length && (
            <tr>
              <td className="cx-empty" colSpan={5}>
                Visits show up here once the tracking is live.
              </td>
            </tr>
          )}
          {sessions.slice(0, 50).map((session) => (
            <tr className="cx-trow" key={session.id}>
              <td className="cs-name">
                <Link href={`/admin/analytics/${session.id}`}>
                  {session.landing_path}
                </Link>
                <span>{client(session)}</span>
              </td>
              <td>{source(session)}</td>
              <td className="ca-num">{session.pageviews.toLocaleString()}</td>
              <td className="ca-num">{duration(session.engaged_seconds)}</td>
              <td className="cs-date">
                <TimeLabel value={session.started_at} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        path="/admin/analytics"
        page={page}
        hasNext={sessions.length > 50}
        filters={{ days: days === 7 ? undefined : String(days) }}
      />
    </>
  );
}
