import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import api from "../services/api";
import toast from "react-hot-toast";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      return toast.error("Please fill in all fields.");
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return toast.error("Please enter a valid email address.");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      login(res.data.user, res.data.token);

      toast.success("Account created!");

      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // FIXED: this was hardcoded to localhost:5000, unlike Login.jsx's
    // equivalent handler, which would break Google sign-up in any
    // deployed (non-localhost) environment.
    const apiUrl =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-sm">

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-7 shadow-2xl">

          <div className="text-center mb-6">

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Create account
            </h2>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Join to start rating and reviewing
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-1
              bg-white
              hover:bg-gray-200
              text-black
              text-sm
              font-semibold
              py-2.5
              rounded-lg
              transition
              mb-5
            "
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-4 h-4"
            />

            Sign up with Google
          </button>

          <div className="flex items-center mb-5">
            <div className="flex-1 h-px bg-[var(--bg-card-hover)]" />
            <span className="px-3 text-[var(--text-muted)] text-xs uppercase tracking-wide">
              Or
            </span>
            <div className="flex-1 h-px bg-[var(--bg-card-hover)]" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <div>

              <label className="block text-[var(--text-secondary)] text-xs font-medium mb-1.5">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="MovieFan"
                className="
                  w-full
                  bg-[var(--bg-card-hover)]
                  border
                  border-[var(--border-color)]
                  rounded-lg
                  py-2.5
                  px-3.5
                  text-sm
                  text-[var(--text-primary)]
                  focus:outline-none
                  focus:border-[var(--accent)]
                  transition
                "
              />

            </div>

            <div>

              <label className="block text-[var(--text-secondary)] text-xs font-medium mb-1.5">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="john@example.com"
                className="
                  w-full
                  bg-[var(--bg-card-hover)]
                  border
                  border-[var(--border-color)]
                  rounded-lg
                  py-2.5
                  px-3.5
                  text-sm
                  text-[var(--text-primary)]
                  focus:outline-none
                  focus:border-[var(--accent)]
                  transition
                "
              />

            </div>

            <div>

              <label className="block text-[var(--text-secondary)] text-xs font-medium mb-1.5">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Minimum 6 characters"
                className="
                  w-full
                  bg-[var(--bg-card-hover)]
                  border
                  border-[var(--border-color)]
                  rounded-lg
                  py-2.5
                  px-3.5
                  text-sm
                  text-[var(--text-primary)]
                  focus:outline-none
                  focus:border-[var(--accent)]
                  transition
                "
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-[var(--accent)]
                hover:bg-[var(--accent-hover)]
                disabled:opacity-60
                text-[var(--text-primary)]
                text-sm
                font-semibold
                py-2.5
                rounded-lg
                transition
              "
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          <p className="text-center text-[var(--text-muted)] text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[var(--accent)] hover:text-[var(--accent)] font-medium"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}