import { useLocation } from "react-router-dom";
import Badge from "../ui/Badge";
import { useAuth } from "../../context/AuthContext";
import { useMyOrganization } from "../../hooks/useMyOrganization";

const titleFromPath = (pathname) => {
  const segment = pathname.split("/").filter(Boolean).pop();
  if (!segment || ["provider", "receiver", "admin"].includes(segment)) return "Overview";
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function Topbar() {
  const location = useLocation();
  const { user } = useAuth();
  const showOrgStatus = user?.role === "PROVIDER" || user?.role === "RECEIVER";
  const { organization } = useMyOrganization();

  return (
    <div className="flex h-[72px] items-center justify-between border-b border-line bg-canvas/80 px-8 backdrop-blur-md">
      <h1 className="text-[18px] font-semibold tracking-[-0.01em] text-ink">
        {titleFromPath(location.pathname)}
      </h1>

      <div className="flex items-center gap-3">
        {showOrgStatus && organization && (
          <Badge status={organization.verificationStatus} />
        )}
        {showOrgStatus && !organization && (
          <span className="text-[12.5px] text-muted">No organization yet</span>
        )}
      </div>
    </div>
  );
}
