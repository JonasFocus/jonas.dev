import Link from 'next/link';
import type { ReactNode } from 'react';
import type {
  FollowUpRecord,
  RequestRecord,
  RequestStatus,
} from '@/lib/crm/types';
import { AdminForm } from './forms';
import { completeFollowUpAction } from './actions';

export const statusLabels: Record<RequestStatus, string> = {
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
export function SearchIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
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
const statusTones: Record<RequestStatus, string | undefined> = {
  new: 'new',
  contacted: 'info',
  qualified: 'ok',
  closed: undefined,
  spam: 'warn',
};
export function StatusTag({ status }: { status: RequestStatus }) {
  return (
    <span className="cs-tag" data-tone={statusTones[status]}>
      {statusLabels[status]}
    </span>
  );
}
export function serviceNames(request: RequestRecord) {
  return (request.services ?? [request.service])
    .map((service) => service.replaceAll('-', ' '))
    .join(' · ');
}
export function RequestTable({
  requests,
  empty,
}: {
  requests: RequestRecord[];
  empty: string;
}) {
  return (
    <table className="cx-table cr-requests">
      {requests.length > 0 && (
        <thead className="cx-thead">
          <tr>
            <th scope="col">Request</th>
            <th scope="col">Project</th>
            <th scope="col">Status</th>
            <th scope="col">Received</th>
          </tr>
        </thead>
      )}
      <tbody>
        {requests.length === 0 && (
          <tr>
            <td className="cx-empty" colSpan={4}>
              {empty}
            </td>
          </tr>
        )}
        {requests.map((request) => (
          <tr className="cx-trow" key={request.id}>
            <td className="cs-name">
              <Link href={`/admin/requests/${request.id}`}>
                {!request.read_at && (
                  <span className="cx-new">
                    <span className="cx-dot" />
                    <span className="cx-sr-only">Unread: </span>
                  </span>
                )}
                {request.name}
              </Link>
              <span>{request.company || request.email}</span>
            </td>
            <td className="cr-services">{serviceNames(request)}</td>
            <td>
              <StatusTag status={request.status} />
            </td>
            <td className="cs-date">
              <DateLabel value={request.created_at} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export function FollowUps({
  items,
  showRequest = false,
}: {
  items: FollowUpRecord[];
  showRequest?: boolean;
}) {
  const now = new Date();
  return (
    <ul className="cx-list">
      {items.map((item) => {
        const overdue = !item.completed_at && new Date(item.due_at) < now;
        return (
          <li className="cx-row cr-followup" key={item.id}>
            <span
              className={
                item.completed_at ? 'cx-ok' : overdue ? 'cx-bad' : 'cx-warn'
              }
            >
              <span className="cx-dot" />
            </span>
            <span className="cx-row-name">
              {showRequest ? (
                <Link href={`/admin/requests/${item.request_id}`}>
                  {item.title}
                </Link>
              ) : (
                item.title
              )}
              <em>
                {item.completed_at
                  ? 'Completed '
                  : overdue
                    ? 'Overdue, due '
                    : 'Due '}
                <DateLabel
                  value={item.completed_at || item.due_at}
                  includeTime
                />
              </em>
            </span>
            {item.completed_at ? (
              <span className="cs-tag" data-tone="ok">
                Complete
              </span>
            ) : (
              <AdminForm
                action={completeFollowUpAction}
                id={item.id}
                label="Mark complete"
              />
            )}
          </li>
        );
      })}
      {!items.length && (
        <li className="cx-row cr-followup">
          <span className="cx-idle">
            <span className="cx-dot" />
          </span>
          <span className="cx-row-name">Nothing to follow up on</span>
          <span className="cx-row-num">—</span>
        </li>
      )}
    </ul>
  );
}
