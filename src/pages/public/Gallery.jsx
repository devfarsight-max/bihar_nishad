import { motion } from 'framer-motion';
import { InfoSection, Questions } from '../../components/PageSections';
import { pageContent } from '../../data/pageContent';
﻿import { useEffect, useRef, useState } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { galleryItems } from '../../data/content';
import { CommunityImage, PageHeader, Reveal } from '../../components/UI';

export default function Gallery() {
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const categories = ['All', ...new Set(galleryItems.map(item => item.category))];
  useEffect(() => { if (selected) dialog.current?.showModal(); }, [selected]);
  function closeImage() { dialog.current?.close(); setSelected(null); }
  return <>
    <PageHeader eyebrow="OUR GALLERY" title={<>A collection of moments.<br/><em>A world of connection.</em></>} description="Community gatherings, announcements, and stories from the press."/>
    <section className="section container">
      <div className="filters" aria-label="Filter gallery">{categories.map(item => <motion.button whileTap={{ scale: 0.96 }} key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</motion.button>)}</div>
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">{galleryItems.filter(item => category === 'All' || item.category === category).map(item => <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={item.src}><button className={`gallery-card ${item.category === 'Community' ? '' : 'gallery-document'}`} onClick={() => setSelected(item)} aria-label={`View ${item.title}`}><CommunityImage image={item}/><span className="card-category">{item.category}</span><h3>{item.title}<ArrowUpRight size={18}/></h3></button></motion.div>)}</div>
      <p className="content-note mt-8">Select an image to see the full photo, clipping, or announcement.</p>
    </section>
    <dialog ref={dialog} className="gallery-dialog" aria-labelledby="gallery-image-title" onCancel={closeImage} onClose={() => setSelected(null)} onClick={e => { if (e.target === e.currentTarget) closeImage(); }}>
      <button className="dialog-close" autoFocus onClick={closeImage} aria-label="Close image"><X/></button>
      {selected && <motion.div key={selected.src} initial={{ opacity: 0 }} animate={{ opacity: 1 }}><CommunityImage image={selected} eager/><h3 id="gallery-image-title">{selected.title}</h3><p>{selected.category} · <a href={selected.src} target="_blank" rel="noreferrer" className="text-link">Open original image <ArrowUpRight size={14}/></a></p></motion.div>}
    </dialog>
  <InfoSection {...pageContent.gallery.info}/><Questions items={pageContent.gallery.questions}/></>;
}
