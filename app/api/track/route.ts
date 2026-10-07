import { createHmac } from 'node:crypto';
import { isAllowedOrigin } from '@/lib/crm/origin';
import {
  beatSchema,
  describeAgent,
  isBot,
  referrerHost,
} from '@/lib/analytics/beat';
import { createIntakeClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
// Tracking never tells the browser why a beacon was dropped; the visitor should not notice either way.
const done = () =>
  new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return done();
  const userAgent = request.headers.get('user-agent') ?? '';
  if (isBot(userAgent)) return done();
  const secret = process.env.INTAKE_HASH_SECRET;
  if (!secret || secret.length < 32) return done();
  const text = await request.text().catch(() => '');
  if (!text || text.length > 8000) return done();
  let input: unknown;
  try {
    input = JSON.parse(text);
  } catch {
    return done();
  }
  const parsed = beatSchema.safeParse(input);
  if (!parsed.success) return done();
  const beat = parsed.data;
  // Same trust rule as intake: on Vercel only the edge-set header is used.
  const ip = process.env.VERCEL
    ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
    : 'local';
  if (!ip) return done();
  const day = new Date().toISOString().slice(0, 10);
  const visitorKey = createHmac('sha256', secret)
    .update(`visitor:${day}:${ip}:${userAgent}`)
    .digest('hex')
    .slice(0, 32);
  const country = request.headers.get('x-vercel-ip-country');
  try {
    await createIntakeClient().rpc('track_visit', {
      p_session: beat.session,
      p_visitor_key: visitorKey,
      p_meta: {
        path: beat.path,
        referrer: referrerHost(beat.referrer, new URL(request.url).hostname),
        utmSource: beat.utmSource,
        country: country && /^[A-Z]{2}$/.test(country) ? country : undefined,
        ...describeAgent(userAgent),
      },
      p_events: beat.events,
      p_engaged: beat.engaged,
    });
  } catch {
    /* Analytics must never break the page; a lost beacon is acceptable. */
  }
  return done();
}
