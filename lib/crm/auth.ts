import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createSessionClient } from '@/lib/supabase/server';
// public.admin_users is the only owner list; RLS enforces the same membership on every table.
export const requireOwner = cache(async () => {
  const supabase = await createSessionClient();
  // getUser, not getClaims: it also rejects sessions revoked on the Auth server.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) redirect('/admin/login');
  const { data: member, error: memberError } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (memberError || !member)
    throw new Error('This account does not have admin access.');
  return { supabase, user };
});
