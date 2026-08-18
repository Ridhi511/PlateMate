import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-6 text-center">
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-tint text-primary"
      >
        <UtensilsCrossed size={26} />
      </motion.span>
      <div>
        <h1 className="text-[64px] font-semibold leading-none tracking-[-0.03em] text-ink">404</h1>
        <p className="mt-3 text-[16px] text-muted">
          This plate's empty — the page you're looking for doesn't exist.
        </p>
      </div>
      <Button as={Link} to="/" variant="primary" size="md">
        Back to home
      </Button>
    </div>
  );
}
