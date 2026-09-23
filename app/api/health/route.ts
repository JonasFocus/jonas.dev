import { createIntakeClient } from '@/lib/supabase/server';
export async function GET() {
  try {
    if (
      !process.env.APP_URL ||
      (process.env.INTAKE_HASH_SECRET?.length ?? 0) < 32
    )
      throw new Error('Configuration incomplete');
    const { count, error } = await createIntakeClient()
      .from('admin_users')
      .select('user_id', { count: 'exact', head: true });
    const ready = !error && count === 1;
    return Response.json(
      { status: ready ? 'ready' : 'unavailable' },
      {
        status: ready ? 200 : 503,
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
