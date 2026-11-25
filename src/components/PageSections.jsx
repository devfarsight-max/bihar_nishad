import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  HeartHandshake,
  Users,
  ShieldCheck,
  Plus,
  Minus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal, SectionHeading } from "./UI";

const icons = [BookOpen, Users, HeartHandshake, ShieldCheck];
export function InfoSection({
  eyebrow = "MOVING FORWARD TOGETHER",
  title,
  description,
  items,
  muted = false,
}) {
  return (
    <section className={`section ${muted ? "programs-section" : ""}`}>
      <div className="container">
        <div className="center-heading">
          <SectionHeading eyebrow={eyebrow} title={title}>
            {description}
          </SectionHeading>
        </div>
        <div className={`info-grid info-grid-${items.length}`}>
          {items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal
                className="info-card"
                delay={i * 0.06}
                whileHover={{ y: -4 }}
                key={item.title}
              >
                <span className="program-icon">
                  <Icon size={25} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                {item.to && (
                  <Link className="text-link" to={item.to}>
                    {item.link || "Learn more"} <ArrowRight size={17} />
                  </Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export function StepsSection({ title, description, steps }) {
  return (
    <section className="section journey-section">
      <div className="container">
        <div className="center-heading">
          <SectionHeading eyebrow="A CLEAR PATH FORWARD" title={title}>
            {description}
          </SectionHeading>
        </div>
        <div className="journey-grid">
          {steps.map((step, i) => (
            <Reveal className="journey-step" delay={i * 0.08} key={step.title}>
              <span className="step-number">0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Questions({ items, title = "A few helpful answers" }) {
  const [open, setOpen] = useState(null);
  const reduced = useReducedMotion();
  return (
    <section className="section container faq-section">
      <div>
        <SectionHeading eyebrow="GOOD TO KNOW" title={title}>
          A little clarity before you take the next step. For a question
          specific to your situation, get in touch.
        </SectionHeading>
        <Link className="text-link" to="/contact">
          Start a conversation <ArrowRight size={17} />
        </Link>
      </div>
      <div className="faq-list">
        {items.map((item, i) => (
          <div
            className={`faq-item ${open === i ? "is-open" : ""}`}
            key={item.q}
          >
            <button
              type="button"
              aria-expanded={open === i}
              aria-controls={`answer-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {item.q}
              {open === i ? <Minus size={19} /> : <Plus size={19} />}
            </button>
            <motion.div
              id={`answer-${i}`}
              initial={false}
              animate={{
                height: open === i ? "auto" : 0,
                opacity: open === i ? 1 : 0,
              }}
              transition={{ duration: reduced ? 0 : 0.25 }}
              style={{ overflow: "hidden" }}
              aria-hidden={open !== i}
            >
              <p>{item.a}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
