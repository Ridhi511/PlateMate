import { motion } from "framer-motion";
import { Package, Sparkles, Send, HandPlatter } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import FadeIn from "../ui/FadeIn";

const steps = [
  {
    icon: Package,
    title: "Provider lists surplus",
    body: "A restaurant, bakery, hotel, or individual donor posts what's left over — quantity, unit, and pickup window.",
  },
  {
    icon: Sparkles,
    title: "PlateMate ranks the matches",
    body: "The backend scores every verified nearby organization on distance, trust score, and current capacity — no manual searching.",
  },
  {
    icon: Send,
    title: "Receiver requests it",
    body: "The top-ranked NGO, shelter, or kitchen sees the listing first and submits a request in a tap.",
  },
  {
    icon: HandPlatter,
    title: "Provider approves pickup",
    body: "Once approved, a pickup is scheduled and the food is on its way — before it expires, not after.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-canvas py-28 md:py-36 lg:py-40">
      <Container>
        <SectionHeading
          eyebrow="Core flow"
          title="From surplus to pickup, in four steps."
          subtitle="The order matters — each step is what actually happens between a listing going up and food leaving the kitchen."
        />

        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-7">
          {steps.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="card-shadow flex min-h-[310px] h-full flex-col justify-between gap-8 rounded-[22px] border border-line bg-white p-7 sm:p-8 hover:border-primary/30"
              >
                <div className="flex flex-col gap-8">
                  <div className="flex items-center justify-between">
                    <motion.span
                      whileHover={{ rotate: 8, scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-tint text-primary"
                    >
                      <step.icon size={20} strokeWidth={2} />
                    </motion.span>
                    <span className="text-[13px] font-semibold text-muted">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-[18px] font-semibold leading-6 text-ink">{step.title}</h3>
                    <p className="text-[14px] leading-6 text-muted">{step.body}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-line pt-5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                    Step 0{i + 1}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
