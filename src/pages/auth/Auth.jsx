import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell, Feedback, Field } from '../../components/auth/AuthUI';
import { Button } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import { authError, safeDestination, validateAuth } from '../../utils/validators';

const copy = {
  login: ['Welcome back.', 'Sign in to stay connected with our community.'],
  register: ['Join our community.', 'Create your account and be part of a better tomorrow.'],
  forgot: ['Forgot your password?', 'We’ll email you a link to choose a new password.'],
  reset: ['Choose a new password.', 'Use a unique password with at least 8 characters.'],
  verify: ['Check your inbox.', 'Follow the confirmation link in your email to verify your account.'],
};

export default function AuthPage({ mode, admin = false }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [complete, setComplete] = useState(false);
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);
  const update = event => setValues(previous => ({ ...previous, [event.target.name]: event.target.value }));
  const destination = safeDestination(location.state?.from || (admin ? '/admin/dashboard' : '/dashboard'));
  if (auth.loading) return <AuthShell title="One moment…" description="Restoring your session."/>;
  if (auth.recovering && mode !== 'reset') return <Navigate to="/reset-password" replace/>;
  if (auth.user && ['login', 'register'].includes(mode)) {
    if (admin && !auth.isAdmin) return <AuthShell title="Administrator access required" description="Your account is signed in but does not have administrator access."><Button to="/dashboard">Go to your account</Button></AuthShell>;
    return <Navigate to={destination} replace/>;
  }

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setError(''); setMessage('');
    const validation = validateAuth(values, mode);
    if (validation) { setError(validation); return; }
    setBusy(true);
    const email = values.email.trim();
    try {
      if (mode === 'login') { await auth.signIn(email, values.password); navigate(destination, { replace: true }); }
      if (mode === 'register') {
        const data = await auth.signUp(email, values.password, values.name.trim());
        navigate(data.session ? '/dashboard' : '/verify-email', { replace: true });
      }
      if (mode === 'forgot') {
        await auth.forgotPassword(email);
        setMessage('If an account is eligible, a reset link will arrive shortly. Check your spam folder too.');
        setCooldown(60);
      }
      if (mode === 'verify') {
        await auth.resend(email);
        setMessage('If confirmation is needed, a new email will arrive shortly.'); setCooldown(60);
      }
      if (mode === 'reset') {
        await auth.updatePassword(values.password);
        setValues(previous => ({ ...previous, password: '', confirm: '' }));
        setComplete(true); setMessage('Your password has been updated.');
      }
    } catch (failure) { setError(authError(failure)); }
    finally { setBusy(false); }
  }

  const [title, description] = copy[mode];
  const linkError = mode === 'reset' && new URLSearchParams(location.hash.slice(1)).has('error');
  const invalidRecovery = mode === 'reset' && (!auth.recovering || !auth.user || linkError);
  return <AuthShell title={title} description={description}>
    <Feedback error>{error}</Feedback><Feedback>{message}</Feedback>
    {complete ? <Button to="/dashboard">Go to dashboard</Button> : invalidRecovery ? <><Feedback error>This password reset link is missing, expired, or has already been used. Please request a new link.</Feedback><Button to="/forgot-password">Request a new link</Button></> :
      <form className="auth-form grid gap-5" onSubmit={submit}>
        {mode === 'register' && <Field label="Full name" name="name" autoComplete="name" maxLength={100} value={values.name} onChange={update}/>}
        {mode !== 'reset' && <Field label="Email address" name="email" type="email" autoComplete="email" maxLength={254} value={values.email} onChange={update}/>}
        {['login', 'register', 'reset'].includes(mode) && <Field label="Password" name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={mode === 'login' ? undefined : 8} value={values.password} onChange={update}/>}
        {['register', 'reset'].includes(mode) && <><p className="auth-hint">Use at least 8 characters. Additional security requirements may apply.</p><Field label="Confirm password" name="confirm" type="password" autoComplete="new-password" minLength={8} value={values.confirm} onChange={update}/></>}
        <Button type="submit" className="w-full" disabled={busy || !auth.configured || cooldown > 0}>{busy ? 'Please wait…' : cooldown ? `Try again in ${cooldown}s` : { login: 'Sign in', register: 'Create account', forgot: 'Send reset link', reset: 'Update password', verify: 'Resend confirmation email' }[mode]}</Button>
      </form>}
    <div className="auth-links flex flex-wrap gap-4 mt-6">
      {mode === 'login' ? <><Link to="/register">Create an account</Link><Link to="/forgot-password">Forgot password?</Link><Link to="/verify-email">Verify your email</Link></> : <Link to="/login">Back to sign in</Link>}
    </div>
  </AuthShell>;
}

export function AuthCallback() {
  const { user, loading, recovering } = useAuth();
  const location = useLocation();
  const failed = new URLSearchParams(location.hash.slice(1)).has('error') || new URLSearchParams(location.search).has('error');
  if (loading) return <AuthShell title="Verifying your email…" description="Please wait while we confirm your account."/>;
  if (!failed && recovering) return <Navigate to="/reset-password" replace/>;
  if (!failed && user) return <Navigate to="/dashboard" replace/>;
  return <AuthShell title="Let’s try that again." description="This confirmation link is missing, expired, or has already been used."><Button to="/verify-email">Request confirmation email</Button><div className="auth-links mt-6"><Link to="/login">Already verified? Sign in</Link></div></AuthShell>;
}
