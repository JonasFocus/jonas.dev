import type { SessionRecord } from '@/lib/analytics/queries';

export function duration(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${String(s % 60).padStart(2, '0')}s`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
}
export function TimeLabel({ value }: { value: string }) {
  return (
    <time dateTime={value}>
      {new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/Chicago',
      }).format(new Date(value))}
    </time>
  );
}
export function source(session: SessionRecord) {
  return session.utm_source || session.referrer || 'Direct';
}
export function client(session: SessionRecord) {
  return [session.device, session.browser, session.os, session.country]
    .filter(Boolean)
    .join(' · ');
}
export const eventLabels: Record<string, string> = {
  pageview: 'Viewed',
  click: 'Clicked',
  outbound: 'Left for',
  scroll: 'Scrolled',
  form: 'Submitted',
};
