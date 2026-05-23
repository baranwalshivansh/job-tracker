/** Cross-origin cookies (Vercel frontend + hosted API) require Secure + SameSite=None. */
const isCrossOriginDeployment = () => {
  if (process.env.NODE_ENV === "production") {
    return true;
  }
  const clientUrl = (process.env.CLIENT_URL || "").trim();
  return clientUrl.startsWith("https://");
};

const getAuthCookieOptions = () => {
  const crossOrigin = isCrossOriginDeployment();

  return {
    httpOnly: true,
    secure: crossOrigin,
    sameSite: crossOrigin ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  };
};

module.exports = { getAuthCookieOptions };
