import 'server-only';
import { redirect } from 'next/navigation';
import { createSessionClient } from '@/lib/supabase/server';
export async function requireOwner() {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) redirect('/admin/login');
  const ownerId = process.env.ADMIN_USER_ID;
  if (!ownerId || user.id !== ownerId)
    throw new Error('This account does not have admin access.');
  const { data: member, error: memberError } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (memberError || !member)
    throw new Error('This account does not have admin access.');
  return { supabase, user };
}
