export const AUTH_GRACE_UNTIL_KEY = "auth_grace_until";

const DEFAULT_MS = 5000;

export const beginAuthGracePeriod = (ms = DEFAULT_MS) => {
  sessionStorage.setItem(AUTH_GRACE_UNTIL_KEY, String(Date.now() + ms));
};

export const isInAuthGracePeriod = () => {
  const until = Number(sessionStorage.getItem(AUTH_GRACE_UNTIL_KEY) || 0);
  return Date.now() < until;
};

export const clearAuthGracePeriod = () => {
  sessionStorage.removeItem(AUTH_GRACE_UNTIL_KEY);
};
