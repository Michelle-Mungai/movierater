import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import { useAuth } from "../context/useAuth";

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
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">

          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white">
              Welcome Back
            </h1>

            <p className="text-gray-400 mt-2">
              Login to continue.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-semibold py-3 rounded-xl transition mb-6"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />

            Continue with Google
          </button>

          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-zinc-700" />

            <span className="px-3 text-gray-500 text-sm">
              OR
            </span>

            <div className="flex-1 h-px bg-zinc-700" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block text-gray-300 mb-2">
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
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
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
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-red-500 hover:text-red-400"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}