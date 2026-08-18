export const roleHome = {
  PROVIDER: "/provider",
  RECEIVER: "/receiver",
  ADMIN: "/admin",
};

export const providerOrgTypes = [
  { value: "RESTAURANT", label: "Restaurant" },
  { value: "BAKERY", label: "Bakery" },
  { value: "HOTEL", label: "Hotel" },
  { value: "SUPERMARKET", label: "Supermarket" },
  { value: "WEDDING_VENUE", label: "Wedding venue" },
  { value: "CORPORATE_CAFETERIA", label: "Corporate cafeteria" },
  { value: "COLLEGE_MESS", label: "College mess" },
  { value: "INDIVIDUAL", label: "Individual donor" },
];

export const receiverOrgTypes = [
  { value: "NGO", label: "NGO" },
  { value: "SHELTER_HOME", label: "Shelter home" },
  { value: "ORPHANAGE", label: "Orphanage" },
  { value: "FOOD_BANK", label: "Food bank" },
  { value: "COMMUNITY_KITCHEN", label: "Community kitchen" },
];

export function extractErrorMessage(err, fallback) {
  return (
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    (err?.response?.status === 500 ? fallback : null) ||
    err?.message ||
    fallback
  );
}
