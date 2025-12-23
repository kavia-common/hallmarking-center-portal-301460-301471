"use strict";

/**
 * Lightweight API client for the Hallmarking frontend.
 * - Reads base URL from REACT_APP_API_BASE_URL environment variable.
 * - Manages auth via session cookies (Django session authentication).
 * - Provides unified error handling and JSON parsing with graceful fallbacks.
 */

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns API base URL from env (REACT_APP_API_BASE_URL). Throws a helpful error if missing. */
  const base = process.env.REACT_APP_API_BASE_URL;
  if (!base) {
    throw new Error(
      "Missing REACT_APP_API_BASE_URL. Please set it in your environment or .env file."
    );
  }
  return base.replace(/\/+$/, "");
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
  return headers;
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = "GET", body, headers } = {}) {
  /**
   * Performs a fetch request to the backend API with base URL and session cookie handling.
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
      credentials: 'include', // Important for session cookies
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

// Convenience endpoint wrappers matching DRF backend routes

// PUBLIC_INTERFACE
export function registerUser(payload) {
  /** POST /auth/register/ with { username, email, password, password2 } */
  return apiRequest("/auth/register/", { method: "POST", body: payload });
}

// PUBLIC_INTERFACE
export function loginUser(payload) {
  /** POST /auth/login/ with { username, password }. Creates session cookie. */
  return apiRequest("/auth/login/", { method: "POST", body: payload });
}

// PUBLIC_INTERFACE
export function logoutUser() {
  /** POST /auth/logout/ - Destroys session */
  return apiRequest("/auth/logout/", { method: "POST" });
}

// PUBLIC_INTERFACE
export function fetchCurrentUser() {
  /** GET /auth/user/ - Get current authenticated user */
  return apiRequest("/auth/user/", { method: "GET" });
}

// PUBLIC_INTERFACE
export function fetchCenterInfo() {
  /** GET /center/ */
  return apiRequest("/center/", { method: "GET" });
}

// PUBLIC_INTERFACE
export function fetchPortfolio() {
  /** GET /portfolio/ - Returns { services: [], certifications: [] } */
  return apiRequest("/portfolio/", { method: "GET" });
}

// PUBLIC_INTERFACE
export function fetchServices() {
  /** GET /services/ - Returns array of services */
  return apiRequest("/services/", { method: "GET" });
}

// PUBLIC_INTERFACE
export function fetchCertifications() {
  /** GET /certifications/ - Returns array of certifications */
  return apiRequest("/certifications/", { method: "GET" });
}

// PUBLIC_INTERFACE
export function fetchServiceDetail(serviceId) {
  /** GET /services/{id}/ - Returns service with certifications */
  return apiRequest(`/services/${serviceId}/`, { method: "GET" });
}

// PUBLIC_INTERFACE
export function fetchCertificationDetail(certificationId) {
  /** GET /certifications/{id}/ - Returns certification with services */
  return apiRequest(`/certifications/${certificationId}/`, { method: "GET" });
}
