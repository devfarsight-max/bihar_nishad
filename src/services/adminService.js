import { supabase } from '../lib/supabaseClient';

export function adminAccessError(message = 'This account does not have administrator access.', code = 'admin_access_denied') {
  return Object.assign(new Error(message), { code });
}

// Expected schema: public.admin_users.user_id references auth.users.id (unique).
// RLS must allow users to read their own membership, with no public membership writes.
export async function isAdminUser(userId) {
  if (!supabase) throw adminAccessError('Authentication is not configured.', 'auth_not_configured');
  if (!userId) return false;
  const { data: { user }, error: identityError } = await supabase.auth.getUser();
  if (identityError) throw adminAccessError('Unable to verify your identity. Please sign in again.', 'admin_check_failed');
  if (!user || user.id !== userId) return false;
  const { data, error } = await supabase.schema('public').from('admin_users')
    .select('user_id').eq('user_id', user.id).maybeSingle();
  if (error) throw adminAccessError('Unable to verify administrator access. Please try again.', 'admin_check_failed');
  return data?.user_id === user.id;
}

// Call before future admin operations; database RLS must enforce authorization too.
export async function requireAdmin(userId) {
  if (!await isAdminUser(userId)) throw adminAccessError();
  return true;
}
