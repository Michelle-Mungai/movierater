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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />

          <p className="text-gray-400">
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