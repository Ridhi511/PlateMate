import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import NotAuthorizedPage from "../pages/NotAuthorizedPage";

import ProviderOverview from "../pages/provider/ProviderOverview";
import ProviderListings from "../pages/provider/ProviderListings";
import ProviderAnalytics from "../pages/provider/ProviderAnalytics";
import ProviderProfile from "../pages/provider/ProviderProfile";

import ReceiverOverview from "../pages/receiver/ReceiverOverview";
import ReceiverBrowse from "../pages/receiver/ReceiverBrowse";
import ReceiverRequests from "../pages/receiver/ReceiverRequests";
import ReceiverNotifications from "../pages/receiver/ReceiverNotifications";

import AdminOverview from "../pages/admin/AdminOverview";
import AdminOrganizations from "../pages/admin/AdminOrganizations";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminAnalytics from "../pages/admin/AdminAnalytics";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/not-authorized" element={<NotAuthorizedPage />} />

          <Route
            path="/provider"
            element={
              <ProtectedRoute allowedRoles={["PROVIDER"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProviderOverview />} />
            <Route path="listings" element={<ProviderListings />} />
            <Route path="analytics" element={<ProviderAnalytics />} />
            <Route path="profile" element={<ProviderProfile />} />
          </Route>

          <Route
            path="/receiver"
            element={
              <ProtectedRoute allowedRoles={["RECEIVER"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ReceiverOverview />} />
            <Route path="browse" element={<ReceiverBrowse />} />
            <Route path="requests" element={<ReceiverRequests />} />
            <Route path="notifications" element={<ReceiverNotifications />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="organizations" element={<AdminOrganizations />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
