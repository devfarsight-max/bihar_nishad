import AdminPage from '../pages/admin/AdminPage';
import NotFound from '../pages/public/NotFound';
import Activities from '../pages/public/Activities';
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import { Route, Routes } from 'react-router-dom';
import Layout from '../layouts/PublicLayout';
import AuthPage, { AuthCallback } from '../pages/auth/Auth';
import Dashboard from '../pages/admin/Dashboard';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Programs, { ProgramDetail } from '../pages/public/Programs';
import Gallery from '../pages/public/Gallery';
import Events from '../pages/public/Events';
import Contact from '../pages/public/Contact';
import Volunteer from '../pages/public/Volunteer';
import Donate from '../pages/public/Donate';
export default function AppRoutes() { return <Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="admin/login" element={<AuthPage key="admin-login" mode="login" admin/>}/><Route element={<ProtectedRoute admin/>}>{["dashboard", "profile", "projects", "gallery", "settings"].map(section => <Route key={section} path={`admin/${section}`} element={<AdminPage section={section}/>}/>)}</Route><Route path="login" element={<Login/>}/><Route path="register" element={<AuthPage key="register" mode="register"/>}/><Route path="forgot-password" element={<ForgotPassword/>}/><Route path="reset-password" element={<ResetPassword/>}/><Route path="verify-email" element={<AuthPage key="verify" mode="verify"/>}/><Route path="auth/callback" element={<AuthCallback/>}/><Route element={<ProtectedRoute/>}><Route path="dashboard" element={<Dashboard/>}/></Route><Route path="about" element={<About/>}/><Route path="programs" element={<Programs/>}/><Route path="programs/:slug" element={<ProgramDetail/>}/><Route path="gallery" element={<Gallery/>}/><Route path="activities" element={<Activities/>}/><Route path="events" element={<Events/>}/><Route path="contact" element={<Contact/>}/><Route path="volunteer" element={<Volunteer/>}/><Route path="donate" element={<Donate/>}/><Route path="*" element={<NotFound/>}/></Route></Routes>; }

