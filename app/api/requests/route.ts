import { isAllowedOrigin } from '@/lib/crm/origin';
import { z } from 'zod';
import { createHash, createHmac } from 'node:crypto';
import { inquirySchema } from '@/lib/crm/validation';
import { createIntakeClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
const reply = (body: object, status: number) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export async function POST(request: Request) {
  if (!isAllowedOrigin(request))
    return reply({ error: 'Please submit this form from the website.' }, 403);
  if (!request.headers.get('content-type')?.includes('application/json'))
    return reply({ error: 'Expected a form submission.' }, 415);
  const reader = request.body?.getReader();
  if (!reader) return reply({ error: 'No form was submitted.' }, 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16000) {
        await reader.cancel();
        return reply({ error: 'Your request is too long.' }, 413);
      }
      chunks.push(value);
    }
  } catch {
    return reply(
      { error: 'The submission was interrupted. Please try again.' },
      400,
    );
  }
  let input: unknown;
  try {
    input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return reply({ error: 'The submission could not be read.' }, 400);
  }
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success)
    return reply(
      {
        error: parsed.error.issues[0]?.message ?? 'Please check your request.',
        fields: z.flattenError(parsed.error).fieldErrors,
      },
      400,
    );
  if (parsed.data.website)
    return reply({ error: 'This request could not be accepted.' }, 400);
  const secret = process.env.INTAKE_HASH_SECRET;
  if (!secret || secret.length < 32)
    return reply(
      {
        error: 'Requests are temporarily unavailable. Please try again later.',
      },
      503,
    );
  const { website, submissionId, ...content } = parsed.data;
  void website;
  const fingerprint = createHash('sha256')
    .update(JSON.stringify(content))
    .digest('hex');
  // Vercel overwrites this header at the edge; do not trust arbitrary forwarded headers.
  const ip = process.env.VERCEL
    ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
    : 'local';
  if (!ip)
    return reply(
      { error: 'Your request could not be verified. Please try again.' },
      503,
    );
  const hash = (value: string) =>
    createHmac('sha256', secret).update(value).digest('hex');
  try {
    const { data, error } = await createIntakeClient().rpc('submit_request', {
      p_input: { ...content, submissionId },
      p_fingerprint: fingerprint,
      p_ip_key: hash(`ip:${ip}`),
      p_email_key: hash(`email:${content.email}`),
    });
    if (error) {
      if (error.message.includes('RATE_LIMIT'))
        return Response.json(
          { error: 'Too many requests. Please try again in an hour.' },
          {
            status: 429,
            headers: { 'Retry-After': '3600', 'Cache-Control': 'no-store' },
          },
        );
      if (error.message.includes('SUBMISSION_CONFLICT'))
        return reply(
          {
            error:
              'This submission was already used. Reload the page to start a new request.',
          },
          409,
        );
      return reply(
        { error: 'Your request was not saved. Please try again.' },
        503,
      );
    }
    if (typeof data !== 'string')
      return reply(
        { error: 'Your request could not be confirmed. Please try again.' },
        503,
      );
    return reply({ ok: true, reference: data }, 201);
  } catch {
    return reply(
      {
        error: 'Requests are temporarily unavailable. Please try again later.',
      },
      503,
    );
  }
}
