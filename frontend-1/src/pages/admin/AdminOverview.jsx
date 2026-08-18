import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, UtensilsCrossed, ClipboardList, ShieldAlert, ArrowUpRight } from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { getDashboardStats, getPendingOrganizations } from "../../services/api";

export default function AdminOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, pendingRes] = await Promise.all([getDashboardStats(), getPendingOrganizations()]);
        setStats(statsRes.data);
        setPending(pendingRes.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[24px] font-semibold tracking-[-0.01em] text-ink">
          Welcome back, {user?.name?.split(" ")[0] ?? "there"} 👋
        </h2>
        <p className="mt-1 text-[14.5px] text-muted">Here's the state of the whole platform.</p>
      </div>

      {loading ? (
        <p className="text-[13.5px] text-muted">Loading…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard icon={Building2} label="Organizations" value={stats?.totalOrganizations ?? 0} />
            <StatCard icon={UtensilsCrossed} label="Food listings" value={stats?.totalFoodListings ?? 0} delay={0.05} />
            <StatCard icon={ClipboardList} label="Total requests" value={stats?.totalRequests ?? 0} delay={0.1} />
          </div>

          <Panel
            title="Pending verifications"
            description="Organizations waiting on you before they can go live."
            action={
              <Button as={Link} to="/admin/organizations" variant="secondary" size="sm">
                Review all <ArrowUpRight size={14} />
              </Button>
            }
          >
            {pending.length === 0 ? (
              <EmptyState icon={ShieldAlert} title="Nothing pending" body="Every registered organization has been reviewed." />
            ) : (
              <div className="flex flex-col divide-y divide-line">
                {pending.slice(0, 5).map((org) => (
                  <div key={org.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-[14px] font-medium text-ink">{org.name}</p>
                      <p className="text-[12px] text-muted">{org.type?.replace(/_/g, " ")} · {org.city}</p>
                    </div>
                    <span className="text-[12px] font-medium text-amber-600">Pending</span>
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
