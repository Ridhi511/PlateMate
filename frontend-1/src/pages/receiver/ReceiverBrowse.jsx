import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Compass, Clock, MapPin, Loader2, ShieldAlert } from "lucide-react";
import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import EmptyState from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/FormField";
import { useMyOrganization } from "../../hooks/useMyOrganization";
import { getAvailableFoodListings, createFoodRequest } from "../../services/api";
import { extractErrorMessage } from "../../utils/constants";

export default function ReceiverBrowse() {
  const { organization } = useMyOrganization();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState(false);
  const [requestingId, setRequestingId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "success", message: "" });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getAvailableFoodListings();
      setListings(data);
      setAccessError(false);
    } catch (err) {
      if (err?.response?.status === 403) {
        setAccessError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRequest = async (listingId) => {
    setFeedback({ type: "success", message: "" });
    if (!organization) return;
    if (organization.verificationStatus !== "VERIFIED") {
      setFeedback({ type: "error", message: "Your organization needs to be verified before you can request food." });
      return;
    }
    const qty = Number(quantities[listingId]);
    if (!qty || qty < 1) {
      setFeedback({ type: "error", message: "Enter a quantity before requesting." });
      return;
    }
    setSubmittingId(listingId);
    try {
      await createFoodRequest({
        foodListingId: listingId,
        receiverOrganizationId: organization.id,
        requestedQuantity: qty,
      });
      setFeedback({ type: "success", message: "Request sent — the provider will review it shortly." });
      setRequestingId(null);
      load();
    } catch (err) {
      setFeedback({ type: "error", message: extractErrorMessage(err, "Couldn't send that request. Please try again.") });
    } finally {
      setSubmittingId(null);
    }
  };

  if (accessError) {
    return (
      <Panel title="Nearby listings">
        <EmptyState
          icon={ShieldAlert}
          title="Access blocked by the backend"
          body='The current security config restricts GET /food-listings/** to the PROVIDER role only, so a receiver account gets a 403 here. This needs a backend fix — see the integration notes.'
        />
      </Panel>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Alert type={feedback.type} message={feedback.message} />

      <Panel title="Nearby listings" description="Everything currently available from verified providers.">
        {loading ? (
          <p className="text-[13.5px] text-muted">Loading…</p>
        ) : listings.length === 0 ? (
          <EmptyState icon={Compass} title="Nothing available right now" body="New listings will show up here as soon as providers post them." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {listings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex flex-col gap-5 rounded-[20px] border border-line bg-white p-6"
              >
                <div>
                  <p className="text-[14.5px] font-semibold text-ink">{listing.foodName}</p>
                  <p className="text-[12.5px] text-muted">{listing.organization?.name}</p>
                </div>
                {listing.description && (
                  <p className="text-[13px] leading-relaxed text-muted">{listing.description}</p>
                )}
                <div className="flex flex-col gap-2 text-[12.5px] text-muted">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} /> {listing.pickupAddress}
                  </span>
                  {listing.expiryTime && (
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} /> Expires {new Date(listing.expiryTime).toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-[14px] font-semibold text-ink">
                  {listing.quantity} {listing.unit} available
                </p>

                {requestingId === listing.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      max={listing.quantity}
                      placeholder="Qty"
                      className="!w-24"
                      value={quantities[listing.id] ?? ""}
                      onChange={(e) => setQuantities((q) => ({ ...q, [listing.id]: e.target.value }))}
                    />
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleRequest(listing.id)}
                      disabled={submittingId === listing.id}
                    >
                      {submittingId === listing.id ? (
                        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
                          <Loader2 size={14} />
                        </motion.span>
                      ) : (
                        "Confirm"
                      )}
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setRequestingId(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="primary" className="self-start mt-1" onClick={() => setRequestingId(listing.id)}>
                    Request this
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
