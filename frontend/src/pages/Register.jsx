import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import api from "../services/api";
import toast from "react-hot-toast";

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
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">

          <div className="text-center mb-8">

            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Create Account
            </h1>

            <p className="text-gray-400 mt-2">
              Join MovieRater and start reviewing movies.
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
              gap-3
              bg-white
              hover:bg-gray-100
              text-black
              font-semibold
              py-3
              rounded-xl
              transition
              mb-6
            "
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />

            Sign up with Google
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
                  rounded-xl
                  p-3
                  text-white
                  focus:outline-none
                  focus:border-red-500
                "
              />

            </div>

            <div>

              <label className="block text-gray-300 mb-2">
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
                  rounded-xl
                  p-3
                  text-white
                  focus:outline-none
                  focus:border-red-500
                "
              />

            </div>

            <div>

              <label className="block text-gray-300 mb-2">
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
                  rounded-xl
                  p-3
                  text-white
                  focus:outline-none
                  focus:border-red-500
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
                font-bold
                py-3
                rounded-xl
                transition
              "
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <p className="text-center text-gray-400 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-red-500 hover:text-red-400"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}