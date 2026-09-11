import { isAllowedOrigin } from '@/lib/crm/origin';
import { createSessionClient } from '@/lib/supabase/server';
export async function POST(request: Request) {
  if (!isAllowedOrigin(request))
    return Response.json({ error: 'Invalid origin' }, { status: 403 });
  try {
    const supabase = await createSessionClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user)
      return Response.json({ error: 'Sign in to continue.' }, { status: 401 });
    const { data: member, error: memberError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();
    if (user.id !== process.env.ADMIN_USER_ID || !member || memberError) {
      await supabase.auth.signOut();
      return Response.json(
        { error: 'This account does not have admin access.' },
        { status: 403 },
      );
    }
    return Response.json(
      { ok: true },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return Response.json(
      { error: 'Admin access is temporarily unavailable.' },
      { status: 503 },
    );
  }
}
