const getAuthCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    ...(isProduction ? { secure: true } : {}),
  };
};

module.exports = { getAuthCookieOptions };
