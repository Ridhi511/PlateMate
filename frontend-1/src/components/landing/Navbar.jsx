import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Container from "../ui/Container";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

const links = [
  { label: "How it works", href: "#how-it-works" },
  { label: "AI matching", href: "#ai-matching" },
  { label: "Impact", href: "#impact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 bg-canvas/80 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "border-b border-line" : "border-b border-transparent"
      }`}
    >
      <Container className="flex h-[72px] items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-white">
            P
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.01em] text-ink">
            PlateMate
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
              whileHover={{ y: -1 }}
              className="text-[14px] font-medium text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:inline text-[14px] font-medium text-muted transition-colors hover:text-ink"
          >
            Log in
          </Link>
          <Button as={Link} to="/register" variant="primary" size="md">
            Get started
          </Button>
        </div>
      </Container>
    </motion.header>
  );
}
