import { Building2, MapPin, Phone, ShieldCheck, Gauge, Info } from "lucide-react";
import Panel from "../../components/ui/Panel";
import Badge from "../../components/ui/Badge";
import { useMyOrganization } from "../../hooks/useMyOrganization";

export default function ProviderProfile() {
  const { organization, loading } = useMyOrganization();

  if (loading) return <p className="text-[13.5px] text-muted">Loading…</p>;

  if (!organization) {
    return (
      <Panel title="Organization profile">
        <p className="text-[13.5px] text-muted">
          No organization is linked to your account yet. This usually gets created automatically during
          registration — if you're seeing this, something may have failed. Try registering again or reach out.
        </p>
      </Panel>
    );
  }

  const fields = [
    { icon: Building2, label: "Type", value: organization.type?.replace(/_/g, " ") },
    { icon: MapPin, label: "Address", value: `${organization.address}, ${organization.city}, ${organization.state}` },
    { icon: Phone, label: "Contact number", value: organization.contactNumber },
    { icon: Gauge, label: "Current load", value: organization.currentLoad ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Panel
        title={organization.name}
        description="Your organization's profile as receivers and admins see it."
        action={<Badge status={organization.verificationStatus} />}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-tint text-primary">
                <field.icon size={15} />
              </span>
              <div>
                <p className="text-[12px] text-muted">{field.label}</p>
                <p className="text-[14px] font-medium text-ink">{field.value}</p>
              </div>
            </div>
          ))}
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-tint text-primary">
              <ShieldCheck size={15} />
            </span>
            <div>
              <p className="text-[12px] text-muted">Trust score</p>
              <p className="text-[14px] font-medium text-ink">{organization.trustScore}%</p>
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="flex items-start gap-3 text-[13px] text-muted">
          <Info size={16} className="mt-0.5 shrink-0" />
          <p>
            This profile is read-only for now — the backend doesn't yet expose an endpoint to update an
            organization after it's created. Once a <code className="rounded bg-canvas px-1 py-0.5">PUT /organizations/{"{id}"}</code>{" "}
            endpoint exists, this page is ready to wire an edit form to it.
          </p>
        </div>
      </Panel>
    </div>
  );
}
