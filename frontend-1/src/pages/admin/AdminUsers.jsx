import { useEffect, useState } from "react";
import { UsersRound, Info } from "lucide-react";
import Panel from "../../components/ui/Panel";
import EmptyState from "../../components/ui/EmptyState";
import { getAllUsers } from "../../services/api";

const roleStyles = {
  PROVIDER: "bg-tint text-primary-dark",
  RECEIVER: "bg-blue-50 text-blue-700",
  ADMIN: "bg-stone-900 text-white",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAllUsers();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <Panel>
        <div className="flex items-start gap-3 text-[13px] text-muted">
          <Info size={16} className="mt-0.5 shrink-0" />
          <p>
            This is read-only — the backend doesn't expose endpoints to change a user's role or deactivate an
            account yet, only to list and create users.
          </p>
        </div>
      </Panel>

      <Panel title="All users" description={`${users.length} registered`}>
        {loading ? (
          <p className="text-[13.5px] text-muted">Loading…</p>
        ) : users.length === 0 ? (
          <EmptyState icon={UsersRound} title="No users yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-line text-[12px] text-muted">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 font-medium text-ink">{u.name}</td>
                    <td className="py-3 text-muted">{u.email}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${roleStyles[u.role] ?? "bg-stone-100 text-stone-600"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-muted">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
