import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, UtensilsCrossed, Sparkles, ChevronDown, Loader2 } from "lucide-react";
import Panel from "../../components/ui/Panel";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import EmptyState from "../../components/ui/EmptyState";
import { FormField, Input, Textarea, Select } from "../../components/ui/FormField";
import { useMyOrganization } from "../../hooks/useMyOrganization";
import {
  createFoodListing,
  getAllFoodListings,
  getMatchesForListing,
} from "../../services/api";
import { extractErrorMessage } from "../../utils/constants";

const emptyForm = {
  foodName: "",
  description: "",
  quantity: "",
  unit: "servings",
  expiryTime: "",
  pickupAddress: "",
};

export default function ProviderListings() {
  const { organization } = useMyOrganization();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [matches, setMatches] = useState({});
  const [matchLoading, setMatchLoading] = useState(null);

  const loadListings = async () => {
    if (!organization) return;
    setLoading(true);
    try {
      const { data } = await getAllFoodListings();
      setListings(data.filter((l) => l.organization?.id === organization.id));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!organization) {
      setError("You need an organization on file before you can list food. Set it up in Organization profile.");
      return;
    }
    setSubmitting(true);
    try {
      await createFoodListing({
        foodName: form.foodName,
        description: form.description,
        quantity: Number(form.quantity),
        unit: form.unit,
        expiryTime: form.expiryTime ? new Date(form.expiryTime).toISOString() : null,
        pickupAddress: form.pickupAddress,
        organizationId: organization.id,
      });
      setSuccess(`"${form.foodName}" is live and ready to be matched.`);
      setForm(emptyForm);
      loadListings();
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't create that listing. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMatches = async (listingId) => {
    if (expandedId === listingId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(listingId);
    if (!matches[listingId]) {
      setMatchLoading(listingId);
      try {
        const { data } = await getMatchesForListing(listingId);
        setMatches((m) => ({ ...m, [listingId]: data }));
      } catch {
        setMatches((m) => ({ ...m, [listingId]: [] }));
      } finally {
        setMatchLoading(null);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Panel title="Create a listing" description="List surplus food and PlateMate ranks the best receivers for it.">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Alert type="error" message={error} />
          <Alert type="success" message={success} />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Food name">
              <Input name="foodName" required value={form.foodName} onChange={handleChange} placeholder="40 vegetable biryani boxes" />
            </FormField>
            <FormField label="Pickup address">
              <Input name="pickupAddress" required value={form.pickupAddress} onChange={handleChange} placeholder="Street, area, landmark" />
            </FormField>
          </div>

          <FormField label="Description">
            <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Freshly cooked, packed in sealed containers…" />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Quantity">
              <Input type="number" name="quantity" min="1" required value={form.quantity} onChange={handleChange} placeholder="40" />
            </FormField>
            <FormField label="Unit">
              <Select name="unit" value={form.unit} onChange={handleChange}>
                <option value="servings">Servings</option>
                <option value="boxes">Boxes</option>
                <option value="kg">Kilograms</option>
                <option value="plates">Plates</option>
                <option value="packets">Packets</option>
              </Select>
            </FormField>
            <FormField label="Expires at">
              <Input type="datetime-local" name="expiryTime" required value={form.expiryTime} onChange={handleChange} />
            </FormField>
          </div>

          <Button type="submit" variant="primary" size="md" className="self-start" disabled={submitting}>
            {submitting ? (
              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
                <Loader2 size={16} />
              </motion.span>
            ) : (
              <>
                <Plus size={16} /> Create listing
              </>
            )}
          </Button>
        </form>
      </Panel>

      <Panel title="My listings" description="Tap a listing to see how it's currently being ranked.">
        {loading ? (
          <p className="text-[13.5px] text-muted">Loading…</p>
        ) : listings.length === 0 ? (
          <EmptyState icon={UtensilsCrossed} title="No listings yet" body="Whatever you create above will show up here." />
        ) : (
          <div className="flex flex-col gap-3">
            {listings.map((listing) => (
              <div key={listing.id} className="rounded-2xl border border-line">
                <button
                  onClick={() => toggleMatches(listing.id)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5">
                      <p className="text-[14px] font-semibold text-ink">{listing.foodName}</p>
                      <Badge status={listing.status} />
                    </div>
                    <p className="mt-0.5 text-[12.5px] text-muted">
                      {listing.quantity} {listing.unit} · {listing.pickupAddress}
                    </p>
                  </div>
                  <motion.span
                    animate={{ rotate: expandedId === listing.id ? 180 : 0 }}
                    className="text-muted"
                  >
                    <ChevronDown size={16} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {expandedId === listing.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-line bg-canvas px-4"
                    >
                      <div className="py-3.5">
                        <p className="mb-2.5 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.04em] text-primary">
                          <Sparkles size={12} /> Ranked receivers
                        </p>
                        {matchLoading === listing.id ? (
                          <p className="text-[13px] text-muted">Ranking…</p>
                        ) : matches[listing.id]?.length ? (
                          <div className="flex flex-col gap-2">
                            {matches[listing.id].map((m, i) => (
                              <div key={m.id} className="flex items-center justify-between rounded-xl bg-white px-4 py-3.5">
                                <span className="text-[13px] font-medium text-ink">
                                  {i === 0 && "🏆 "}
                                  {m.name}
                                </span>
                                <span className="text-[12px] font-semibold text-primary">
                                  {Math.round(m.score)}% match
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[13px] text-muted">No verified receivers ranked for this listing yet.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
