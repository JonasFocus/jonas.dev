import Link from 'next/link';
import { getFollowUps } from '@/lib/crm/queries';
import { Hero, FollowUps } from '../../shared';
import { Pagination, pageNumber } from '../../pagination';

export default async function FollowUpPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; view?: string }>;
}) {
  const filters = await searchParams;
  const page = pageNumber(filters.page);
  const completed = filters.view === 'completed';
  const items = await getFollowUps({ page, completed });
  return (
    <>
      <Hero
        title="Follow-ups"
        subtitle={
          completed
            ? 'Completed next steps, with the most recently finished first. Dates are shown in Central time.'
            : 'Your next steps, with the closest due dates first. Dates are shown in Central time.'
        }
      />
      <nav aria-label="Follow-up status" className="cs-toolbar">
        <Link
          className="cs-filter"
          href="/admin/follow-ups"
          aria-current={!completed ? 'page' : undefined}
        >
          Open
        </Link>
        <Link
          className="cs-filter"
          href="/admin/follow-ups?view=completed"
          aria-current={completed ? 'page' : undefined}
        >
          Completed
        </Link>
        <span className="cs-count">{Math.min(items.length, 50)} shown</span>
      </nav>
      <FollowUps items={items.slice(0, 50)} showRequest />
      <Pagination
        path="/admin/follow-ups"
        page={page}
        hasNext={items.length > 50}
        filters={{ view: completed ? 'completed' : undefined }}
      />
    </>
  );
}
