import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Compass,
  ClipboardList,
  Bell,
  BarChart3,
  Building2,
  ShieldCheck,
  UsersRound,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const menusByRole = {
  PROVIDER: [
    { to: "/provider", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/provider/listings", label: "Listings", icon: UtensilsCrossed },
    { to: "/provider/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/provider/profile", label: "Organization profile", icon: Building2 },
  ],
  RECEIVER: [
    { to: "/receiver", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/receiver/browse", label: "Nearby listings", icon: Compass },
    { to: "/receiver/requests", label: "Request history", icon: ClipboardList },
    { to: "/receiver/notifications", label: "Notifications", icon: Bell },
  ],
  ADMIN: [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/admin/organizations", label: "Verify organizations", icon: ShieldCheck },
    { to: "/admin/users", label: "User management", icon: UsersRound },
    { to: "/admin/analytics", label: "Platform analytics", icon: BarChart3 },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const items = menusByRole[user?.role] ?? [];

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-line bg-white">
      <div className="px-6 py-7">
        <a href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-white">
            P
          </span>
          <span className="text-[16px] font-semibold tracking-[-0.01em] text-ink">PlateMate</span>
        </a>
      </div>

      <nav className="flex-1 px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `relative mb-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted hover:bg-canvas hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-tint"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  <item.icon size={17} strokeWidth={2} />
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tint text-[12.5px] font-semibold text-primary">
            {(user?.name ?? user?.email ?? "?").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-ink">
              {user?.name ?? user?.email}
            </p>
            <p className="text-[11px] capitalize text-muted">{user?.role?.toLowerCase()}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium text-muted transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={17} strokeWidth={2} />
          Log out
        </button>
      </div>
    </aside>
  );
}
