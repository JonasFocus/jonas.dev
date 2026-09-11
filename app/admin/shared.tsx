import Link from 'next/link';
import { isPast } from 'date-fns';
import type { RequestRecord, FollowUpRecord } from '@/lib/crm/types';
import { AdminForm } from './forms';

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
export function Heading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="admin-heading">
      <p className="admin-eyebrow">Private workspace</p>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
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
            <span>{request.service.replaceAll('-', ' ')}</span>
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
              operation="complete"
              id={item.id}
              label="Mark complete"
            />
          )}
        </li>
      ))}
    </ul>
  );
}
