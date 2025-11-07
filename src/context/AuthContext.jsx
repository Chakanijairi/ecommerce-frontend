import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../api/client";

const AuthContext = createContext(null);

const setAuthHeader = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("authUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
    setAuthHeader(token);
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [user]);

  useEffect(() => {
    setAuthHeader(token);
  }, []); // ensure header is set on mount with stored token

  const handleAuth = async (endpoint, payload) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.post(endpoint, payload);
      if (!data?.token || !data?.user) {
        throw new Error("Invalid response from server");
      }
      setUser(data.user);
      setToken(data.token);
      return data.user;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Request failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = (credentials) => handleAuth("/auth/login", credentials);
  const register = (details) => handleAuth("/auth/register", details);

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user && token),
      clearError: () => setError(null),
    }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

