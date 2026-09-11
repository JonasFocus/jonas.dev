import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRequest } from '@/lib/crm/queries';
import { AdminForm } from '../../../forms';
import { DateLabel, FollowUps, statusLabels } from '../../../shared';
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
      <Link href="/admin/requests" className="admin-back">
        ← Requests
      </Link>
      <header className="admin-heading">
        <p className="admin-eyebrow">
          {request.service.replaceAll('-', ' ')} ·{' '}
          <DateLabel value={request.created_at} />
        </p>
        <h1>{request.name}</h1>
        <p>{request.company || 'Individual inquiry'}</p>
      </header>
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
            <AdminForm operation="note" id={id} label="Add note" reset>
              <label>
                Note
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
              operation="follow-up"
              id={id}
              label="Add follow-up"
              reset
            >
              <label>
                Next step
                <input
                  name="title"
                  required
                  maxLength={200}
                  placeholder="Review project scope"
                />
              </label>
              <label>
                Due date and time
                <input name="dueAt" type="datetime-local" required />
                <small>Uses your device&apos;s time zone.</small>
              </label>
            </AdminForm>
          </section>
        </div>
        <div className="admin-stack">
          <section className="admin-panel admin-padded">
            <h2>Request status</h2>
            <AdminForm operation="status" id={id} label="Update status">
              <label>
                Status
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
              <AdminForm operation="read" id={id} label="Mark as read" />
            )}
          </section>
          <section className="admin-panel admin-padded">
            <h2>Customer</h2>
            {request.customer_id ? (
              <Link
                className="admin-button"
                href={`/admin/customers/${request.customer_id}`}
              >
                View customer →
              </Link>
            ) : (
              <>
                <p className="admin-muted">
                  Create a customer record when you decide to work together. The
                  original request stays here.
                </p>
                <AdminForm
                  operation="convert"
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
              <p className="admin-muted">No updates yet.</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
