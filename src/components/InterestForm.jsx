import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "./UI";
export default function InterestForm({ volunteer = false }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <motion.form
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="interest-form"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <span className="eyebrow">
        {volunteer
          ? "YOUR NEXT CHAPTER STARTS HERE"
          : "LET’S START A CONVERSATION"}
      </span>
      <h2>
        {volunteer ? "Tell us about yourself." : "We’d love to hear from you."}
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          Full name
          <motion.input
            whileFocus={{
              borderColor: "#1553df",
              boxShadow: "0 0 0 3px #1553df14",
            }}
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            required
            maxLength={100}
          />
        </label>
        <label>
          Email address
          <motion.input
            whileFocus={{
              borderColor: "#1553df",
              boxShadow: "0 0 0 3px #1553df14",
            }}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          Phone <span className="optional">(optional)</span>
          <motion.input
            whileFocus={{
              borderColor: "#1553df",
              boxShadow: "0 0 0 3px #1553df14",
            }}
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="Your phone number"
          />
        </label>
        <label>
          {volunteer ? "Area of interest" : "I’m interested in"}
          <select name="interest" defaultValue="" required>
            <option value="" disabled>
              Select an option
            </option>
            {(volunteer
              ? [
                  "Education",
                  "Healthcare",
                  "Community outreach",
                  "Skills & training",
                  "Other",
                ]
              : [
                  "General enquiry",
                  "Volunteering",
                  "Partnerships",
                  "Supporting a program",
                  "Other",
                ]
            ).map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        {volunteer ? "How would you like to contribute?" : "Your message"}
        <motion.textarea
          whileFocus={{
            borderColor: "#1553df",
            boxShadow: "0 0 0 3px #1553df14",
          }}
          name="message"
          placeholder={
            volunteer
              ? "Tell us a little about your skills and availability…"
              : "Tell us what’s on your mind…"
          }
          rows={5}
          required
          maxLength={3000}
        />
      </label>
      <label className="checkbox-label">
        <motion.input
          whileFocus={{
            borderColor: "#1553df",
            boxShadow: "0 0 0 3px #1553df14",
          }}
          type="checkbox"
          required
        />
        I consent to being contacted about this enquiry.
      </label>
      <Button type="submit">
        Preview {volunteer ? "registration" : "enquiry"}
      </Button>
      <p className="content-note">
        Frontend demo: this form validates your details locally. Nothing is sent
        or stored.
      </p>
      {submitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="form-feedback"
          role="status"
        >
          <CheckCircle2 size={22} />
          <span>
            Your details passed validation. Submission will be available when
            the backend is connected.
          </span>
        </motion.div>
      )}
    </motion.form>
  );
}
