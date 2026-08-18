import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Compass, ClipboardList, PackageCheck, ShieldCheck, ArrowUpRight } from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import Panel from "../../components/ui/Panel";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { useMyOrganization } from "../../hooks/useMyOrganization";
import { getAllFoodRequests } from "../../services/api";

export default function ReceiverOverview() {
  const { user } = useAuth();
  const { organization, loading: orgLoading } = useMyOrganization();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organization) return;
    (async () => {
      try {
        const { data } = await getAllFoodRequests();
        setRequests(data.filter((r) => r.receiverOrganization?.id === organization.id));
      } finally {
        setLoading(false);
      }
    })();
  }, [organization]);

  const pending = requests.filter((r) => r.status === "PENDING").length;
  const completed = requests.filter((r) => r.status === "COMPLETED").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[24px] font-semibold tracking-[-0.01em] text-ink">
          Welcome back, {user?.name?.split(" ")[0] ?? "there"} 👋
        </h2>
        <p className="mt-1 text-[14.5px] text-muted">
          Here's what's happening with {organization?.name ?? "your organization"} today.
        </p>
      </div>

      {!orgLoading && !organization && (
        <Panel>
          <EmptyState
            icon={ShieldCheck}
            title="No organization on file"
            body="We couldn't find an organization tied to your account. Try registering again."
          />
        </Panel>
      )}

      {organization && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={ClipboardList} label="Total requests" value={requests.length} delay={0} />
            <StatCard icon={Compass} label="Pending" value={pending} delay={0.05} />
            <StatCard icon={PackageCheck} label="Completed" value={completed} delay={0.1} />
            <StatCard
              icon={ShieldCheck}
              label="Trust score"
              value={Math.round(organization.trustScore ?? 0)}
              suffix="%"
              delay={0.15}
            />
          </div>

          <Panel title="Organization status" action={<Badge status={organization.verificationStatus} />}>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[12px] text-muted">Type</p>
                <p className="text-[14px] font-medium text-ink">{organization.type?.replace(/_/g, " ")}</p>
              </div>
              <div>
                <p className="text-[12px] text-muted">Location</p>
                <p className="text-[14px] font-medium text-ink">{organization.city}, {organization.state}</p>
              </div>
              <div>
                <p className="text-[12px] text-muted">Contact</p>
                <p className="text-[14px] font-medium text-ink">{organization.contactNumber}</p>
              </div>
            </div>
            {organization.verificationStatus !== "VERIFIED" && (
              <p className="mt-4 text-[13px] text-muted">
                Your organization needs to be verified by an admin before you can request food.
              </p>
            )}
          </Panel>

          <Panel
            title="Recent requests"
            action={
              <Button as={Link} to="/receiver/requests" variant="secondary" size="sm">
                View all <ArrowUpRight size={14} />
              </Button>
            }
          >
            {loading ? (
              <p className="text-[13.5px] text-muted">Loading…</p>
            ) : requests.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No requests yet"
                body="Browse nearby listings and request the ones you can use."
                action={
                  <Button as={Link} to="/receiver/browse" variant="primary" size="sm">
                    Browse listings
                  </Button>
                }
              />
            ) : (
              <div className="flex flex-col divide-y divide-line">
                {requests.slice(0, 5).map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-[14px] font-medium text-ink">{r.foodListing?.foodName ?? "Listing removed"}</p>
                      <p className="text-[12px] text-muted">{r.requestedQuantity} requested</p>
                    </div>
                    <Badge status={r.status} />
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </>
      )}
    </div>
  );
}
