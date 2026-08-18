import { motion } from "framer-motion";
import { ClipboardList, LineChart, Building2, ListChecks, Bell, ShieldCheck, UsersRound, BarChart3, PlusCircle, Inbox, History } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import FadeIn from "../ui/FadeIn";

const panels = [
  {
    role: "Provider",
    tint: "text-primary bg-tint",
    features: [
      { icon: PlusCircle, label: "Create listing" },
      { icon: ClipboardList, label: "My listings" },
      { icon: LineChart, label: "Analytics" },
      { icon: Building2, label: "Organization profile" },
    ],
  },
  {
    role: "Receiver",
    tint: "text-primary bg-tint",
    features: [
      { icon: ListChecks, label: "Nearby listings" },
      { icon: Inbox, label: "Request food" },
      { icon: History, label: "Request history" },
      { icon: Bell, label: "Notifications" },
    ],
  },
  {
    role: "Admin",
    tint: "text-primary bg-tint",
    features: [
      { icon: ShieldCheck, label: "Verify organizations" },
      { icon: UsersRound, label: "User management" },
      { icon: BarChart3, label: "Platform analytics" },
    ],
  },
];

export default function DashboardPreview() {
  return (
    <section className="bg-canvas py-28 md:py-36 lg:py-40">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Built for every role"
          title="One platform, three dashboards, no crossed wires."
          subtitle="Providers, receivers, and admins each get a workspace scoped to exactly what they need to do — nothing borrowed from a generic admin template."
          className="mx-auto"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 md:mt-16 lg:mt-20 lg:grid-cols-3 lg:gap-8">
          {panels.map((panel, i) => (
            <FadeIn key={panel.role} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="card-shadow flex h-full flex-col rounded-[22px] border border-line bg-white p-3"
              >
                <div className="flex items-center justify-between rounded-xl bg-ink px-5 py-4">
                  <span className="text-[14px] font-semibold text-white">{panel.role} dashboard</span>
                  <span className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-white/25" />
                    <span className="h-2 w-2 rounded-full bg-white/25" />
                    <span className="h-2 w-2 rounded-full bg-accent" />
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-3">
                  {panel.features.map((feature) => (
                    <div
                      key={feature.label}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-canvas transition-colors"
                    >
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full ${panel.tint}`}>
                        <feature.icon size={16} strokeWidth={2} />
                      </span>
                      <span className="text-[13.5px] font-medium text-ink">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
