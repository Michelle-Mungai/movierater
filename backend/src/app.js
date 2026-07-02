// src/app.js
//
// FIXED: this file previously just did
//   const app = express(); module.exports = app;
// with no middleware, no routes - it was dead code that server.js never
// even imported (server.js built its own separate, fully-wired app
// inline). Splitting config (here) from startup (server.js) is standard
// practice and makes the app importable/testable without binding a port.

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const passport = require("./config/passport");

const logger = require("./utils/logger");
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(helmet());

app.use(express.json());

app.use(logger);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  })
);

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({
    status: "OK",
  });
});

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/movies", require("./routes/movie.routes"));
app.use("/api/tv", require("./routes/tv.routes"));
app.use("/api/reviews", require("./routes/review.routes"));
app.use("/api/recommendations", require("./routes/recommendation.routes"));
app.use("/api/stats", require("./routes/stats.routes"));

app.use(errorHandler);

module.exports = app;
