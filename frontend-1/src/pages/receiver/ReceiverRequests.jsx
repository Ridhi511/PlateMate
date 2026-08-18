import { useEffect, useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock3,
  RefreshCw,
} from "lucide-react";

import Panel from "../../components/ui/Panel";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";

import { useMyOrganization } from "../../hooks/useMyOrganization";
import { getAllFoodRequests } from "../../services/api";

export default function ReceiverRequests() {
  const { organization } = useMyOrganization();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadRequests = async (isRefresh = false) => {
    if (!organization) return;

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const { data } = await getAllFoodRequests();

      console.log("All food requests:", data);
      console.log("My organization:", organization);

      /*
       * IMPORTANT:
       * Convert both IDs to strings before comparing.
       * This prevents number/string ID mismatches.
       */
      const myOrganizationId = String(organization.id);

      const mine = (data || [])
        .filter((request) => {
          const receiverId =
            request.receiverOrganization?.id;

          return (
            receiverId !== undefined &&
            receiverId !== null &&
            String(receiverId) === myOrganizationId
          );
        })
        .sort((a, b) => {
          const dateA = a.createdAt
            ? new Date(a.createdAt).getTime()
            : 0;

          const dateB = b.createdAt
            ? new Date(b.createdAt).getTime()
            : 0;

          return dateB - dateA;
        });

      console.log("My requests:", mine);

      setRequests(mine);
    } catch (err) {
      console.error(
        "Failed to load request history:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load your request history."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <CheckCircle2
            size={18}
            className="text-green-600"
          />
        );

      case "REJECTED":
        return (
          <XCircle
            size={18}
            className="text-red-500"
          />
        );

      case "COMPLETED":
        return (
          <CheckCircle2
            size={18}
            className="text-green-600"
          />
        );

      default:
        return (
          <Clock3
            size={18}
            className="text-primary"
          />
        );
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "APPROVED":
        return "Your request has been approved by the provider.";

      case "REJECTED":
        return "Your request was rejected by the provider.";

      case "COMPLETED":
        return "This food request has been completed.";

      case "PENDING":
        return "Waiting for the provider to respond.";

      default:
        return "";
    }
  };

  if (loading) {
    return (
      <Panel
        title="Request history"
        description="Every request your organization has made."
      >
        <p className="text-[13.5px] text-muted">
          Loading…
        </p>
      </Panel>
    );
  }

  return (
    <Panel
      title="Request history"
      description="Every request your organization has made."
    >
      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-[13.5px] font-medium text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* HEADER / REFRESH */}
      {requests.length > 0 && (
        <div className="mb-5 flex items-center justify-between gap-4">

          <p className="text-[13px] text-muted">
            {requests.length}{" "}
            {requests.length === 1
              ? "request"
              : "requests"}
          </p>

          <button
            type="button"
            onClick={() => loadRequests(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-[13px] font-medium text-ink transition hover:bg-canvas disabled:opacity-60"
          >
            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing…"
              : "Refresh"}
          </button>

        </div>
      )}

      {/* EMPTY */}
      {requests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No requests yet"
          body="Requests you make from Nearby listings will show up here."
        />
      ) : (
        <div className="flex flex-col gap-4">

          {requests.map((request) => {
            const listing = request.foodListing;
            const provider =
              listing?.organization;

            const status =
              request.status || "PENDING";

            return (
              <div
                key={request.id}
                className="rounded-2xl border border-line bg-white p-5"
              >

                {/* TOP */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                      <h3 className="text-[15px] font-semibold text-ink">
                        {listing?.foodName ||
                          "Listing removed"}
                      </h3>

                      <Badge status={status} />

                    </div>

                    <p className="mt-1.5 text-[13px] text-muted">
                      Provider:{" "}
                      <span className="font-medium text-ink">
                        {provider?.name || "—"}
                      </span>
                    </p>

                  </div>

                  <div className="flex items-center gap-2">

                    {getStatusIcon(status)}

                    <span className="text-[13px] font-semibold text-ink">
                      {status}
                    </span>

                  </div>

                </div>

                {/* DETAILS */}
                <div className="mt-4 grid gap-3 rounded-xl bg-canvas p-4 sm:grid-cols-3">

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                      Quantity
                    </p>

                    <p className="mt-1 text-[13px] font-medium text-ink">
                      {request.requestedQuantity ?? "—"}{" "}
                      {listing?.unit || ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                      Requested
                    </p>

                    <p className="mt-1 text-[13px] font-medium text-ink">
                      {request.createdAt
                        ? new Date(
                            request.createdAt
                          ).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                      Provider
                    </p>

                    <p className="mt-1 text-[13px] font-medium text-ink">
                      {provider?.name || "—"}
                    </p>
                  </div>

                </div>

                {/* STATUS MESSAGE */}
                <div
                  className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 ${
                    status === "APPROVED" ||
                    status === "COMPLETED"
                      ? "bg-green-50"
                      : status === "REJECTED"
                      ? "bg-red-50"
                      : "bg-yellow-50"
                  }`}
                >

                  {getStatusIcon(status)}

                  <p className="text-[13px] font-medium text-ink">
                    {getStatusMessage(status)}
                  </p>

                </div>

              </div>
            );
          })}

        </div>
      )}
    </Panel>
  );
}