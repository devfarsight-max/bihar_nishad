import { supabase } from '../lib/supabaseClient';

export async function runAuth(action) {
  if (!supabase) throw new Error('Authentication is not configured yet. Please contact the website team.');
  const result = await action(supabase.auth);
  if (result.error) throw result.error;
  return result.data;
}

export async function signIn(email, password) {
  return runAuth(auth => auth.signInWithPassword({ email: email.trim(), password }));
}

export const signOut = () => runAuth(auth => auth.signOut({ scope: 'local' }));
