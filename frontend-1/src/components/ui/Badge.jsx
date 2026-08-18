const styles = {
  // FoodStatus
  AVAILABLE: "bg-tint text-primary-dark",
  RESERVED: "bg-blue-50 text-blue-700",
  PICKED_UP: "bg-stone-100 text-stone-600",
  EXPIRED: "bg-red-50 text-red-600",
  CANCELLED: "bg-red-50 text-red-600",
  // RequestStatus
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-tint text-primary-dark",
  REJECTED: "bg-red-50 text-red-600",
  COMPLETED: "bg-stone-100 text-stone-600",
  // VerificationStatus
  VERIFIED: "bg-tint text-primary-dark",
};

export default function Badge({ status, children }) {
  const cls = styles[status] ?? "bg-stone-100 text-stone-600";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${cls}`}>
      {children ?? status}
    </span>
  );
}
