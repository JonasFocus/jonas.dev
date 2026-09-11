import 'server-only';
import { z } from 'zod';
import { requireOwner } from './auth';
import { idSchema, statusSchema } from './validation';
function parse<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success)
    throw new Error(
      result.error.issues[0]?.message ?? 'Check the entered values.',
    );
  return result.data;
}
function checked(result: { data: unknown; error: unknown }) {
  if (result.error || !result.data)
    throw new Error('The change could not be saved. Refresh and try again.');
}
export async function updateRequest(input: { id: string; status: string }) {
  const data = parse(z.object({ id: idSchema, status: statusSchema }), input);
  const { supabase } = await requireOwner();
  checked(
    await supabase
      .from('requests')
      .update({ status: data.status })
      .eq('id', data.id)
      .select('id')
      .single(),
  );
}
export async function markRead(id: string) {
  parse(idSchema, id);
  const { supabase } = await requireOwner();
  const { error } = await supabase
    .from('requests')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
    .is('read_at', null);
  if (error) throw new Error('Could not mark this request as read.');
}
export async function addNote(input: { requestId: string; body: string }) {
  const d = parse(
    z.object({
      requestId: idSchema,
      body: z.string().trim().min(1, 'Write a note first.').max(5000),
    }),
    input,
  );
  const { supabase } = await requireOwner();
  checked(
    await supabase
      .from('request_notes')
      .insert({ request_id: d.requestId, body: d.body })
      .select('id')
      .single(),
  );
}
export async function addFollowUp(input: {
  requestId: string;
  title: string;
  dueAt: string;
}) {
  const d = parse(
    z.object({
      requestId: idSchema,
      title: z.string().trim().min(1, 'Enter a title.').max(200),
      dueAt: z.iso.datetime({ offset: true }),
    }),
    input,
  );
  const { supabase } = await requireOwner();
  checked(
    await supabase
      .from('follow_ups')
      .insert({ request_id: d.requestId, title: d.title, due_at: d.dueAt })
      .select('id')
      .single(),
  );
}
export async function completeFollowUp(id: string) {
  parse(idSchema, id);
  const { supabase } = await requireOwner();
  checked(
    await supabase
      .from('follow_ups')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', id)
      .select('id')
      .single(),
  );
}
export async function convertToCustomer(requestId: string) {
  parse(idSchema, requestId);
  const { supabase } = await requireOwner();
  const { data, error } = await supabase.rpc('convert_request', {
    p_request_id: requestId,
  });
  if (error)
    throw new Error(
      'Could not create the customer. Spam requests cannot be converted.',
    );
  return idSchema.parse(data);
}
export async function updateCustomer(input: {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
}) {
  const { id, ...data } = parse(
    z.object({
      id: idSchema,
      name: z.string().trim().min(2).max(120),
      email: z.email().trim().toLowerCase().max(254),
      company: z.string().trim().max(160),
      status: z.enum(['active', 'inactive']),
    }),
    input,
  );
  const { supabase } = await requireOwner();
  checked(
    await supabase
      .from('customers')
      .update({ ...data, company: data.company || null })
      .eq('id', id)
      .select('id')
      .single(),
  );
}
