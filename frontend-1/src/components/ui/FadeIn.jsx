import { motion } from "framer-motion";

/**
 * Wraps children in a scroll-triggered fade + rise reveal.
 * `delay` and `y` let sibling elements stagger without each
 * needing their own motion boilerplate.
 */
export default function FadeIn({
  children,
  delay = 0,
  y = 16,
  duration = 0.6,
  className = "",
  as = "div",
}) {
  const Tag = motion[as] ?? motion.div;

  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Tag>
  );
}
