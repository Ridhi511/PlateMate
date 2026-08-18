import { useCallback, useEffect, useState } from "react";
import { getAllOrganizations } from "../services/api";
import { useAuth } from "../context/AuthContext";

/**
 * There's no GET /organizations/mine on the backend, so this fetches
 * every organization and finds the one this user owns. Also exposes
 * `refetch` so pages can pull fresh trust score / verification status
 * after an action (e.g. right after an admin verifies it).
 */
export function useMyOrganization() {
  const { user } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await getAllOrganizations();
      const mine = data.find((org) => org.owner?.id === user.id) ?? null;
      setOrganization(mine);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { organization, loading, error, refetch };
}
