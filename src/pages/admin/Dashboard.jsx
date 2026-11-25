import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthShell, Feedback } from '../../components/auth/AuthUI';
import { Button } from '../../components/UI';
import { authError } from '../../utils/validators';

export default function Dashboard({ admin = false }) {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function logout() {
    setBusy(true); setError('');
    try { await signOut(); navigate('/login', { replace: true }); }
    catch (failure) { setError(authError(failure)); setBusy(false); }
  }
  return <AuthShell title={admin ? "Administrator dashboard." : "Your community dashboard."} description="Welcome. Good things begin with people coming together.">
    <dl className="auth-details grid gap-4"><div><dt>Name</dt><dd>{user.user_metadata?.full_name || 'Community member'}</dd></div><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Email status</dt><dd>{user.email_confirmed_at ? 'Verified' : 'Verification pending'}</dd></div></dl>
    <div className="flex flex-wrap gap-3 mt-6">{isAdmin && !admin && <Button to="/admin/dashboard">Administration</Button>}<Button to="/programs">Explore programs</Button><Button to="/volunteer" secondary>Get involved</Button></div>
    <Feedback error>{error}</Feedback><button className="button button-secondary mt-6" onClick={logout} disabled={busy}>{busy ? 'Signing outâ€¦' : 'Sign out'}</button>
  </AuthShell>;
}

