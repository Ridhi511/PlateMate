import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Check, X, Loader2 } from "lucide-react";
import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import EmptyState from "../../components/ui/EmptyState";
import { getPendingOrganizations, verifyOrganization, rejectOrganization } from "../../services/api";
import { extractErrorMessage } from "../../utils/constants";

export default function AdminOrganizations() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getPendingOrganizations();
      setPending(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (id, action) => {
    setError("");
    setActingId(id);
    try {
      if (action === "verify") await verifyOrganization(id);
      else await rejectOrganization(id);
      setPending((list) => list.filter((org) => org.id !== id));
    } catch (err) {
      setError(extractErrorMessage(err, "That action failed. Please try again."));
    } finally {
      setActingId(null);
    }
  };

  return (
    <Panel title="Verify organizations" description="Approve or reject organizations waiting to join the platform.">
      <Alert type="error" message={error} />

      {loading ? (
        <p className="text-[13.5px] text-muted">Loading…</p>
      ) : pending.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="All caught up" body="No organizations are waiting for review." />
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {pending.map((org) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-center justify-between gap-6 rounded-[20px] border border-line bg-white p-6"
              >
                <div>
                  <p className="text-[14.5px] font-semibold text-ink">{org.name}</p>
                  <p className="mt-0.5 text-[12.5px] text-muted">
                    {org.type?.replace(/_/g, " ")} · {org.address}, {org.city}, {org.state}
                  </p>
                  <p className="text-[12.5px] text-muted">
                    Contact: {org.contactNumber} · Owner: {org.owner?.name ?? "—"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="!border-red-200 !text-red-600 hover:!bg-red-50"
                    onClick={() => act(org.id, "reject")}
                    disabled={actingId === org.id}
                  >
                    <X size={14} /> Reject
                  </Button>
                  <Button size="sm" variant="primary" onClick={() => act(org.id, "verify")} disabled={actingId === org.id}>
                    {actingId === org.id ? (
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
                        <Loader2 size={14} />
                      </motion.span>
                    ) : (
                      <>
                        <Check size={14} /> Verify
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </Panel>
  );
}
