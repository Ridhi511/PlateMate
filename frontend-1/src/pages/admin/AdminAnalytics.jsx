import { useEffect, useState } from "react";
import Panel from "../../components/ui/Panel";
import StatCard from "../../components/ui/StatCard";
import MiniBarList from "../../components/ui/MiniBarList";
import { Building2, UtensilsCrossed, ClipboardList, PackageCheck } from "lucide-react";
import { getDashboardStats, getAllOrganizations, getAllFoodListings } from "../../services/api";

const verificationStatuses = ["PENDING", "VERIFIED", "REJECTED"];
const listingStatuses = ["AVAILABLE", "RESERVED", "PICKED_UP", "EXPIRED", "CANCELLED"];

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [orgs, setOrgs] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, orgsRes, listingsRes] = await Promise.all([
          getDashboardStats(),
          getAllOrganizations(),
          getAllFoodListings(),
        ]);
        setStats(statsRes.data);
        setOrgs(orgsRes.data);
        setListings(listingsRes.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-[13.5px] text-muted">Loading…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Building2} label="Organizations" value={stats?.totalOrganizations ?? 0} />
        <StatCard icon={UtensilsCrossed} label="Available listings" value={stats?.availableFoodListings ?? 0} delay={0.05} />
        <StatCard icon={ClipboardList} label="Pending requests" value={stats?.pendingRequests ?? 0} delay={0.1} />
        <StatCard icon={PackageCheck} label="Completed requests" value={stats?.completedRequests ?? 0} delay={0.15} />
      </div>

      <Panel title="Organizations by verification status">
        <MiniBarList
          rows={verificationStatuses.map((status) => ({
            label: status,
            value: orgs.filter((o) => o.verificationStatus === status).length,
          }))}
        />
      </Panel>

      <Panel title="Food listings by status">
        <MiniBarList
          rows={listingStatuses.map((status) => ({
            label: status.replace(/_/g, " "),
            value: listings.filter((l) => l.status === status).length,
          }))}
        />
      </Panel>
    </div>
  );
}
