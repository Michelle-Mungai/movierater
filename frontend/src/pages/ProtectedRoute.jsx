import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute() {
  const {
    isLoggedIn,
    loading,
  } = useAuth();

  console.log("ProtectedRoute", {
    loading,
    isLoggedIn,
    user: localStorage.getItem("user"),
    token: localStorage.getItem("token"),
    pathname: window.location.pathname,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />

          <p className="text-[var(--text-secondary)]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      replace
    />
  );
}