import {
  getRecentVisitEvents,
  getVisitorStats,
  getVisitSessions,
  rangeDays,
} from '@/lib/analytics/queries';
import { pageNumber } from '../../pagination';
import { AnalyticsView } from './view';

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string; page?: string }>;
}) {
  const filters = await searchParams;
  const days = rangeDays(filters.days);
  const page = pageNumber(filters.page);
  const [stats, sessions, events] = await Promise.all([
    getVisitorStats(days),
    getVisitSessions(page),
    getRecentVisitEvents(25),
  ]);
  return (
    <AnalyticsView
      stats={stats}
      sessions={sessions}
      events={events}
      days={days}
      page={page}
    />
  );
}
