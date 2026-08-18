import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import { FormField, Input } from "../components/ui/FormField";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { useAuth } from "../context/AuthContext";
import { roleHome, extractErrorMessage } from "../utils/constants";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      navigate(roleHome[user?.role] ?? "/");
    } catch (err) {
      // The backend returns a 500 with no reliable message body for
      // bad credentials, so we fall back to a generic explanation.
      setError(extractErrorMessage(err, "Invalid email or password."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to manage your listings or requests.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Alert type="error" message={error} />

        <FormField label="Email">
          <Input
            type="email"
            name="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@organization.com"
          />
        </FormField>

        <FormField label="Password">
          <Input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </FormField>

        <Button type="submit" variant="primary" size="lg" className="mt-2 w-full" disabled={submitting}>
          {submitting ? (
            <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
              <Loader2 size={16} />
            </motion.span>
          ) : (
            "Log in"
          )}
        </Button>
      </form>

      <p className="mt-9 text-center text-[14px] text-muted">
        New to PlateMate?{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
