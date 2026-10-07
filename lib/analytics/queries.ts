import 'server-only';
import { z } from 'zod';
import { requireOwner } from '@/lib/crm/auth';

const num = z.coerce.number();
const ranking = z.array(z.object({ label: z.string(), count: num }));
const statsSchema = z.object({
  totals: z.object({
    sessions: num,
    visitors: num,
    pageviews: num,
    avgEngaged: num,
    medianEngaged: num,
    bounceRate: num,
    pagesPerSession: num,
  }),
  live: num,
  daily: z.array(
    z.object({
      day: z.string(),
      sessions: num,
      visitors: num,
      pageviews: num,
      avgEngaged: num,
    }),
  ),
  pages: ranking,
  referrers: ranking,
  clicks: ranking,
  devices: ranking,
  countries: ranking,
  browsers: ranking,
});
export type VisitorStats = z.infer<typeof statsSchema>;
export const sessionRecordSchema = z.object({
  id: z.uuid(),
  started_at: z.string(),
  last_seen_at: z.string(),
  engaged_seconds: num,
  landing_path: z.string(),
  referrer: z.string().nullable(),
  utm_source: z.string().nullable(),
  device: z.string(),
  browser: z.string().nullable(),
  os: z.string().nullable(),
  country: z.string().nullable(),
  pageviews: num,
  events: num,
});
export type SessionRecord = z.infer<typeof sessionRecordSchema>;
const eventRecordSchema = z.object({
  id: num,
  session_id: z.uuid(),
  created_at: z.string(),
  type: z.string(),
  path: z.string(),
  label: z.string().nullable(),
});
export type VisitEventRecord = z.infer<typeof eventRecordSchema>;
const sessionColumns =
  'id,started_at,last_seen_at,engaged_seconds,landing_path,referrer,utm_source,device,browser,os,country,pageviews,events';
function fail(error: unknown) {
  if (error)
    throw new Error('Could not load visit statistics. Please try again.');
}
const rangeOptions = [1, 7, 30, 90] as const;
export function rangeDays(value: string | undefined) {
  const days = Number(value);
  return rangeOptions.find((option) => option === days) ?? 7;
}
export async function getVisitorStats(days: number) {
  const { supabase } = await requireOwner();
  const { data, error } = await supabase.rpc('visitor_stats', { p_days: days });
  fail(error);
  return statsSchema.parse(data);
}
export async function getVisitSessions(page = 1) {
  const { supabase } = await requireOwner();
  const offset =
    (Math.max(1, Math.min(1000000, Math.floor(page) || 1)) - 1) * 50;
  const { data, error } = await supabase
    .from('visitor_sessions')
    .select(sessionColumns)
    .order('started_at', { ascending: false })
    .order('id', { ascending: false })
    .range(offset, offset + 50);
  fail(error);
  return sessionRecordSchema.array().parse(data);
}
export async function getRecentVisitEvents(limit = 25) {
  const { supabase } = await requireOwner();
  const { data, error } = await supabase
    .from('visitor_events')
    .select('*')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit);
  fail(error);
  return eventRecordSchema.array().parse(data);
}
export async function getVisitSession(id: string) {
  if (!z.uuid().safeParse(id).success) return null;
  const { supabase } = await requireOwner();
  const [s, e] = await Promise.all([
    supabase
      .from('visitor_sessions')
      .select(sessionColumns)
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('visitor_events')
      .select('*')
      .eq('session_id', id)
      .order('created_at')
      .order('id')
      .limit(1000),
  ]);
  fail(s.error);
  fail(e.error);
  if (!s.data) return null;
  return {
    session: sessionRecordSchema.parse(s.data),
    events: eventRecordSchema.array().parse(e.data),
  };
}
