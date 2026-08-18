import { motion } from "framer-motion";

export default function AuthLayout({ title, subtitle, children, width = "max-w-[420px]" }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-canvas px-6 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(var(--color-line) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(circle at 50% 30%, black, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 30%, black, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`relative w-full ${width}`}
      >
        <a href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[14px] font-bold text-white">
            P
          </span>
          <span className="text-[18px] font-semibold tracking-[-0.01em] text-ink">PlateMate</span>
        </a>

        <div className="card-shadow-lg rounded-[28px] border border-line bg-white p-7 sm:p-10">
          <div className="mb-9 text-center">
            <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-ink">{title}</h1>
            {subtitle && <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">{subtitle}</p>}
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
