import Container from "../ui/Container";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import FadeIn from "../ui/FadeIn";

export default function CTABanner() {
  return (
    <section className="bg-ink py-24 md:py-28 lg:py-32">
      <Container className="flex flex-col items-center gap-8 text-center">
        <FadeIn className="flex flex-col items-center gap-4">
          <h2 className="max-w-[520px] text-[30px] font-semibold tracking-[-0.02em] text-white md:text-[38px]">
            Have surplus food, or an organization that could use it?
          </h2>
          <p className="max-w-[440px] text-[15px] leading-relaxed text-white/60">
            Registration takes a couple of minutes. Verification is what
            keeps every match trustworthy on both sides.
          </p>
        </FadeIn>
        <FadeIn delay={0.1} className="flex flex-col gap-4 sm:flex-row">
          <Button as={Link} to="/register?role=provider" variant="primary" size="lg">
            Register as a provider
          </Button>
          <Button as={Link} to="/register?role=receiver" variant="outlineOnDark" size="lg">
            Register as a receiver
          </Button>
        </FadeIn>
      </Container>
    </section>
  );
}
