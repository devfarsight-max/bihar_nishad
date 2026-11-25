import { Reveal } from "../UI";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export function Feedback({ children, error = false }) {
  return children ? (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`auth-feedback ${error ? "auth-error" : ""}`}
      role={error ? "alert" : "status"}
    >
      {children}
    </motion.p>
  ) : null;
}

export function AuthShell({ title, description, children }) {
  const { configured, error } = useAuth();
  return (
    <section className="container section auth-section">
      <Reveal className="auth-card">
        <span className="eyebrow">YOUR COMMUNITY ACCOUNT</span>
        <h1>{title}</h1>
        <p className="auth-description">{description}</p>
        {!configured && (
          <Feedback error>
            Authentication is not configured yet. Please contact the website
            team.
          </Feedback>
        )}
        <Feedback error>{error}</Feedback>
        {children}
      </Reveal>
    </section>
  );
}

export function Field({ label, name, type = "text", ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="auth-field">
      <label htmlFor={name}>{label}</label>
      <motion.input
        whileFocus={{
          borderColor: "#1553df",
          boxShadow: "0 0 0 3px #1553df14",
        }}
        id={name}
        name={name}
        type={type === "password" && visible ? "text" : type}
        required
        {...props}
      />
      {type === "password" && (
        <button
          type="button"
          aria-controls={name}
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? "Hide" : "Show"} {label.toLowerCase()}
        </button>
      )}
    </div>
  );
}
