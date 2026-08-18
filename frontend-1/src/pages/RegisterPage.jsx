import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Store, HeartHandshake, Check } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import { FormField, Input, Select } from "../components/ui/FormField";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { useAuth } from "../context/AuthContext";
import { createOrganization } from "../services/api";
import { roleHome, providerOrgTypes, receiverOrgTypes, extractErrorMessage } from "../utils/constants";

const roleCards = [
  {
    role: "PROVIDER",
    icon: Store,
    title: "I have surplus food",
    body: "Restaurants, bakeries, hotels, supermarkets, individual donors.",
  },
  {
    role: "RECEIVER",
    icon: HeartHandshake,
    title: "I need food for my organization",
    body: "NGOs, shelters, orphanages.",
  },
];

export default function RegisterPage() {
  const [params] = useSearchParams();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [account, setAccount] = useState({
    role: params.get("role")?.toUpperCase() === "RECEIVER" ? "RECEIVER" : "PROVIDER",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [org, setOrg] = useState({
    name: "",
    type: "",
    address: "",
    city: "",
    state: "",
    contactNumber: "",
  });

  const orgTypeOptions = account.role === "RECEIVER" ? receiverOrgTypes : providerOrgTypes;

  const handleAccountChange = (e) => setAccount((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleOrgChange = (e) => setOrg((f) => ({ ...f, [e.target.name]: e.target.value }));

  const goToStepTwo = (e) => {
    e.preventDefault();
    setError("");
    if (account.password !== account.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (account.password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await register({
        name: account.name,
        email: account.email,
        password: account.password,
        role: account.role,
      });

      await createOrganization({
        name: org.name,
        type: org.type,
        address: org.address,
        city: org.city,
        state: org.state,
        contactNumber: org.contactNumber,
        ownerId: user.id,
      });

      navigate(roleHome[account.role] ?? "/");
    } catch (err) {
      setError(extractErrorMessage(err, "Something went wrong creating your account."));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={step === 1 ? "Create your account" : "Tell us about your organization"}
      subtitle={
        step === 1
          ? "Registration takes about two minutes."
          : "This is what receivers will see when you list surplus food."
      }
      width="max-w-[620px]"
    >
      <div className="mb-9 flex items-center gap-3">
        {[1, 2].map((n) => (
          <div key={n} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
                step >= n ? "bg-primary text-white" : "bg-tint text-primary"
              }`}
            >
              {step > n ? <Check size={12} /> : n}
            </span>
            {n === 1 && <span className="h-px flex-1 bg-line" />}
          </div>
        ))}
      </div>

      <Alert type="error" message={error} />

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            onSubmit={goToStepTwo}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {roleCards.map((card) => (
                <button
                  type="button"
                  key={card.role}
                  onClick={() => setAccount((f) => ({ ...f, role: card.role }))}
                  className={`flex min-h-[168px] flex-col items-start gap-4 rounded-[20px] border p-6 sm:p-7 text-left transition-all duration-200 ${
                    account.role === card.role
                      ? "border-primary bg-tint"
                      : "border-line bg-white hover:border-primary/40"
                  }`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                    <card.icon size={18} />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[15px] font-semibold leading-5 text-ink">{card.title}</span>
                    <span className="text-[13px] leading-5 text-muted">{card.body}</span>
                  </div>
                </button>
              ))}
            </div>

            <FormField label="Your name">
              <Input name="name" required value={account.name} onChange={handleAccountChange} placeholder="Ananya Sharma" />
            </FormField>

            <FormField label="Email">
              <Input
                type="email"
                name="email"
                required
                value={account.email}
                onChange={handleAccountChange}
                placeholder="you@organization.com"
              />
            </FormField>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField label="Password">
                <Input
                  type="password"
                  name="password"
                  required
                  value={account.password}
                  onChange={handleAccountChange}
                  placeholder="••••••••"
                />
              </FormField>
              <FormField label="Confirm">
                <Input
                  type="password"
                  name="confirmPassword"
                  required
                  value={account.confirmPassword}
                  onChange={handleAccountChange}
                  placeholder="••••••••"
                />
              </FormField>
            </div>

            <Button type="submit" variant="primary" size="lg" className="mt-2 w-full">
              Continue
            </Button>
          </motion.form>
        ) : (
          <motion.form
            key="step2"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            <FormField label="Organization name">
              <Input
                name="name"
                required
                value={org.name}
                onChange={handleOrgChange}
                placeholder={account.role === "RECEIVER" ? "Ashirwad Community Kitchen" : "Green Leaf Bakery"}
              />
            </FormField>

            <FormField label="Organization type">
              <Select name="type" required value={org.type} onChange={handleOrgChange}>
                <option value="" disabled>
                  Select a type
                </option>
                {orgTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Address">
              <Input name="address" required value={org.address} onChange={handleOrgChange} placeholder="Street address" />
            </FormField>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField label="City">
                <Input name="city" required value={org.city} onChange={handleOrgChange} placeholder="Mumbai" />
              </FormField>
              <FormField label="State">
                <Input name="state" required value={org.state} onChange={handleOrgChange} placeholder="Maharashtra" />
              </FormField>
            </div>

            <FormField label="Contact number">
              <Input
                name="contactNumber"
                required
                value={org.contactNumber}
                onChange={handleOrgChange}
                placeholder="9876543210"
              />
            </FormField>

            <div className="mt-3 flex gap-4">
              <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit" variant="primary" size="lg" className="flex-1" disabled={submitting}>
                {submitting ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
                    <Loader2 size={16} />
                  </motion.span>
                ) : (
                  "Create account"
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {step === 1 && (
        <p className="mt-8 text-center text-[14px] text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      )}
    </AuthLayout>
  );
}
