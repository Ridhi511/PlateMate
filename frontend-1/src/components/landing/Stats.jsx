import FadeIn from "../ui/FadeIn";
import Container from "../ui/Container";
import CountUp from "../ui/CountUp";

const stats = [
  { value: 3, label: "signals ranked per match", detail: "Distance, trust score, capacity" },
  { value: 13, label: "organization types supported", detail: "From restaurants to shelters" },
  { display: "24/7", label: "listings open to matching", detail: "No cutoff windows" },
  { value: 0, label: "manual sorting required", detail: "Ranking runs automatically" },
];

export default function Stats() {
  return (
    <section className="border-y border-line bg-white">
      <Container className="grid grid-cols-2 gap-x-8 gap-y-10 py-20 md:grid-cols-4 md:py-24">
        {stats.map((stat, i) => (
          <FadeIn key={stat.label} delay={i * 0.08} className="flex flex-col gap-2.5">
            <span className="text-[36px] font-semibold tracking-[-0.02em] text-ink md:text-[44px]">
              {stat.display ?? <CountUp value={stat.value} />}
            </span>
            <span className="text-[14px] font-medium text-ink">{stat.label}</span>
            <span className="text-[13px] text-muted">{stat.detail}</span>
          </FadeIn>
        ))}
      </Container>
    </section>
  );
}
