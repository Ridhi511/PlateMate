import ScrollProgressBar from "../components/ui/ScrollProgressBar";
import Hero from "../components/hero/Hero";
import Stats from "../components/landing/Stats";
import HowItWorks from "../components/landing/HowItWorks";
import AIMatching from "../components/landing/AIMatching";
import Impact from "../components/landing/Impact";
import DashboardPreview from "../components/landing/DashboardPreview";
import CTABanner from "../components/landing/CTABanner";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <ScrollProgressBar />
      <Hero />
      <Stats />
      <HowItWorks />
      <AIMatching />
      <Impact />
      <DashboardPreview />
      <CTABanner />
      <Footer />
    </>
  );
}
