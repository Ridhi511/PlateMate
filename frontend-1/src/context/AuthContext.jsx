import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginUser, registerUser, getAllUsers } from "../services/api";
import { decodeJwt, isTokenExpired } from "../utils/jwt";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("platemate_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("platemate_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  // Rehydrate on load: if we have a token, make sure it isn't expired,
  // then re-resolve the user record (in case it changed since last visit).
  useEffect(() => {
    (async () => {
      if (token && !isTokenExpired(token)) {
        await resolveUserFromToken(token);
      } else if (token) {
        clearSession();
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolveUserFromToken = async (jwt) => {
    const decoded = decodeJwt(jwt);
    if (!decoded) return null;
    // No GET /users/me on the backend, so we fetch everyone and match
    // on the email the token was issued for. Falls back to a minimal
    // user object (role + email only) if that lookup fails.
    try {
      const { data: users } = await getAllUsers();
      const match = users.find((u) => u.email === decoded.sub);
      const resolved = match
        ? { id: match.id, name: match.name, email: match.email, role: match.role }
        : { email: decoded.sub, role: decoded.role };
      setUser(resolved);
      localStorage.setItem("platemate_user", JSON.stringify(resolved));
      return resolved;
    } catch {
      const fallback = { email: decoded.sub, role: decoded.role };
      setUser(fallback);
      localStorage.setItem("platemate_user", JSON.stringify(fallback));
      return fallback;
    }
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("platemate_token");
    localStorage.removeItem("platemate_user");
  };

  const login = useCallback(async (email, password) => {
    const { data } = await loginUser({ email, password });
    localStorage.setItem("platemate_token", data.token);
    setToken(data.token);
    const resolved = await resolveUserFromToken(data.token);
    return resolved;
  }, []);

  // Registers the user, then logs in immediately (the backend has no
  // "register and return a token" combined endpoint).
  const register = useCallback(async ({ name, email, password, role }) => {
    await registerUser({ name, email, password, role });
    return login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
