import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRequest } from '@/lib/crm/queries';
import { AdminForm } from '../../../forms';
import {
  addFollowUpAction,
  addNoteAction,
  convertToCustomerAction,
  markRequestReadAction,
  updateRequestStatusAction,
} from '../../../actions';
import {
  DateLabel,
  FollowUps,
  Hero,
  StatusTag,
  serviceNames,
  statusLabels,
} from '../../../shared';
export default async function RequestDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getRequest(id);
  if (!detail) notFound();
  const { request, notes, activity, followUps } = detail;
  const facts = [
    ['Email', request.email],
    ['Company', request.company || 'Individual inquiry'],
    ['Project', serviceNames(request)],
    ['Budget', request.budget || 'Not provided'],
    ['Timing', request.timeline || 'Not provided'],
    ['Case study', request.case_study || 'General inquiry'],
  ];
  return (
    <>
      <p className="cs-crumb">
        <Link href="/admin/requests">← All requests</Link>
      </p>
      <Hero
        status={
          <>
            <StatusTag status={request.status} />
            {!request.read_at && (
              <span className="cx-new">
                <span className="cx-dot" data-live="" />
                Unread
              </span>
            )}
          </>
        }
        title={request.name}
        subtitle={
          <>
            {request.company || 'Individual inquiry'} · received{' '}
            <DateLabel value={request.created_at} includeTime />
          </>
        }
      >
        <span className="cx-figure">
          <b>{notes.length}</b>
          <span>notes</span>
        </span>
        <span className="cx-figure">
          <b>{followUps.filter((item) => !item.completed_at).length}</b>
          <span>open follow-ups</span>
        </span>
        <span className="cx-figure">
          <b>{activity.length}</b>
          <span>events</span>
        </span>
      </Hero>

      <h2 className="cx-label">Project brief</h2>
      <div className="cs-panel">
        <p className="cr-prose">{request.description}</p>
      </div>

      <h2 className="cx-label">Details</h2>
      <dl className="cx-list">
        {facts.map(([label, value]) => (
          <div className="cx-row cs-fact" key={label}>
            <dt className="cx-row-note">{label}</dt>
            <dd className="cx-row-name">{value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="cx-label">Status</h2>
      <div className="cs-panel cx-setting">
        <AdminForm
          action={updateRequestStatusAction}
          id={id}
          label="Update status"
        >
          <label className="cs-field">
            <span>Status</span>
            <select name="status" defaultValue={request.status}>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </AdminForm>
        {!request.read_at && (
          <AdminForm
            action={markRequestReadAction}
            id={id}
            label="Mark as read"
          />
        )}
      </div>

      <h2 className="cx-label">Customer</h2>
      <div className="cs-panel cx-setting">
        {request.customer_id ? (
          <>
            <p className="cs-hint">This request is linked to a customer.</p>
            <Link
              className="cs-button"
              href={`/admin/customers/${request.customer_id}`}
            >
              View customer →
            </Link>
          </>
        ) : (
          <>
            <p className="cs-hint">
              Create a customer record when you decide to work together. The
              original request stays here.
            </p>
            <AdminForm
              action={convertToCustomerAction}
              id={id}
              label="Convert to customer"
            />
          </>
        )}
      </div>

      <h2 className="cx-label">Internal notes</h2>
      <ol className="cx-list">
        {notes.map((note) => (
          <li className="cr-note" key={note.id}>
            <p className="cr-prose">{note.body}</p>
            <DateLabel value={note.created_at} includeTime />
          </li>
        ))}
      </ol>
      <div className="cs-panel cr-compose">
        <AdminForm action={addNoteAction} id={id} label="Add note" reset>
          <label className="cs-field">
            <span>Note</span>
            <textarea
              name="body"
              required
              maxLength={5000}
              rows={4}
              placeholder="What did you discuss? What happens next?"
            />
          </label>
        </AdminForm>
      </div>

      <h2 className="cx-label">Follow-ups</h2>
      <FollowUps items={followUps} />
      <div className="cs-panel cr-compose">
        <AdminForm
          action={addFollowUpAction}
          id={id}
          label="Add follow-up"
          reset
        >
          <div className="cs-form-grid">
            <label className="cs-field">
              <span>Next step</span>
              <input
                name="title"
                required
                maxLength={200}
                placeholder="Review project scope"
              />
            </label>
            <label className="cs-field">
              <span>Due date and time</span>
              <input name="dueAt" type="datetime-local" required />
              <small>Uses your device&apos;s time zone.</small>
            </label>
          </div>
        </AdminForm>
      </div>

      <h2 className="cx-label">Activity</h2>
      <ol className="cx-list">
        {activity.map((event) => (
          <li className="cx-row" key={event.id}>
            <span className="cx-idle">
              <span className="cx-dot" />
            </span>
            <span className="cx-row-name">{event.action}</span>
            <span className="cx-row-note" />
            <span className="cx-row-num">
              <DateLabel value={event.created_at} />
            </span>
          </li>
        ))}
        {!activity.length && (
          <li className="cx-row">
            <span className="cx-idle">
              <span className="cx-dot" />
            </span>
            <span className="cx-row-name">No updates yet</span>
            <span className="cx-row-note" />
            <span className="cx-row-num">—</span>
          </li>
        )}
      </ol>
    </>
  );
}
