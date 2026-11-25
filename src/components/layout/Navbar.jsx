import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, UserRound, X } from 'lucide-react';
import { navigation, site } from '../../data/content';
import Button from '../common/Button';
import { authError } from '../../utils/validators';

const MotionNavLink = motion.create(NavLink);

export default function Navbar() {
  const reduced = useReducedMotion();
  const { isAuthenticated, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  async function handleLogout() {
    if (pending.current) return;
    pending.current = true;
    setSigningOut(true);
    setError('');
    try {
      await logout();
      setOpen(false);
      navigate('/login', { replace: true });
    } catch (failure) {
      setError(authError(failure));
    } finally {
      pending.current = false;
      setSigningOut(false);
    }
  }
  const accountAction = (className) => isAuthenticated
    ? <motion.button whileTap={reduced ? undefined : { scale: 0.96 }} type="button" className={`${className} account-logout`} onClick={handleLogout} disabled={signingOut}><LogOut size={15} aria-hidden="true"/>{signingOut ? 'Logging out...' : 'Logout'}</motion.button>
    : loading ? <span className={className} role="status">Checking session...</span>
      : <Link className={className} to="/login"><UserRound size={15} aria-hidden="true"/>Sign in</Link>;
  useEffect(() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'instant' }); document.title = `${navigation.find(([, path]) => path === pathname)?.[0] || 'Get involved'} | ${site.name}`; }, [pathname]);
  return (<motion.header initial={reduced ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="site-header"><div className="container nav-inner"><Link to="/" className="brand" aria-label={`${site.name} home`}><img className="brand-mark" src="/logo.svg" alt="" width="46" height="46"/><span>{site.name}<small>COMMUNITY. DIGNITY. OPPORTUNITY.</small></span></Link><nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([label, path]) => <MotionNavLink whileHover={{ color: "#1553df" }} key={path} to={path} end={path === '/'}>{label}</MotionNavLink>)}</nav><div className="nav-actions">{accountAction("account-link")}<Button to="/donate" className="nav-donate">Support us</Button></div><motion.button whileTap={reduced ? undefined : { scale: 0.92 }} type="button" className="mobile-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X/> : <Menu/>}</motion.button></div><AnimatePresence initial={false}>{open && <motion.nav key="mobile-menu" initial={{ opacity: 0, height: reduced ? "auto" : 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: reduced ? "auto" : 0 }} style={{ overflow: "hidden" }} id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{navigation.map(([label, path]) => <MotionNavLink whileHover={{ color: "#1553df" }} key={path} to={path} end={path === '/'}>{label}</MotionNavLink>)}{accountAction("mobile-account-link")}<Link to="/donate">Make a difference ↗</Link></motion.nav>}</AnimatePresence>{error && <div className="container account-error" role="alert">{error}</div>}</motion.header>);
}
