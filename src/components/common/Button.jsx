import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
const MotionLink = motion.create(Link);
export default function Button({
  to,
  children,
  secondary = false,
  className = "",
  ...props
}) {
  const reduced = useReducedMotion();
  const animation = {
    whileHover: reduced || props.disabled ? undefined : { y: -2 },
    whileTap: reduced || props.disabled ? undefined : { scale: 0.97 },
    transition: { duration: 0.18 },
  };
  const classes = `button ${secondary ? "button-secondary" : "button-primary"} ${className}`;
  return to ? (
    <MotionLink className={classes} to={to} {...animation} {...props}>
      {children}
      <ArrowUpRight size={17} />
    </MotionLink>
  ) : (
    <motion.button className={classes} {...animation} {...props}>
      {children}
      <ArrowUpRight size={17} />
    </motion.button>
  );
}
