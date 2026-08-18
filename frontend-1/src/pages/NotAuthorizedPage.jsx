import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { roleHome } from "../utils/constants";

export default function NotAuthorizedPage() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-canvas px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <ShieldAlert size={24} />
      </span>
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-ink">Not authorized</h1>
        <p className="mt-2 max-w-[360px] text-[14.5px] text-muted">
          Your account doesn't have access to that page.
        </p>
      </div>
      <Button as={Link} to={user ? roleHome[user.role] ?? "/" : "/"} variant="primary" size="md">
        Back to your dashboard
      </Button>
    </div>
  );
}
