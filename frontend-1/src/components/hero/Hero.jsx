import { motion } from "framer-motion";
import Navbar from "../landing/Navbar";
import HeroVisual from "./HeroVisual";
import Container from "../ui/Container";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function Hero() {
  return (
    // overflow-x-hidden only (not overflow-hidden) — the ambient blobs need
    // horizontal clipping so they never cause page-wide horizontal scroll,
    // but clipping the Y axis here was cutting off hero content on shorter
    // viewports. Vertical overflow stays visible.
    <section id="top" className="relative w-full overflow-x-hidden bg-canvas pt-[72px]">
      {/* Subtle dot-grid texture — replaces the video, keeps the page from feeling flat */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(var(--color-line) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />

      {/* Slow-drifting ambient blobs — depth and motion without a photo/video */}
      <motion.div
        aria-hidden
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-accent/15 blur-[90px]"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -24, 0], y: [0, 24, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="pointer-events-none absolute top-1/3 -right-24 h-[360px] w-[360px] rounded-full bg-primary/10 blur-[90px]"
      />

      <Navbar />

      <Container className="relative grid gap-14 pt-16 pb-20 sm:pt-20 sm:pb-24 md:gap-16 md:pt-24 md:pb-28 lg:grid-cols-2 lg:items-center lg:gap-x-16 lg:pt-28 lg:pb-32 xl:pt-32 xl:pb-36">
        <div className="flex flex-col items-start text-left">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-[13px] font-medium text-ink"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Surplus food, matched in minutes
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[540px] text-[40px] leading-[1.18] font-bold tracking-[-0.03em] text-ink md:text-[52px] md:leading-[1.15]"
          >
            Every extra plate can still reach a table.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-[460px] text-[17px] leading-relaxed text-muted"
          >
            PlateMate connects restaurants, bakeries, and kitchens with
            verified NGOs nearby — automatically ranked by distance, trust
            score, and capacity, so food moves before it's wasted.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button as={Link} to="/register?role=provider" variant="primary" size="lg">
              List surplus food
            </Button>
            <Button as={Link} to="/register?role=receiver" variant="secondary" size="lg">
              Register as a receiver
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-8 text-[13px] text-muted"
          >
            Restaurants, bakeries, hotels & supermarkets — matched with NGOs,
            shelters, and community kitchens.
          </motion.p>
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}
