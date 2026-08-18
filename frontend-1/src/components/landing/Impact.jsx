import { motion } from "framer-motion";
import { Utensils, Clock, Users } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import FadeIn from "../ui/FadeIn";

const points = [
  {
    icon: Clock,
    title: "Surplus has a short window",
    body: "Edible food that isn't claimed within hours is thrown out — not because no one needs it, but because no one was matched to it in time.",
  },
  {
    icon: Users,
    title: "Verified organizations, not open listings",
    body: "Every receiver on PlateMate is a verified NGO, shelter, food bank, or community kitchen — so providers know exactly where their food is going.",
  },
  {
    icon: Utensils,
    title: "Redistribution, not donation guesswork",
    body: "Ranking by trust score and capacity means food goes to organizations that can actually collect and use it that day.",
  },
];

export default function Impact() {
  return (
    <section id="impact" className="bg-tint py-28 md:py-36 lg:py-40">
      <Container>
        <SectionHeading
          eyebrow="Why PlateMate exists"
          title="Surplus and shortage sit closer together than they should."
          subtitle="Kitchens over-prepare, events run long, harvests peak — while nearby shelters and community kitchens are actively short on food the same evening. PlateMate exists to close that gap before the food is gone."
        />

        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-3 lg:mt-20 lg:gap-8">
          {points.map((point, i) => (
            <FadeIn key={point.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, backgroundColor: "rgba(255,255,255,0.95)" }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="flex h-full flex-col gap-5 rounded-[22px] border border-primary/10 bg-white/70 p-8 backdrop-blur-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary">
                  <point.icon size={19} strokeWidth={2} />
                </span>
                <h3 className="text-[17px] font-semibold leading-6 text-ink">{point.title}</h3>
                <p className="text-[14px] leading-6 text-muted">{point.body}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
