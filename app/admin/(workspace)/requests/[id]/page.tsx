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
import { DateLabel, FollowUps, Hero, statusLabels } from '../../../shared';
export default async function RequestDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getRequest(id);
  if (!detail) notFound();
  const { request, notes, activity, followUps } = detail;
  return (
    <>
      <p className="cs-crumb">
        <Link href="/admin/requests">← All requests</Link>
      </p>
      <Hero
        status={
          <>
            {(request.services ?? [request.service])
              .map((service) => service.replaceAll('-', ' '))
              .join(' · ')}{' '}
            · <DateLabel value={request.created_at} />
          </>
        }
        title={request.name}
        subtitle={request.company || 'Individual inquiry'}
      />
      <div className="admin-detail-grid">
        <div className="admin-stack">
          <section className="admin-panel admin-padded">
            <h2>Project brief</h2>
            <p className="admin-prose">{request.description}</p>
            <dl className="admin-facts">
              <div>
                <dt>Email</dt>
                <dd>{request.email}</dd>
              </div>
              <div>
                <dt>Budget</dt>
                <dd>{request.budget || 'Not provided'}</dd>
              </div>
              <div>
                <dt>Timing</dt>
                <dd>{request.timeline || 'Not provided'}</dd>
              </div>
              <div>
                <dt>Case study</dt>
                <dd>{request.case_study || 'General inquiry'}</dd>
              </div>
            </dl>
          </section>
          <section className="admin-panel admin-padded">
            <h2>Internal notes</h2>
            <div className="admin-notes">
              {notes.map((note) => (
                <article key={note.id}>
                  <p className="admin-prose">{note.body}</p>
                  <small>
                    <DateLabel value={note.created_at} />
                  </small>
                </article>
              ))}
            </div>
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
          </section>
          <section className="admin-panel admin-padded">
            <h2>Follow-ups</h2>
            <FollowUps items={followUps} />
            <AdminForm
              action={addFollowUpAction}
              id={id}
              label="Add follow-up"
              reset
            >
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
            </AdminForm>
          </section>
        </div>
        <div className="admin-stack">
          <section className="admin-panel admin-padded">
            <h2>Request status</h2>
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
          </section>
          <section className="admin-panel admin-padded">
            <h2>Customer</h2>
            {request.customer_id ? (
              <Link
                className="cs-button"
                href={`/admin/customers/${request.customer_id}`}
              >
                View customer →
              </Link>
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
          </section>
          <section className="admin-panel admin-padded">
            <h2>Activity</h2>
            {activity.length ? (
              <ol className="admin-activity">
                {activity.map((event) => (
                  <li key={event.id}>
                    <p>{event.action.replaceAll('_', ' ')}</p>
                    <small>
                      <DateLabel value={event.created_at} />
                    </small>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="cs-hint">No updates yet.</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
