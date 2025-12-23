"use strict";

/**
 * Lightweight API client for the Hallmarking frontend.
 * - Reads base URL from REACT_APP_API_BASE_URL environment variable.
 * - Manages auth token storage (memory + localStorage).
 * - Attaches Authorization header when token is present.
 * - Provides unified error handling and JSON parsing with graceful fallbacks.
 */

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns API base URL from env (REACT_APP_API_BASE_URL). Throws a helpful error if missing. */
  const base = process.env.REACT_APP_API_BASE_URL;
  if (!base) {
    // We don't hardcode localhost anywhere; instructs developer to provide env var.
    throw new Error(
      "Missing REACT_APP_API_BASE_URL. Please set it in your environment or .env file."
    );
  }
  return base.replace(/\/+$/, "");
}

// Simple in-memory token store with localStorage persistence
let inMemoryToken = null;
const LS_KEY = "hm_auth_token";

// PUBLIC_INTERFACE
export function getToken() {
  /** Get the current auth token from memory or localStorage. */
  if (inMemoryToken) return inMemoryToken;
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const fromLS = ls ? ls.getItem(LS_KEY) : null;
  if (fromLS) inMemoryToken = fromLS;
  return inMemoryToken;
}

// PUBLIC_INTERFACE
export function setToken(token) {
  /** Set the auth token and persist it to localStorage. Pass null/undefined to clear. */
  inMemoryToken = token || null;
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  try {
    if (ls) {
      if (inMemoryToken) {
        ls.setItem(LS_KEY, inMemoryToken);
      } else {
        ls.removeItem(LS_KEY);
      }
    }
  } catch {
    // Ignore storage errors (e.g., private mode)
  }
}

// PUBLIC_INTERFACE
export function clearToken() {
  /** Clear the auth token from memory and localStorage. */
  setToken(null);
}

async function parseJsonSafe(resp) {
  try {
    return await resp.json();
  } catch {
    return null;
  }
}

function buildHeaders(extraHeaders) {
  const headers = { "Content-Type": "application/json", ...extraHeaders };
  const t = getToken();
  if (t) {
    headers["Authorization"] = `Bearer ${t}`;
  }
  return headers;
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = "GET", body, headers } = {}) {
  /**
   * Performs a fetch request to the backend API with base URL and token handling.
   * Returns { ok, status, data, error } with graceful error messages.
   */
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  let resp;
  try {
    resp = await fetch(url, {
      method,
      headers: buildHeaders(headers),
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    return {
      ok: false,
      status: 0,
      data: null,
      error:
        "Network error connecting to the API. Please verify REACT_APP_API_BASE_URL and backend availability.",
    };
  }

  const data = await parseJsonSafe(resp);
  if (!resp.ok) {
    // Attempt to extract a reasonable error message from body
    const message =
      (data && (data.detail || data.error || data.message)) ||
      `Request failed with status ${resp.status}`;
    return { ok: false, status: resp.status, data, error: message };
  }
  return { ok: true, status: resp.status, data, error: null };
}

// Convenience endpoint wrappers (placeholders pointing to expected backend routes)

// PUBLIC_INTERFACE
export function registerUser(payload) {
  /** POST /auth/register with { name, email, password } */
  return apiRequest("/auth/register", { method: "POST", body: payload });
}

// PUBLIC_INTERFACE
export function loginUser(payload) {
  /** POST /auth/login with { email, password }. Expected response to include { accessToken } or { token }. */
  return apiRequest("/auth/login", { method: "POST", body: payload });
}

// PUBLIC_INTERFACE
export function fetchCenterInfo() {
  /** GET /center-info */
  return apiRequest("/center-info", { method: "GET" });
}

// PUBLIC_INTERFACE
export function fetchPortfolio() {
  /** GET /portfolio */
  return apiRequest("/portfolio", { method: "GET" });
}
