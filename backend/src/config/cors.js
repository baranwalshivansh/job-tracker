const DEV_ORIGIN_PATTERNS = [
  /^http:\/\/localhost:517[34]$/,
  /^http:\/\/127\.0\.0\.1:517[34]$/,
];

const normalizeOrigin = (url) => (url ? url.trim().replace(/\/$/, "") : "");

const clientUrl = normalizeOrigin(process.env.CLIENT_URL || "");
const isLocalDev =
  !clientUrl || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(clientUrl);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  const normalized = normalizeOrigin(origin);

  if (clientUrl && normalized === clientUrl) {
    return true;
  }

  if (process.env.CLIENT_URLS) {
    const extras = process.env.CLIENT_URLS.split(",").map(normalizeOrigin).filter(Boolean);
    if (extras.includes(normalized)) {
      return true;
    }
  }

  if (isLocalDev) {
    return DEV_ORIGIN_PATTERNS.some((pattern) => pattern.test(normalized));
  }

  return false;
};

const sharedOptions = {
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

/** Production: fixed CLIENT_URL (e.g. https://job-tracker-ten-ashen.vercel.app) */
const corsOptions =
  !isLocalDev && clientUrl
    ? {
        ...sharedOptions,
        origin: clientUrl,
      }
    : {
        ...sharedOptions,
        origin(origin, callback) {
          if (isAllowedOrigin(origin)) {
            callback(null, true);
          } else {
            callback(null, false);
          }
        },
      };

module.exports = corsOptions;
