import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import { useAuth } from "../context/useAuth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    location.state?.from?.pathname ||
    "/dashboard";

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error(
        "Please fill in all fields."
      );
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      toast.error(
        "Please enter a valid email address."
      );
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      login(data.user, data.token);

      toast.success(
        `Welcome back ${data.user.username}!`
      );

      navigate(redirectTo, {
        replace: true,
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    const apiUrl =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    window.location.href =
      `${apiUrl}/auth/google`;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-2xl">

          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to keep watching
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black text-sm font-semibold py-2.5 rounded-lg transition mb-5"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-4 h-4"
            />

            Continue with Google
          </button>

          <div className="flex items-center mb-5">
            <div className="flex-1 h-px bg-zinc-700" />

            <span className="px-3 text-gray-500 text-xs uppercase tracking-wide">
              Or
            </span>

            <div className="flex-1 h-px bg-zinc-700" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5">
                Email
              </label>

              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="john@example.com"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-red-500 transition"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5">
                Password
              </label>

              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-red-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-red-500 hover:text-red-400 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}