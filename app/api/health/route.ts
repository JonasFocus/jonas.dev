import { createIntakeClient } from '@/lib/supabase/server';
export async function GET() {
  try {
    if (
      !process.env.ADMIN_USER_ID ||
      !process.env.APP_URL ||
      (process.env.INTAKE_HASH_SECRET?.length ?? 0) < 32
    )
      throw new Error('Configuration incomplete');
    const { data, error } = await createIntakeClient()
      .from('admin_users')
      .select('user_id')
      .eq('user_id', process.env.ADMIN_USER_ID)
      .maybeSingle();
    return Response.json(
      { status: !error && data ? 'ready' : 'unavailable' },
      {
        status: !error && data ? 200 : 503,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  } catch {
    return Response.json(
      { status: 'unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
