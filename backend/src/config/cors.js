const DEV_ORIGIN_PATTERNS = [
  /^http:\/\/localhost:517[34]$/,
  /^http:\/\/127\.0\.0\.1:517[34]$/,
];

const getExtraOrigins = () => {
  const origins = [];
  if (process.env.CLIENT_URL) {
    origins.push(process.env.CLIENT_URL.trim());
  }
  if (process.env.CLIENT_URLS) {
    origins.push(
      ...process.env.CLIENT_URLS.split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    );
  }
  return origins;
};

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  const extras = getExtraOrigins();
  if (extras.includes(origin)) {
    return true;
  }

  if (process.env.NODE_ENV !== "production") {
    return DEV_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
  }

  return extras.length > 0 && extras.includes(origin);
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
