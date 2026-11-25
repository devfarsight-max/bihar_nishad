import { homeImages } from '../../data/images';
import { Eye, Target, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, CommunityImage, JoinBanner, ProgramCard, Reveal, SectionHeading } from '../../components/UI';
import { programs } from '../../data/content';

const purpose = [
  { icon: Eye, title: 'Our vision', text: 'An equitable society where every person has access to education, wellbeing, and opportunities to grow.' },
  { icon: Target, title: 'Our mission', text: 'Bring people together to open pathways to learning, dignity, and a stronger future for our communities.' },
  { icon: Users, title: 'Our approach', text: 'Community voices guide our work. We believe in participation, shared responsibility, and lasting connections.' },
];
export default function Home() {
  return <>
    <section className="mission-hero">
      <CommunityImage image={homeImages.hero} className="mission-backdrop" eager/>
      <div className="mission-shade"/>
      <div className="container mission-content"><Reveal>
        <span className="mission-badge"><ShieldCheck size={15}/> TOGETHER FOR OUR COMMUNITY</span>
        <h1>Change begins when<br/><em>we rise together.</em></h1>
        <p>Building stronger communities through education, wellbeing, and equal opportunity. A shared purpose. A future shaped by all of us.</p>
        <div className="hero-buttons"><Button to="/donate">Support our mission</Button><Button to="/about" secondary>Learn more</Button></div>
        <div className="mission-principles"><div><strong>Education</strong><span>OPPORTUNITY FOR ALL</span></div><div><strong>Community</strong><span>PEOPLE AT THE HEART</span></div><div><strong>Dignity</strong><span>EVERY VOICE MATTERS</span></div><div><strong>Together</strong><span>A SHARED FUTURE</span></div></div>
      </Reveal></div>
    </section>
    <div className="mission-strip"><div className="container"><span>BIHAR NISHAD SANGH</span><span>EDUCATION & OPPORTUNITY</span><span>COMMUNITY PARTICIPATION</span><span>DIGNITY & EQUALITY</span></div></div>
    <section className="section container"><div className="center-heading"><SectionHeading eyebrow="OUR SHARED PURPOSE" title="Driven by purpose">Rooted in compassion and the belief that every person deserves the opportunity to thrive.</SectionHeading></div><div className="grid gap-7 md:grid-cols-3 purpose-cards">{purpose.map(({icon:Icon,title,text})=><Reveal className="value-card" key={title}><span className="program-icon"><Icon size={26}/></span><h3>{title}</h3><p>{text}</p></Reveal>)}</div></section>
    <section className="section container"><div className="center-heading"><SectionHeading eyebrow="PATHWAYS TO CHANGE" title="People. Participation. Progress.">Our focus areas connect learning, wellbeing, and community development.</SectionHeading></div><div className="pillar-grid">{programs.map(p=><Link className="pillar-card" to={`/programs/${p.slug}`} key={p.slug}><span className="program-icon"><p.icon size={25}/></span><h3>{p.category}</h3><p>{p.description}</p><ArrowRight size={19}/></Link>)}</div></section>
    <section className="section programs-section"><div className="container"><div className="center-heading"><SectionHeading eyebrow="PURPOSE IN ACTION" title="Our focus areas">Explore six connected pathways towards stronger, healthier, and more inclusive communities.</SectionHeading></div><div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">{programs.map((p,i)=><ProgramCard program={p} index={i} key={p.slug}/>)}</div><Link className="text-link all-programs" to="/programs">Explore all programs <ArrowRight size={19}/></Link></div></section>
    <section className="section container"><div className="section-top"><SectionHeading eyebrow="OUR COMMUNITY" title={<>Connection in <em>action.</em></>}>Glimpses of the people and stories behind our shared purpose.</SectionHeading><Button to="/gallery" secondary>See full gallery</Button></div><div className="impact-grid"><CommunityImage image={homeImages.purpose}/>{homeImages.stories.map(image=><div className="impact-press" key={image.src}><CommunityImage image={image}/><p>{image.title}</p></div>)}</div></section>
    <section className="section belief-section"><div className="container"><div className="center-heading"><SectionHeading eyebrow="WHAT BRINGS US TOGETHER" title="A belief in each other"/></div><Reveal className="belief-card"><span className="mission-badge">OUR GUIDING BELIEF</span><blockquote>When we lift each other,<br/><em>we all rise.</em></blockquote><p>Meaningful change begins with people who care. Through participation, mutual support, and a commitment to inclusion, we can build a future with more opportunity for everyone.</p><Link to="/volunteer" className="text-link">Be part of our community <ArrowRight size={18}/></Link></Reveal></div></section>
    <JoinBanner/>
  </>;
}
