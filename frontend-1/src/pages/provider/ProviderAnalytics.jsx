import { useEffect, useState } from "react";
import {
  UtensilsCrossed,
  ClipboardCheck,
  TrendingUp,
  Check,
  X,
  Loader2,
} from "lucide-react";

import Panel from "../../components/ui/Panel";
import StatCard from "../../components/ui/StatCard";
import MiniBarList from "../../components/ui/MiniBarList";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

import { useMyOrganization } from "../../hooks/useMyOrganization";

import {
  getAllFoodListings,
  getAllFoodRequests,
  approveFoodRequest,
  rejectFoodRequest,
} from "../../services/api";

const listingStatuses = [
  "AVAILABLE",
  "RESERVED",
  "PICKED_UP",
  "EXPIRED",
  "CANCELLED",
];

const requestStatuses = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
];

export default function ProviderAnalytics() {
  const { organization } = useMyOrganization();

  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    if (!organization) return;

    setLoading(true);
    setError("");

    try {
      const [listingsRes, requestsRes] = await Promise.all([
        getAllFoodListings(),
        getAllFoodRequests(),
      ]);

      const allListings = listingsRes.data || [];
      const allRequests = requestsRes.data || [];

      // Only this provider's listings
      const myListings = allListings.filter(
        (listing) =>
          listing.organization?.id === organization.id
      );

      setListings(myListings);

      // Get IDs of this provider's listings
      const myListingIds = new Set(
        myListings.map((listing) => listing.id)
      );

      // Only requests made against this provider's listings
      const myRequests = allRequests.filter(
        (request) =>
          myListingIds.has(request.foodListing?.id)
      );

      setRequests(myRequests);
    } catch (err) {
      console.error("Failed to load provider analytics:", err);
      setError("Unable to load your requests right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  const handleApprove = async (requestId) => {
    setActionLoading(requestId);
    setError("");
    setSuccess("");

    try {
      await approveFoodRequest(requestId);

      setSuccess("Food request approved successfully.");

      // Reload listings + requests so the UI immediately updates
      await loadData();
    } catch (err) {
      console.error("Approve request failed:", err);
      setError(
        err?.response?.data?.message ||
          "Unable to approve this request."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    setActionLoading(requestId);
    setError("");
    setSuccess("");

    try {
      await rejectFoodRequest(requestId);

      setSuccess("Food request rejected.");

      await loadData();
    } catch (err) {
      console.error("Reject request failed:", err);
      setError(
        err?.response?.data?.message ||
          "Unable to reject this request."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const completed = requests.filter(
    (request) => request.status === "COMPLETED"
  ).length;

  const completionRate = requests.length
    ? Math.round((completed / requests.length) * 100)
    : 0;

  if (loading) {
    return (
      <p className="text-[13.5px] text-muted">
        Loading…
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ERROR / SUCCESS */}
      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={UtensilsCrossed}
          label="Listings created"
          value={listings.length}
        />

        <StatCard
          icon={ClipboardCheck}
          label="Requests received"
          value={requests.length}
          delay={0.05}
        />

        <StatCard
          icon={TrendingUp}
          label="Completion rate"
          value={completionRate}
          suffix="%"
          delay={0.1}
        />
      </div>

      {/* LISTINGS BY STATUS */}
      <Panel title="Listings by status">
        <MiniBarList
          rows={listingStatuses.map((status) => ({
            label: status.replace(/_/g, " "),
            value: listings.filter(
              (listing) => listing.status === status
            ).length,
          }))}
        />
      </Panel>

      {/* REQUESTS BY STATUS */}
      <Panel
        title="Requests received by status"
        description="Across all your listings."
      >
        <MiniBarList
          rows={requestStatuses.map((status) => ({
            label: status,
            value: requests.filter(
              (request) => request.status === status
            ).length,
          }))}
        />
      </Panel>

      {/* ACTUAL REQUESTS */}
      <Panel
        title="Requests from receivers"
        description="Review requests made for your food listings."
      >
        {requests.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white px-6 py-8 text-center">
            <ClipboardCheck
              size={28}
              className="mx-auto mb-3 text-muted"
            />

            <p className="text-[14px] font-semibold text-ink">
              No requests yet
            </p>

            <p className="mt-1 text-[13px] text-muted">
              Requests from receivers will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">

            {requests.map((request) => {

              const receiver =
                request.receiverOrganization;

              const listing =
                request.foodListing;

              const isPending =
                request.status === "PENDING";

              const isLoading =
                actionLoading === request.id;

              return (
                <div
                  key={request.id}
                  className="rounded-2xl border border-line bg-white p-5"
                >

                  {/* TOP ROW */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="text-[15px] font-semibold text-ink">
                          {listing?.foodName || "Food listing"}
                        </h3>

                        <Badge
                          status={request.status}
                        />

                      </div>

                      <p className="mt-1.5 text-[13px] text-muted">
                        Requested by{" "}
                        <span className="font-medium text-ink">
                          {receiver?.name || "Receiver organization"}
                        </span>
                      </p>

                    </div>

                    <div className="text-left sm:text-right">

                      <p className="text-[13px] text-muted">
                        Requested quantity
                      </p>

                      <p className="mt-0.5 text-[16px] font-semibold text-ink">
                        {request.requestedQuantity}{" "}
                        {listing?.unit || ""}
                      </p>

                    </div>

                  </div>

                  {/* REQUEST DETAILS */}
                  <div className="mt-4 grid gap-3 rounded-xl bg-canvas p-4 sm:grid-cols-3">

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                        Food
                      </p>

                      <p className="mt-1 text-[13px] font-medium text-ink">
                        {listing?.foodName || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                        Available
                      </p>

                      <p className="mt-1 text-[13px] font-medium text-ink">
                        {listing?.quantity ?? "—"}{" "}
                        {listing?.unit || ""}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                        Receiver type
                      </p>

                      <p className="mt-1 text-[13px] font-medium text-ink">
                        {receiver?.type
                          ?.replace(/_/g, " ")
                          || "—"}
                      </p>
                    </div>

                  </div>

                  {/* ACTIONS */}
                  {isPending && (
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">

                      <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        disabled={isLoading}
                        onClick={() =>
                          handleReject(request.id)
                        }
                        className="min-w-[120px]"
                      >
                        {isLoading ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <>
                            <X size={16} />
                            Reject
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        disabled={isLoading}
                        onClick={() =>
                          handleApprove(request.id)
                        }
                        className="min-w-[120px]"
                      >
                        {isLoading ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <>
                            <Check size={16} />
                            Approve
                          </>
                        )}
                      </Button>

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}
      </Panel>

    </div>
  );
}