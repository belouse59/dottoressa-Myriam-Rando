require("dotenv").config();
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const contactRoutes = require("./routes/contactRoutes");
const app = express();
const CSP_CONFIG = require("./config/csp");

// security + middleware
app.use(helmet(CSP_CONFIG));

//Lock down CORS to only accept GET/POST between the domain
const allowedOrigin = process.env.ALLOWED_ORIGIN;
if (!allowedOrigin) throw new Error("ALLOWED_ORIGIN env variable is not set");

const allowedOrigins = [
  process.env.ALLOWED_ORIGIN,
  process.env.ALLOWED_ORIGIN_WWW,
  /\.vercel\.app$/
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowed = allowedOrigins.some(item =>
      item instanceof RegExp
        ? item.test(origin)
        : item === origin
    );

    if (allowed) return callback(null, true);

    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST"]
}));

app.use(express.json());
app.use(morgan("dev"));
// any routes inside the corresponding routes will be prefixed with "/api/*"
app.use("/api/contact", contactRoutes);

// serve frontend (your old Google HTML will go here later)
app.use(express.static(path.join(__dirname, "../public")));

// Catch unhandled errors — never expose internals
app.use((err, req, res, next) => {
  console.error(err);

  if (err.message === "Not allowed by CORS") {
    const html = loadTemplate("server-error.html", {
      APP_URL: process.env.APP_URL
    });

    return res.status(403).send(html);
  }

  const html = loadTemplate("server-error.html", {
    APP_URL: process.env.APP_URL
  });

  res.status(500).send(html);
});

// health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

module.exports = app;
