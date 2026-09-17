import 'server-only';
import { requireOwner } from './auth';
import {
  activityRecordSchema,
  customerRecordSchema,
  followUpRecordSchema,
  idSchema,
  noteRecordSchema,
  requestRecordSchema,
  statusSchema,
} from './validation';

const requestColumns =
  'id,created_at,name,email,company,service,services,description,budget,timeline,case_study,status,read_at,customer_id';
function searchTerm(value?: string) {
  return value
    ?.trim()
    .slice(0, 120)
    .replace(/[,%()\\]/g, ' ')
    .trim();
}
function pageOffset(page = 1) {
  return (Math.max(1, Math.min(1000000, Math.floor(page) || 1)) - 1) * 50;
}
function fail(error: unknown) {
  if (error) throw new Error('Could not load records. Please try again.');
}
export async function getRequests(
  filters: { q?: string; status?: string; page?: number } = {},
) {
  const { supabase } = await requireOwner();
  let query = supabase
    .from('requests')
    .select(requestColumns)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .range(pageOffset(filters.page), pageOffset(filters.page) + 50);
  const status = statusSchema.safeParse(filters.status);
  if (status.success) query = query.eq('status', status.data);
  const q = searchTerm(filters.q);
  if (q)
    query = query.or(
      `name.ilike.%${q}%,email.ilike.%${q}%,company.ilike.%${q}%`,
    );
  const { data, error } = await query;
  fail(error);
  return requestRecordSchema.array().parse(data);
}
export async function getRequest(id: string) {
  if (!idSchema.safeParse(id).success) return null;
  const { supabase } = await requireOwner();
  const [r, n, a, f] = await Promise.all([
    supabase.from('requests').select(requestColumns).eq('id', id).maybeSingle(),
    supabase
      .from('request_notes')
      .select('*')
      .eq('request_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('activity_events')
      .select('*')
      .eq('request_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('follow_ups')
      .select('*')
      .eq('request_id', id)
      .order('due_at'),
  ]);
  [r, n, a, f].forEach((result) => fail(result.error));
  if (!r.data) return null;
  return {
    request: requestRecordSchema.parse(r.data),
    notes: noteRecordSchema.array().parse(n.data),
    activity: activityRecordSchema.array().parse(a.data),
    followUps: followUpRecordSchema.array().parse(f.data),
  };
}
export async function getCustomers(
  filters: { q?: string; page?: number } = {},
) {
  const { supabase } = await requireOwner();
  let query = supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .range(pageOffset(filters.page), pageOffset(filters.page) + 50);
  const q = searchTerm(filters.q);
  if (q)
    query = query.or(
      `name.ilike.%${q}%,email.ilike.%${q}%,company.ilike.%${q}%`,
    );
  const { data, error } = await query;
  fail(error);
  return customerRecordSchema.array().parse(data);
}
export async function getCustomer(id: string) {
  if (!idSchema.safeParse(id).success) return null;
  const { supabase } = await requireOwner();
  const [c, r] = await Promise.all([
    supabase.from('customers').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('requests')
      .select(requestColumns)
      .eq('customer_id', id)
      .order('created_at', { ascending: false }),
  ]);
  fail(c.error);
  fail(r.error);
  if (!c.data) return null;
  return {
    customer: customerRecordSchema.parse(c.data),
    requests: requestRecordSchema.array().parse(r.data),
  };
}
export async function getFollowUps(
  filters: { page?: number; completed?: boolean } = {},
) {
  const { supabase } = await requireOwner();
  let query = supabase.from('follow_ups').select('*');
  query = filters.completed
    ? query
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
    : query.is('completed_at', null).order('due_at');
  const { data, error } = await query
    .order('id')
    .range(pageOffset(filters.page), pageOffset(filters.page) + 50);
  fail(error);
  return followUpRecordSchema.array().parse(data);
}
export async function getDashboard() {
  const { supabase } = await requireOwner();
  const [r, f, c, recent] = await Promise.all([
    supabase
      .from('requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new'),
    supabase
      .from('follow_ups')
      .select('id', { count: 'exact', head: true })
      .is('completed_at', null)
      .lt('due_at', new Date().toISOString()),
    supabase
      .from('customers')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabase
      .from('requests')
      .select(requestColumns)
      .order('created_at', { ascending: false })
      .limit(6),
  ]);
  [r, f, c, recent].forEach((result) => fail(result.error));
  return {
    newRequests: r.count ?? 0,
    overdueFollowUps: f.count ?? 0,
    customers: c.count ?? 0,
    recentRequests: requestRecordSchema.array().parse(recent.data),
  };
}
