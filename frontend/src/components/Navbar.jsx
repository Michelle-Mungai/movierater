import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, Film, Tv, Home, LayoutDashboard, Heart } from "lucide-react";
import { useAuth } from "../context/useAuth";
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
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 animate-in fade-in zoom-in-95 duration-200"
        />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies or TV..."
          className="
          w-full
          bg-zinc-900/90
          border
          border-zinc-700
          rounded-full
          py-2.5
          pl-10
          pr-10
          text-white
          placeholder:text-zinc-500
          focus:outline-none
          focus:border-red-500
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
            text-zinc-400
            hover:text-white
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
          bg-zinc-950
          border
          border-zinc-800
          rounded-2xl
          overflow-hidden
          shadow-2xl
          z-50
          animate-in fade-in zoom-in-95 duration-200
          "
        >
          {results.length === 0 && <div className="p-5 text-center text-zinc-500">No results</div>}

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
                hover:bg-zinc-900
                transition
                "
              >
                <div
                  className="
                  w-14
                  h-20
                  rounded
                  bg-zinc-800
                  overflow-hidden
                  flex
                  items-center
                  justify-center
                  "
                >
                  {poster ? (
                    <img src={poster} alt={item.title || item.name} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <Film size={22} className="text-zinc-600" />
                  )}
                </div>

                <div className="text-left flex-1">
                  <p className="text-white font-semibold truncate">{item.title || item.name}</p>

                  <p className="text-sm text-zinc-400">{(item.release_date || item.first_air_date || "").slice(0, 4)}</p>

                  <div className="flex gap-2 mt-1">
                    <span className="text-yellow-400 text-sm">⭐ {item.vote_average.toFixed(1)}</span>

                    <span className="text-xs text-red-400 uppercase">{item.media_type}</span>
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
        ${scrolled ? "bg-black/95 backdrop-blur-xl shadow-xl" : "bg-linear-to-b from-black/90 to-transparent"}
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
            text-red-600
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
                    ${isActive ? "text-red-500" : "text-zinc-300 hover:text-white"}
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

            {isLoggedIn ? (
              <>
                <div
                  className="
                  w-10
                  h-10
                  rounded-full
                  bg-red-600
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
                  className="
                  px-5
                  py-2
                  rounded-full
                  border
                  border-zinc-700
                  hover:bg-red-600
                  transition
                  "
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
                  bg-red-600
                  hover:bg-red-700
                  transition
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="
                  px-5
                  py-2
                  rounded-full
                  border
                  text-white
                  border-red-600
                  hover:bg-red-600
                  transition
                  "
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white">
            {mobileOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {/* FIX: drawer is now a flex column (header / scrollable body / footer)
          instead of a bare h-screen block with an `absolute bottom-0` footer.
          This guarantees the footer (Logout / Login buttons) always renders
          in-flow at the bottom, regardless of how much content is above it. */}
      <div
        className={`
          fixed
          top-0
          right-0
          h-screen
          w-full
          max-w-sm
          bg-zinc-950
          border-l
          border-zinc-800
          z-50
          flex
          flex-col
          transform
          transition-all duration-500 ease-in-out
          lg:hidden
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header — FIX: X close button is now always rendered, not just for logged-out users */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 shrink-0">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div
                className="
                  w-8
                  h-8
                  rounded-full
                  bg-red-600
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
                <p className="text-white font-semibold text-lg leading-tight">{user.username}</p>

                <p className="text-zinc-500 text-sm">Welcome back</p>
              </div>
            </div>
          ) : (
            <span className="text-white font-semibold text-lg">Menu</span>
          )}

          <button onClick={() => setMobileOpen(false)} className="text-zinc-400 hover:text-white transition shrink-0">
            <X size={22} />
          </button>
        </div>

        {/* Scrollable middle section — FIX: overflow-y-auto so long content never pushes the footer offscreen */}
        <div className="flex-1 overflow-y-auto">
          {/* Search */}
          <div className="p-5 border-b border-zinc-800">
            <SearchBar mobile closeMenu={() => setMobileOpen(false)} />
          </div>

          {/* Navigation */}
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
                  ${isActive ? "bg-red-600 text-white" : "text-zinc-300 hover:bg-zinc-900 hover:text-white"}
                  `}
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Footer — FIX: normal flex item (shrink-0) instead of `absolute bottom-0`, so it's always visible */}
        <div className="p-4 border-t border-zinc-800 shrink-0 animate-in fade-in zoom-in-95 duration-200">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="
                w-full
                py-2
                rounded-xl
                bg-red-600
                hover:bg-red-700
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
                  bg-red-600
                  hover:bg-red-700
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
                  border-red-600
                  hover:bg-red-600
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