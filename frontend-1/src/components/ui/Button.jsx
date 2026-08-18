import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-dark active:bg-primary-dark shadow-[0_1px_2px_rgba(28,25,23,0.08)]",
  secondary:
    "bg-white text-ink border border-line hover:border-primary hover:text-primary active:bg-canvas",
  outlineOnDark:
    "bg-white/10 text-white border border-white/30 backdrop-blur-sm hover:bg-white/20 active:bg-white/25",
  ghost: "text-ink hover:text-primary active:text-primary-dark",
};

// Real clickable-area sizes, not just font-size bumps: fixed height +
// generous horizontal padding so buttons feel substantial, not cramped.
const sizes = {
  sm: "min-h-[46px] px-6 py-3 text-[14px]",
  md: "min-h-[52px] px-8 py-3 text-[15px]",
  lg: "min-h-[56px] px-10 py-3.5 text-[16px]",
};

// Wrapping a custom component (e.g. react-router's Link) in motion()
// creates a new component type — caching it here means the wrapped
// component keeps a stable identity across renders instead of
// remounting (and losing hover/focus state) every time.
const motionComponentCache = new WeakMap();
function getMotionTag(as) {
  if (typeof as === "string") return motion[as] ?? motion.button;
  if (!motionComponentCache.has(as)) {
    motionComponentCache.set(as, motion(as));
  }
  return motionComponentCache.get(as);
}

export default function Button({
  as = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const Tag = getMotionTag(as);

  return (
    <Tag
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
