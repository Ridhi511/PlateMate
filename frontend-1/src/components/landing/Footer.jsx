import { Link } from "react-router-dom";
import Container from "../ui/Container";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "AI matching", href: "#ai-matching" },
      { label: "Impact", href: "#impact" },
    ],
  },
  {
    title: "For providers",
    links: [
      { label: "Restaurants", href: "/register?role=provider" },
      { label: "Bakeries & supermarkets", href: "/register?role=provider" },
      { label: "Hotels & individual donors", href: "/register?role=provider" },
    ],
  },
  {
    title: "For receivers",
    links: [
      { label: "NGOs & food banks", href: "/register?role=receiver" },
      { label: "Shelters & orphanages", href: "/register?role=receiver" },
      { label: "Community kitchens", href: "/register?role=receiver" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink pt-16 pb-8">
      <Container>
        <div className="grid gap-14 pb-14 md:grid-cols-[1.3fr_1fr_1fr_1fr] lg:pb-16">
          <div className="flex flex-col gap-4">
            <a href="#top" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-white">
                P
              </span>
              <span className="text-[16px] font-semibold text-white">PlateMate</span>
            </a>
            <p className="max-w-[260px] text-[13.5px] leading-relaxed text-white/50">
              Matching surplus food with verified organizations before it
              goes to waste.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <span className="text-[13px] font-semibold uppercase tracking-[0.06em] text-white/40">
                {column.title}
              </span>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13.5px] text-white/65 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-[12.5px] text-white/40">
            © {new Date().getFullYear()} PlateMate. Built to move surplus food, not sell it.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-[12.5px] text-white/50 hover:text-white/80">
              Log in
            </Link>
            <Link to="/register" className="text-[12.5px] text-white/50 hover:text-white/80">
              Get started
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
