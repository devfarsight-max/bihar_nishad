import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { authConfigured, authRedirect, supabase } from '../lib/supabaseClient';
import { runAuth, signIn, signOut } from '../services/authService';
import { isAdminUser } from '../services/adminService';

export const AuthContext = createContext(null);
const empty = { session: null, user: null, isAdmin: false, recovering: false, error: '' };

export function AuthProvider({ children }) {
  const [state, setState] = useState({ ...empty, loading: authConfigured });
  const [candidate, setCandidate] = useState(null);
  const revision = useRef(0);
  const recovery = useRef(false);
  const pending = useRef(false);
  const lastToken = useRef(null);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    let received = false;
    const receive = (event, session) => {
      if (!active) return;
      if (event === 'SIGNED_IN' && session?.access_token === lastToken.current) return;
      lastToken.current = session?.access_token ?? null;
      const version = ++revision.current;
      if (!session) recovery.current = false;
      if (event === 'PASSWORD_RECOVERY') recovery.current = true;
      setState({ ...empty, session, user: session?.user ?? null, recovering: recovery.current, loading: Boolean(session) });
      setCandidate(session ? { session, version, recovering: recovery.current } : null);
    };
    // Never await Supabase calls inside this callback: it runs under the auth lock.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      received = true;
      receive(event, session);
    });
    const timer = setTimeout(() => {
      if (active && !received) setState({ ...empty, loading: false, error: 'Session restoration timed out. Please reload or sign in again.' });
    }, 15000);
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active || received) return;
      if (error) throw error;
      receive('INITIAL_SESSION', data.session);
    }).catch(() => {
      if (active && !received) setState({ ...empty, loading: false, error: 'Your session could not be restored. Please sign in again.' });
    });
    return () => { active = false; ++revision.current; clearTimeout(timer); subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!candidate) return;
    let active = true;
    const current = () => active && revision.current === candidate.version;
    const commit = (isAdmin, error = '') => {
      if (current()) setState({ session: candidate.session, user: candidate.session.user, isAdmin, error, loading: false, recovering: recovery.current });
    };
    const timer = setTimeout(() => {
      commit(false, 'Administrator verification timed out. Reload to try again.');
      active = false;
    }, 12000);
    isAdminUser(candidate.session.user.id).then(result => commit(result)).catch(error => commit(false, error.message)).finally(() => clearTimeout(timer));
    return () => { active = false; clearTimeout(timer); };
  }, [candidate]);

  async function exclusive(action) {
    if (pending.current) throw new Error('An authentication request is already in progress.');
    pending.current = true;
    try { return await action(); } finally { pending.current = false; }
  }
  const login = (email, password) => exclusive(() => signIn(email, password));
  const register = (email, password, name) => exclusive(() => runAuth(auth => auth.signUp({ email: email.trim(), password, options: { data: { full_name: name }, emailRedirectTo: authRedirect('/auth/callback') } })));
  const logout = () => exclusive(async () => {
    await signOut();
    ++revision.current;
    recovery.current = false;
    setCandidate(null);
    setState({ ...empty, loading: false });
  });
  const resetPassword = email => runAuth(auth => auth.resetPasswordForEmail(email.trim(), { redirectTo: authRedirect('/reset-password') }));
  const updatePassword = password => exclusive(async () => {
    if (!state.recovering || !state.user) throw new Error('Open a valid password reset link from your email first.');
    const data = await runAuth(auth => auth.updateUser({ password }));
    recovery.current = false;
    setState(previous => ({ ...previous, recovering: false }));
    return data;
  });
  const value = {
    ...state, configured: authConfigured, isAuthenticated: Boolean(state.user && state.session),
    login, register, logout, resetPassword, updatePassword,
    signIn: login, signUp: register, signOut: logout, forgotPassword: resetPassword,
    resend: email => runAuth(auth => auth.resend({ type: 'signup', email: email.trim(), options: { emailRedirectTo: authRedirect('/auth/callback') } })),
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
