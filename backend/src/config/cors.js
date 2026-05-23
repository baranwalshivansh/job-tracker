const DEV_ORIGIN_PATTERNS = [
  /^http:\/\/localhost:517[34]$/,
  /^http:\/\/127\.0\.0\.1:517[34]$/,
];

const normalizeOrigin = (url) => (url ? url.trim().replace(/\/$/, "") : "");

const getAllowedOrigins = () => {
  const origins = [];
  if (process.env.CLIENT_URL) {
    origins.push(normalizeOrigin(process.env.CLIENT_URL));
  }
  if (process.env.CLIENT_URLS) {
    process.env.CLIENT_URLS.split(",").forEach((url) => {
      const normalized = normalizeOrigin(url);
      if (normalized) origins.push(normalized);
    });
  }
  return origins;
};

const isProduction = process.env.NODE_ENV === "production";

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  const normalized = normalizeOrigin(origin);
  const allowed = getAllowedOrigins();

  if (allowed.includes(normalized)) {
    return true;
  }

  if (!isProduction) {
    return DEV_ORIGIN_PATTERNS.some((pattern) => pattern.test(normalized));
  }

  return false;
};

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;
