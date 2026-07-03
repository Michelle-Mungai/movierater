import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./pages/ProtectedRoute";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import MoviePage from "./pages/MoviePage";
import Dashboard from "./pages/Dashboard";
import MyList from "./pages/MyList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GoogleSuccess from "./pages/GoogleSuccess";

export default function App() {
  return (
    <div className="bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)]">
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/movies"
          element={<Movies />}
        />

        <Route
          path="/movie/:id"
          element={<MoviePage />}
        />

        <Route
          path="/tv"
          element={<TVShows />}
        />

        <Route
          path="/tv/:id"
          element={<MoviePage />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/google-success"
          element={<GoogleSuccess />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/mylist"
            element={<MyList />}
          />
        </Route>

        <Route
          path="*"
          element={<Home />}
        />
      </Routes>
    </div>
  );
}