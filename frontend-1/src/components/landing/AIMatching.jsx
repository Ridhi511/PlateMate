import { motion } from "framer-motion";
import { MapPin, ShieldCheck, Boxes } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import FadeIn from "../ui/FadeIn";

const candidates = [
  {
    name: "Ashirwad Community Kitchen",
    type: "Community kitchen · 1.8 km away",
    distance: 92,
    trust: 88,
    capacity: 74,
    rank: 1,
  },
  {
    name: "Sneha Shelter Home",
    type: "Shelter home · 3.2 km away",
    distance: 71,
    trust: 95,
    capacity: 60,
    rank: 2,
  },
  {
    name: "Uday Food Bank",
    type: "Food bank · 4.6 km away",
    distance: 58,
    trust: 80,
    capacity: 82,
    rank: 3,
  },
];

const signals = [
  { key: "distance", label: "Distance", icon: MapPin },
  { key: "trust", label: "Trust score", icon: ShieldCheck },
  { key: "capacity", label: "Capacity & load", icon: Boxes },
];

export default function AIMatching() {
  return (
    <section id="ai-matching" className="bg-white py-28 md:py-36 lg:py-40">
      <Container className="grid items-center gap-12 md:gap-16 lg:grid-cols-2 lg:gap-20 xl:gap-24">
        <SectionHeading
          eyebrow="AI matching"
          title="One listing, ranked against every verified organization nearby."
          subtitle="The moment a listing goes live, PlateMate scores each verified receiver on distance, trust score, and current capacity — and surfaces the strongest match first, automatically."
        />

        <FadeIn delay={0.15}>
          <div className="card-shadow-lg rounded-[28px] border border-line bg-canvas p-8 sm:p-10">
            <div className="mb-8 flex items-start justify-between gap-5">
              <div>
                <p className="text-[13px] font-medium text-muted">Ranking listing</p>
                <p className="text-[15px] font-semibold text-ink">40 meal boxes · Green Leaf Bakery</p>
              </div>
              <span className="rounded-full bg-tint px-3 py-1 text-[12px] font-semibold text-primary">
                Live
              </span>
            </div>

            <div className="mb-7 flex flex-wrap gap-x-7 gap-y-3 border-y border-line py-5">
              {signals.map((signal) => (
                <span
                  key={signal.key}
                  className="flex items-center gap-1.5 text-[12px] font-medium text-muted"
                >
                  <signal.icon size={13} />
                  {signal.label}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {candidates.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ y: -3 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className={`rounded-[20px] border bg-white p-6 transition-shadow hover:shadow-[0_8px_20px_-8px_rgba(28,25,23,0.15)] ${
                    c.rank === 1 ? "border-primary/40 ring-1 ring-primary/15" : "border-line"
                  }`}
                >
                  <div className="mb-5 flex items-start justify-between gap-5">
                    <div>
                      <p className="text-[14px] font-semibold text-ink">{c.name}</p>
                      <p className="text-[12px] text-muted">{c.type}</p>
                    </div>
                    {c.rank === 1 && (
                      <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-white">
                        Best match
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-5">
                    {["distance", "trust", "capacity"].map((key) => (
                      <div key={key} className="flex flex-col gap-1.5">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${c[key]}%` }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: 0.3 + i * 0.12 }}
                            className="h-full rounded-full bg-accent"
                          />
                        </div>
                        <span className="text-[11px] text-muted">{c[key]}%</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
