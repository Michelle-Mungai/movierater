import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, Film, Tv, Home, LayoutDashboard, Heart, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import api from "../services/api";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function SearchBar({ mobile = false, closeMenu }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const ref = useRef(null);

  const debounced = useDebounce(query, 350);

  useEffect(() => {
    if (!debounced.trim()) {
      queueMicrotask(() => {
        setResults([]);
        setOpen(false);
      });
      return;
    }

    let cancelled = false;

    queueMicrotask(() => {
      setLoading(true);
    });

    api
      .get("/movies/search", {
        params: {
          query: debounced,
        },
      })
      .then((res) => {
        if (cancelled) return;

        setResults(res.data.slice(0, 8));
        setOpen(true);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  useEffect(() => {
    function outside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", outside);

    return () => document.removeEventListener("mousedown", outside);
  }, []);

  useEffect(() => {
    function key(e) {
      if (e.key === "/") {
        e.preventDefault();
        document.querySelector("input")?.focus();
      }
    }

    window.addEventListener("keydown", key);

    return () => window.removeEventListener("keydown", key);
  }, []);

  function selectMovie(movie) {
    const type = movie.media_type === "tv" ? "tv" : "movie";

    navigate(`/${type}/${movie.id}`);

    setQuery("");
    setResults([]);
    setOpen(false);

    if (closeMenu) {
      closeMenu();
    }
  }

  return (
    <div ref={ref} className={`relative ${mobile ? "w-full" : "w-64 xl:w-80 2xl:w-96"}`}>
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] animate-in fade-in zoom-in-95 duration-200"
        />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies or TV..."
          className="
          w-full
          bg-[var(--input-bg)]
          border
          border-[var(--border-color)]
          rounded-full
          py-2.5
          pl-10
          pr-10
          text-[var(--text-primary)]
          placeholder:text-[var(--text-muted)]
          focus:outline-none
          focus:border-[var(--accent)]
          transition
          "
        />

        {loading && (
          <div
            className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            w-4
            h-4
            border-2
            border-white
            border-t-transparent
            rounded-full
            animate-spin
            animate-in fade-in zoom-in-95 duration-200
            "
          />
        )}

        {!loading && query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-[var(--text-secondary)]
            hover:text-[var(--text-primary)]
            animate-in fade-in zoom-in-95 duration-200
            "
          >
            ✕
          </button>
        )}
      </div>

      {open && (
        <div
          className="
          absolute
          top-full
          mt-3
          w-full
          bg-[var(--bg-secondary)]
          border
          border-[var(--border-color)]
          rounded-2xl
          overflow-hidden
          shadow-2xl
          z-50
          animate-in fade-in zoom-in-95 duration-200
          "
        >
          {results.length === 0 && <div className="p-5 text-center text-[var(--text-muted)]">No results</div>}

          {results.map((item) => {
            const poster = item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : null;

            return (
              <button
                key={item.id}
                onClick={() => selectMovie(item)}
                className="
                w-full
                flex
                items-center
                gap-3
                p-3
                hover:bg-[var(--bg-card)]
                transition
                "
              >
                <div
                  className="
                  w-14
                  h-20
                  rounded
                  bg-[var(--bg-card-hover)]
                  overflow-hidden
                  flex
                  items-center
                  justify-center
                  "
                >
                  {poster ? (
                    <img src={poster} alt={item.title || item.name} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <Film size={22} className="text-[var(--text-muted)]" />
                  )}
                </div>

                <div className="text-left flex-1">
                  <p className="text-[var(--text-primary)] font-semibold truncate">{item.title || item.name}</p>

                  <p className="text-sm text-[var(--text-secondary)]">{(item.release_date || item.first_air_date || "").slice(0, 4)}</p>

                  <div className="flex gap-2 mt-1">
                    <span className="text-yellow-400 text-sm">⭐ {item.vote_average.toFixed(1)}</span>

                    <span className="text-xs text-[var(--accent)] uppercase">{item.media_type}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ThemeToggle({ className = "", onImage = false }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className={`
      flex
      items-center
      justify-center
      w-10
      h-10
      rounded-full
      border
      transition
      ${
        onImage
          ? "border-white/40 text-white hover:border-[var(--accent)] hover:text-[var(--accent)]"
          : "border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
      }
      ${className}
      `}
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLoggedIn = !!user;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function resize() {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    }

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
    setMobileOpen(false);
  }

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: Home,
    },
    {
      name: "Movies",
      path: "/movies",
      icon: Film,
    },
    {
      name: "TV Shows",
      path: "/tv",
      icon: Tv,
    },
    ...(isLoggedIn
      ? [
          {
            name: "My List",
            path: "/mylist",
            icon: Heart,
          },
          {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
          },
        ]
      : []),
  ];

  return (
    <>
      <nav
        className={`
        fixed
        top-0
        left-0
        right-0
        z-50
        transition-all
        duration-300
        ${scrolled ? "bg-[var(--bg-primary)]/95 backdrop-blur-xl shadow-xl" : "bg-linear-to-b from-black/60 to-transparent"}
      `}
      >
        <div
          className="
          max-w-screen-2xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          h-16
          lg:h-20
          flex
          items-center
          justify-between
          "
        >
          {/* Logo */}
          <Link
            to="/"
            className="
            text-[var(--accent)]
            font-black
            text-xl
            sm:text-2xl
            lg:text-3xl
            tracking-wide
            "
          >
            MovieRater
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex
                    items-center
                    gap-2
                    font-medium
                    transition
                    ${
                      isActive
                        ? "text-[var(--accent)]"
                        : scrolled
                        ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        : "text-gray-200 hover:text-white"
                    }
                    `}
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              );
            })}
          </div>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-5">
            <SearchBar />

            <ThemeToggle onImage={!scrolled} />

            {isLoggedIn ? (
              <>
                <div
                  className="
                  w-10
                  h-10
                  rounded-full
                  bg-[var(--accent)]
                  text-white
                  flex
                  items-center
                  justify-center
                  font-bold
                  uppercase
                  "
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>

                <button
                  onClick={handleLogout}
                  className={`
                  px-5
                  py-2
                  rounded-full
                  border
                  transition
                  ${
                    scrolled
                      ? "border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white"
                      : "border-white/40 text-white hover:bg-[var(--accent)] hover:border-[var(--accent)]"
                  }
                  `}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="
                  px-5
                  py-2
                  rounded-full
                  bg-[var(--accent)]
                  hover:bg-[var(--accent-hover)]
                  text-white
                  transition
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className={`
                  px-5
                  py-2
                  rounded-full
                  border
                  hover:bg-[var(--accent)]
                  hover:text-white
                  transition
                  ${
                    scrolled
                      ? "text-[var(--text-primary)] border-[var(--accent)]"
                      : "text-white border-white/60"
                  }
                  `}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className={scrolled ? "lg:hidden text-[var(--text-primary)]" : "lg:hidden text-white"}>
            {mobileOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`
          fixed
          top-0
          right-0
          h-screen
          w-full
          max-w-sm
          bg-[var(--bg-secondary)]
          border-l
          border-[var(--border-color)]
          z-50
          overflow-y-auto
          transform
          transition-all duration-500 ease-in-out
          lg:hidden
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div
                className="
                  w-8
                  h-8
                  rounded-full
                  bg-[var(--accent)]
                  flex
                  items-center
                  justify-center
                  font-bold
                  uppercase
                "
              >
                {user.username.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-[var(--text-primary)] font-semibold text-lg leading-tight">{user.username}</p>

                <p className="text-[var(--text-muted)] text-sm">Welcome back</p>
              </div>
            </div>
          ) : (
            <span className="text-[var(--text-primary)] font-semibold text-lg">Menu</span>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />

            <button onClick={() => setMobileOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition p-2">
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="p-5 border-b border-[var(--border-color)]">
          <SearchBar mobile closeMenu={() => setMobileOpen(false)} />
        </div>

        <div className="flex flex-col py-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `
                  flex
                  items-center
                  gap-3
                  px-6
                  py-3
                  text-base
                  font-medium
                  transition
                  ${isActive ? "bg-[var(--accent)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"}
                  `}
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-[var(--border-color)]">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="
                w-full
                py-2
                rounded-xl
                bg-[var(--accent)]
                hover:bg-[var(--accent-hover)]
                text-white
                transition
                font-semibold
              "
            >
              Logout
            </button>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="
                  block
                  w-full
                  text-center
                  py-2
                  rounded-xl
                  bg-[var(--accent)]
                  hover:bg-[var(--accent-hover)]
                  text-white
                  transition
                  font-semibold
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="
                  block
                  w-full
                  text-center
                  py-2
                  rounded-xl
                  border
                  border-[var(--accent)]
                  hover:bg-[var(--accent)]
                  transition
                  font-semibold
                "
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}