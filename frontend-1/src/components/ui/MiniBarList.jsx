import { motion } from "framer-motion";

/**
 * rows: [{ label, value, color? }]. Bars scale relative to the
 * largest value in the set. No charting library needed for this.
 */
export default function MiniBarList({ rows, emptyLabel = "No data yet" }) {
  const max = Math.max(1, ...rows.map((r) => r.value));

  if (rows.every((r) => r.value === 0)) {
    return <p className="text-[13.5px] text-muted">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {rows.map((row, i) => (
        <div key={row.label} className="flex items-center gap-4">
          <span className="w-36 shrink-0 text-[13px] text-muted">{row.label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-tint">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(row.value / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full"
              style={{ background: row.color ?? "var(--color-primary)" }}
            />
          </div>
          <span className="w-8 shrink-0 text-right text-[13px] font-semibold text-ink">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
