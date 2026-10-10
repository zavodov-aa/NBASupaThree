import { useAuth } from "./AuthContext";

export function useRole() {
  const { user, loading } = useAuth();
  const role = user?.role ?? null;

  return {
    role,
    loading,
    isAdmin: role === "admin",
    isUser: role === "user",
    isAuthenticated: !!user,
  };
}
