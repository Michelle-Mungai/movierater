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
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-sm">

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-2xl">

          <div className="text-center mb-6">

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Create account
            </h2>
            <p className="text-gray-500 text-sm mt-1">
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
              gap-2
              bg-white
              hover:bg-gray-100
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
                  bg-zinc-800
                  border
                  border-zinc-700
                  rounded-lg
                  py-2.5
                  px-3.5
                  text-sm
                  text-white
                  focus:outline-none
                  focus:border-red-500
                  transition
                "
              />

            </div>

            <div>

              <label className="block text-gray-400 text-xs font-medium mb-1.5">
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
                  bg-zinc-800
                  border
                  border-zinc-700
                  rounded-lg
                  py-2.5
                  px-3.5
                  text-sm
                  text-white
                  focus:outline-none
                  focus:border-red-500
                  transition
                "
              />

            </div>

            <div>

              <label className="block text-gray-400 text-xs font-medium mb-1.5">
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
                  bg-zinc-800
                  border
                  border-zinc-700
                  rounded-lg
                  py-2.5
                  px-3.5
                  text-sm
                  text-white
                  focus:outline-none
                  focus:border-red-500
                  transition
                "
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-red-600
                hover:bg-red-700
                disabled:opacity-60
                text-white
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

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-red-500 hover:text-red-400 font-medium"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}