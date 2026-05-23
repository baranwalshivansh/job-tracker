import axios from "axios";
import { USER_KEY } from "./constants.js";
import { isInAuthGracePeriod } from "./authGrace.js";

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.error("VITE_API_URL is not set. API requests will fail in production.");
}

const AUTH_PUBLIC_PATHS = ["/user/login", "/user/register", "/user/logout"];

const isAuthPublicRequest = (config) => {
  const url = config?.url || "";
  return AUTH_PUBLIC_PATHS.some((path) => url.includes(path));
};

let onUnauthorized = null;

export const registerUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

api.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const config = error.config;

    if (status !== 401 || !config) {
      return Promise.reject(error);
    }

    if (config.skipAuthRedirect || isAuthPublicRequest(config)) {
      return Promise.reject(error);
    }

    if (isInAuthGracePeriod()) {
      return Promise.reject(error);
    }

    const hadStoredSession = Boolean(localStorage.getItem(USER_KEY));
    if (!hadStoredSession) {
      return Promise.reject(error);
    }

    localStorage.removeItem(USER_KEY);
    onUnauthorized?.();

    const path = window.location.pathname;
    const isPublicRoute = path === "/" || path === "/login" || path === "/register";

    if (!isPublicRoute && !path.startsWith("/login") && !path.startsWith("/register")) {
      const redirect = encodeURIComponent(path + window.location.search);
      window.location.replace(`/login?session=expired&redirect=${redirect}`);
    }

    return Promise.reject(error);
  }
);

export const getErrorMessage = (error, fallback = "Something went wrong") => {
  return error?.response?.data?.message || error?.message || fallback;
};

export default api;
