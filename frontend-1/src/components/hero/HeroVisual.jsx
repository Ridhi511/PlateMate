import { motion } from "framer-motion";
import { MapPin, Clock, CheckCircle2 } from "lucide-react";

// Pinned to a corner clearly *outside* the card's box using fixed
// pixel offsets (not percentages of the card's height), so they can
// never land on top of the card's own content no matter how tall the
// card renders.
const floatingBadges = [
  { label: "Sneha Shelter", sub: "3.2 km", pos: { top: "-30px", right: "-26px" }, delay: 0.6 },
  { label: "Uday Food Bank", sub: "4.6 km", pos: { bottom: "-30px", left: "-30px" }, delay: 1.2 },
];

const secondaryRows = [
  { name: "Sneha Shelter Home", distance: "3.2 km", trust: "95%" },
  { name: "Uday Food Bank", distance: "4.6 km", trust: "80%" },
];

export default function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[600px] px-8 py-10 sm:px-12 sm:py-12">
      {/* Ambient tint behind the card — texture without a stock photo */}
      <div className="absolute -inset-10 -z-10 rounded-[40px] bg-tint blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="card-shadow-lg relative rounded-[28px] border border-line bg-white p-8 sm:p-9"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-5 pb-6">
          <div>
            <p className="text-[12.5px] font-medium text-muted">New listing</p>
            <p className="mt-1.5 text-[16px] font-semibold text-ink">40 meal boxes</p>
            <p className="mt-0.5 text-[13px] text-muted">Green Leaf Bakery</p>
          </div>
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex shrink-0 items-center gap-2 rounded-full bg-tint px-4 py-2 text-[11.5px] font-semibold text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Ranking now
          </motion.span>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-7 border-y border-line py-5">
          <span className="flex items-center gap-1.5 text-[12.5px] text-muted">
            <Clock size={14} /> Expires in 2h
          </span>
          <span className="flex items-center gap-1.5 text-[12.5px] text-muted">
            <MapPin size={14} /> Koramangala
          </span>
        </div>

        {/* Top match */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-5 flex items-start justify-between gap-5 rounded-2xl border border-primary/30 bg-tint/60 px-5 py-5"
        >
          <div className="flex min-w-0 items-start gap-3">
            <CheckCircle2 size={18} className="text-primary shrink-0" />
            <div>
              <p className="text-[14px] font-semibold leading-5 text-ink">Ashirwad Community Kitchen</p>
              <p className="mt-1.5 text-[12.5px] text-muted">Top match · 1.8 km · Trust 88%</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-white">
            Best match
          </span>
        </motion.div>

        {/* Remaining ranked receivers */}
        {secondaryRows.map((row, i) => (
          <motion.div
            key={row.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.1 + i * 0.15 }}
            className="flex items-center justify-between gap-5 border-t border-line py-5"
          >
            <p className="text-[14px] font-medium leading-5 text-ink">{row.name}</p>
            <p className="shrink-0 text-[12.5px] text-muted">
              {row.distance} · {row.trust} trust
            </p>
          </motion.div>
        ))}
      </motion.div>

      {floatingBadges.map((badge) => (
        <motion.div
          key={badge.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.5, delay: badge.delay },
            scale: { duration: 0.5, delay: badge.delay },
            y: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: badge.delay },
          }}
          className="card-shadow absolute hidden whitespace-nowrap rounded-xl border border-line bg-white px-4 py-3 lg:block"
          style={badge.pos}
        >
          <p className="text-[11.5px] font-semibold text-ink">{badge.label}</p>
          <p className="mt-0.5 text-[10.5px] text-muted">{badge.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}
