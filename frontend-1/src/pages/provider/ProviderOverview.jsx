import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UtensilsCrossed, PackageCheck, ClipboardList, ShieldCheck, ArrowUpRight } from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import Panel from "../../components/ui/Panel";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { useMyOrganization } from "../../hooks/useMyOrganization";
import { getAllFoodListings } from "../../services/api";

export default function ProviderOverview() {
  const { user } = useAuth();
  const { organization, loading: orgLoading } = useMyOrganization();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organization) return;
    (async () => {
      try {
        const { data } = await getAllFoodListings();
        setListings(data.filter((l) => l.organization?.id === organization.id));
      } finally {
        setLoading(false);
      }
    })();
  }, [organization]);

  const available = listings.filter((l) => l.status === "AVAILABLE").length;
  const pickedUp = listings.filter((l) => l.status === "PICKED_UP").length;

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
            title="Set up your organization profile"
            body="You're registered, but we couldn't find an organization tied to your account yet."
            action={
              <Button as={Link} to="/provider/profile" variant="primary" size="sm">
                Go to profile
              </Button>
            }
          />
        </Panel>
      )}

      {organization && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={UtensilsCrossed} label="Total listings" value={listings.length} delay={0} />
            <StatCard icon={PackageCheck} label="Currently available" value={available} delay={0.05} />
            <StatCard icon={ClipboardList} label="Picked up" value={pickedUp} delay={0.1} />
            <StatCard
              icon={ShieldCheck}
              label="Trust score"
              value={Math.round(organization.trustScore ?? 0)}
              suffix="%"
              delay={0.15}
            />
          </div>

          <Panel
            title="Organization status"
            action={<Badge status={organization.verificationStatus} />}
          >
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
            {organization.verificationStatus === "PENDING" && (
              <p className="mt-4 text-[13px] text-muted">
                An admin needs to verify your organization before receivers can request from your listings.
              </p>
            )}
          </Panel>

          <Panel
            title="Recent listings"
            action={
              <Button as={Link} to="/provider/listings" variant="secondary" size="sm">
                View all <ArrowUpRight size={14} />
              </Button>
            }
          >
            {loading ? (
              <p className="text-[13.5px] text-muted">Loading…</p>
            ) : listings.length === 0 ? (
              <EmptyState
                icon={UtensilsCrossed}
                title="No listings yet"
                body="Create your first surplus food listing to start getting matched."
                action={
                  <Button as={Link} to="/provider/listings" variant="primary" size="sm">
                    Create a listing
                  </Button>
                }
              />
            ) : (
              <div className="flex flex-col divide-y divide-line">
                {listings.slice(0, 5).map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-[14px] font-medium text-ink">{listing.foodName}</p>
                      <p className="text-[12px] text-muted">
                        {listing.quantity} {listing.unit}
                      </p>
                    </div>
                    <Badge status={listing.status} />
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
