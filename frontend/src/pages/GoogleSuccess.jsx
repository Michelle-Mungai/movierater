import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

export default function GoogleSuccess() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log(location.pathname);
  
  useEffect(() => {
    let mounted = true;

    async function authenticate() {
      try {
        const params = new URLSearchParams(
          window.location.search
        );

        const token = params.get("token");

        if (!token) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        const { data } = await api.get(
          "/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!mounted) return;

        login(data, token);

        console.log("GoogleSuccess user:", data);
        console.log("After login:");
console.log(localStorage.getItem("token"));
console.log(localStorage.getItem("user"));

        toast.success(
          "Successfully signed in."
        );

        await Promise.resolve();

        navigate("/dashboard", {
          replace: true,
        });
      } catch (err) {
        console.error(err);

        toast.error(
          "Google login failed."
        );

        navigate("/login", {
          replace: true,
        });
      }
    }

    authenticate();

    return () => {
      mounted = false;
    };
  }, [login, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />

        <p className="text-gray-300">
          Completing sign in...
        </p>
      </div>
    </div>
  );
}