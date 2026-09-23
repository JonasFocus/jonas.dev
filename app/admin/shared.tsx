import Link from 'next/link';
import type { ReactNode } from 'react';
import { isPast } from 'date-fns';
import type { RequestRecord, FollowUpRecord } from '@/lib/crm/types';
import { AdminForm } from './forms';
import { completeFollowUpAction } from './actions';

export const statusLabels = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  closed: 'Closed',
  spam: 'Spam',
};
export function DateLabel({
  value,
  includeTime = false,
}: {
  value: string;
  includeTime?: boolean;
}) {
  return (
    <time dateTime={value}>
      {new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'America/Chicago',
        ...(includeTime
          ? ({
              hour: 'numeric',
              minute: '2-digit',
              timeZoneName: 'short',
            } satisfies Intl.DateTimeFormatOptions)
          : {}),
      }).format(new Date(value))}
    </time>
  );
}
export function Hero({
  title,
  subtitle,
  status,
  tone,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  status?: ReactNode;
  tone?: 'cool' | 'warm';
  children?: ReactNode;
}) {
  return (
    <section className="cx-hero">
      <div className="cx-hero-art cx-art" aria-hidden="true">
        <div className="cx-dither" data-tone={tone} />
      </div>
      <div className="cx-hero-body">
        {status && <p className="cx-hero-status">{status}</p>}
        <h1 className="cx-hero-title">{title}</h1>
        {subtitle && <p className="cx-hero-sub">{subtitle}</p>}
        {children && <div className="cx-figures">{children}</div>}
      </div>
    </section>
  );
}
export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="admin-empty">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
export function RequestList({ requests }: { requests: RequestRecord[] }) {
  if (!requests.length)
    return (
      <Empty
        title="No requests here yet"
        body="New inquiries from your website will appear here. Try changing your filters if you expected a result."
      />
    );
  return (
    <div className="admin-list">
      {requests.map((request) => (
        <Link
          className="admin-request"
          key={request.id}
          href={`/admin/requests/${request.id}`}
        >
          <div>
            <div className="admin-row-title">
              {!request.read_at && (
                <span className="admin-unread" aria-label="Unread" />
              )}
              <strong>{request.name}</strong>
              <span className="admin-badge">
                {statusLabels[request.status]}
              </span>
            </div>
            <p>{request.company || request.email}</p>
            <p className="admin-excerpt">{request.description}</p>
          </div>
          <div className="admin-request-meta">
            <span>
              {(request.services ?? [request.service])
                .map((service) => service.replaceAll('-', ' '))
                .join(' · ')}
            </span>
            <DateLabel value={request.created_at} />
            <span aria-hidden="true">↗</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
export function FollowUps({ items }: { items: FollowUpRecord[] }) {
  if (!items.length)
    return (
      <Empty
        title="Nothing to follow up on"
        body="Add a follow-up from a request to keep your next step in view."
      />
    );
  return (
    <ul className="admin-followups">
      {items.map((item) => (
        <li key={item.id}>
          <div>
            <Link href={`/admin/requests/${item.request_id}`}>
              <strong>{item.title}</strong>
            </Link>
            <p
              className={
                !item.completed_at && isPast(new Date(item.due_at))
                  ? 'admin-overdue'
                  : ''
              }
            >
              {item.completed_at ? 'Completed · ' : 'Due · '}
              <DateLabel value={item.completed_at || item.due_at} includeTime />
            </p>
          </div>
          {item.completed_at ? (
            <span className="admin-badge">Complete</span>
          ) : (
            <AdminForm
              action={completeFollowUpAction}
              id={item.id}
              label="Mark complete"
            />
          )}
        </li>
      ))}
    </ul>
  );
}
