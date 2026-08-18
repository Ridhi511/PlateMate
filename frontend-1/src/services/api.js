import axios from "axios";

// Points at your Spring Boot backend. Override with a .env file
// (VITE_API_BASE_URL=http://localhost:8080) if it runs elsewhere.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT to every request once the user is logged in.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("platemate_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 means the token expired or was rejected — clear it and bounce
// to login rather than leaving the app in a half-authenticated state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("platemate_token");
      localStorage.removeItem("platemate_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/* ----------------------------- Auth ----------------------------- */
// POST /auth/register returns the raw User entity.
export const registerUser = (payload) => api.post("/auth/register", payload);
// POST /auth/login returns { token } only — no user info in the body.
export const loginUser = (payload) => api.post("/auth/login", payload);

/* ----------------------------- Users ------------------------------ */
// There is no GET /users/me on the backend — the frontend resolves
// "who am I" by fetching everyone and matching on the email decoded
// from the JWT. Fine for an MVP's user count, won't scale.
export const getAllUsers = () => api.get("/users");

/* -------------------------- Organizations -------------------------- */
export const createOrganization = (payload) => api.post("/organizations", payload);
export const getAllOrganizations = () => api.get("/organizations");

/* -------------------------- Food listings --------------------------- */
export const createFoodListing = (payload) => api.post("/food-listings", payload);
export const getAllFoodListings = () => api.get("/food-listings");
export const getAvailableFoodListings = () => api.get("/food-listings/available");

/* -------------------------- Food requests ---------------------------- */
export const createFoodRequest = (payload) => api.post("/food-requests", payload);
export const approveFoodRequest = (id) => api.put(`/food-requests/${id}/approve`);
export const rejectFoodRequest = (id) => api.put(`/food-requests/${id}/reject`);
export const completeFoodRequest = (id) => api.put(`/food-requests/${id}/complete`);
export const getAllFoodRequests = () => api.get("/food-requests");
export const getPendingFoodRequests = () => api.get("/food-requests/pending");

/* ------------------------------ Matching ------------------------------ */
export const getBestMatches = () => api.get("/matching/organizations");
export const getMatchesForListing = (listingId) =>
  api.get(`/matching/food-listings/${listingId}`);

/* ------------------------------- Admin --------------------------------- */
export const verifyOrganization = (id) => api.put(`/admin/organizations/${id}/verify`);
export const rejectOrganization = (id) => api.put(`/admin/organizations/${id}/reject`);
export const getPendingOrganizations = () => api.get("/admin/organizations/pending");

/* ----------------------------- Dashboard --------------------------------- */
// Platform-wide counts (not scoped to the logged-in user/org).
export const getDashboardStats = () => api.get("/dashboard/stats");

export default api;
