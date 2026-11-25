import { Outlet, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
export default function PageLayout() {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  return <><a className="skip-link" href="#main">Skip to content</a><Navbar/><main id="main"><motion.div key={pathname} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}><Outlet/></motion.div></main><Footer/></>;
}
