import { motion } from "framer-motion";
import CountUp from "./CountUp";

export default function StatCard({ icon: Icon, label, value, delay = 0, suffix = "" }) {
  const isNumeric = typeof value === "number";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3 }}
      className="card-shadow flex min-h-[150px] flex-col justify-between gap-6 rounded-[20px] border border-line bg-white p-6 sm:p-7"
    >
      <div className="flex items-start justify-between gap-5">
        <span className="max-w-[70%] text-[13px] font-medium leading-5 text-muted">{label}</span>
        {Icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tint text-primary">
            <Icon size={17} strokeWidth={2} />
          </span>
        )}
      </div>
      <span className="text-[32px] font-semibold leading-none tracking-[-0.03em] text-ink">
        {isNumeric ? <CountUp value={value} suffix={suffix} /> : value}
      </span>
    </motion.div>
  );
}
