import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, XCircle, PackageCheck, Clock, Info } from "lucide-react";
import Panel from "../../components/ui/Panel";
import EmptyState from "../../components/ui/EmptyState";
import { useMyOrganization } from "../../hooks/useMyOrganization";
import { getAllFoodRequests } from "../../services/api";

const statusMeta = {
  PENDING: { icon: Clock, color: "text-amber-600 bg-amber-50", text: (r) => `Your request for "${r.foodListing?.foodName}" is waiting on the provider.` },
  APPROVED: { icon: CheckCircle2, color: "text-primary bg-tint", text: (r) => `Your request for "${r.foodListing?.foodName}" was approved — pickup time to coordinate.` },
  REJECTED: { icon: XCircle, color: "text-red-600 bg-red-50", text: (r) => `Your request for "${r.foodListing?.foodName}" was declined.` },
  COMPLETED: { icon: PackageCheck, color: "text-stone-600 bg-stone-100", text: (r) => `Pickup completed for "${r.foodListing?.foodName}".` },
};

export default function ReceiverNotifications() {
  const { organization } = useMyOrganization();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organization) return;
    (async () => {
      try {
        const { data } = await getAllFoodRequests();
        const mine = data
          .filter((r) => r.receiverOrganization?.id === organization.id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRequests(mine);
      } finally {
        setLoading(false);
      }
    })();
  }, [organization]);

  return (
    <div className="flex flex-col gap-6">
      <Panel>
        <div className="flex items-start gap-3 text-[13px] text-muted">
          <Info size={16} className="mt-0.5 shrink-0" />
          <p>
            The backend doesn't have a dedicated notifications table yet, so this feed is generated from your
            request history — one entry per status a request has reached. Once a real notifications endpoint
            exists, this page is ready to switch over to it.
          </p>
        </div>
      </Panel>

      <Panel title="Notifications">
        {loading ? (
          <p className="text-[13.5px] text-muted">Loading…</p>
        ) : requests.length === 0 ? (
          <EmptyState icon={Bell} title="Nothing yet" body="Activity on your requests will show up here." />
        ) : (
          <div className="flex flex-col gap-3">
            {requests.map((r, i) => {
              const meta = statusMeta[r.status] ?? statusMeta.PENDING;
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-xl border border-line p-3.5"
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.color}`}>
                    <meta.icon size={15} />
                  </span>
                  <div>
                    <p className="text-[13.5px] text-ink">{meta.text(r)}</p>
                    <p className="mt-0.5 text-[11.5px] text-muted">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}
