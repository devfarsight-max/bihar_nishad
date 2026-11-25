import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ImagePlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Reveal({ children, className = '', delay = 0, ...props }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.45, delay: reduced ? 0 : delay }} {...props}>{children}</motion.div>;
}
export { default as Button } from './common/Button';
import Button from './common/Button';
export function SectionHeading({ eyebrow, title, children, light = false }) {
  return <Reveal className={`section-heading ${light ? 'light' : ''}`}><span className="eyebrow"><span/>{eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</Reveal>;
}
export function PageHeader({ eyebrow, title, description }) {
  return <section className="page-header"><div className="container"><Reveal><span className="eyebrow"><span/>{eyebrow}</span><h1>{title}</h1><p>{description}</p></Reveal></div><span className="header-flower" aria-hidden="true">✳</span></section>;
}
export function ImagePlaceholder({ label = 'Your community photo', tone = 'sage', className = '' }) {
  return <div className={`image-placeholder ${tone} ${className}`} role="img" aria-label={`${label} — image placeholder`}><div className="placeholder-orbit"/><div className="placeholder-content"><ImagePlus size={28} strokeWidth={1}/><span>{label}</span><small>YOUR IMAGE GOES HERE</small></div><span className="placeholder-spark" aria-hidden="true">✳</span></div>;
}
export function CommunityImage({ image, className = '', eager = false }) {
  return <div className={`image-placeholder community-image ${className}`}><motion.img whileHover={{ scale: 1.035 }} transition={{ duration: 0.45 }} src={image.src} alt={image.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : 'auto'}/></div>;
}
export function ProgramCard({ program, index = 0 }) {
  const Icon = program.icon;
  return <Reveal delay={index % 3 * 0.07} whileHover={{ y: -5 }} transition={{ duration: 0.25 }}><Link className={`program-card ${program.color}`} to={`/programs/${program.slug}`}><div className="flex items-center justify-between"><span className="program-icon"><Icon size={25} strokeWidth={1.5}/></span><span className="card-number">0{index + 1}</span></div><p className="card-category">{program.category}</p><h3>{program.title}</h3><p>{program.description}</p><span className="text-link">Explore program <ArrowUpRight size={17}/></span></Link></Reveal>;
}
export function JoinBanner() {
  return <section className="join-section"><div className="container join-wrap"><Reveal className="join-banner"><div><span className="mission-badge">EMPOWERMENT STARTS HERE</span><h2>Ready to create a<br/><em>lasting impact?</em></h2><p>Every contribution of time, ideas, or support helps us move towards a stronger community. Join us as a partner in change.</p><div className="join-actions"><Button to="/donate">Support our mission</Button><Button to="/volunteer" secondary>Become a volunteer</Button></div></div></Reveal></div></section>;
}
