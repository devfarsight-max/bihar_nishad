import { Link } from 'react-router-dom';
import { AuthShell } from '../../components/auth/AuthUI';
import Dashboard from './Dashboard';

export default function AdminPage({ section = 'dashboard' }) {
  return <><nav className="container flex flex-wrap gap-4 mt-6" aria-label="Administration">{['dashboard', 'profile', 'projects', 'gallery', 'settings'].map(item => <Link key={item} to={`/admin/${item}`}>{item[0].toUpperCase() + item.slice(1)}</Link>)}</nav>{section === 'dashboard' || section === 'profile' ? <Dashboard admin/> : <AuthShell title={`Admin ${section}`} description="Administrator access verified."><p>Content editing is not yet connected. This project currently has no content-management database tables.</p></AuthShell>}</>;
}
