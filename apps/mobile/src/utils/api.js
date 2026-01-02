/**
 * API utility for making requests to the backend
 * Handles base URL configuration for different environments
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4000';

/**
 * Make an API request with the configured base URL
 * @param {string} endpoint - API endpoint (e.g., '/api/games')
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Add default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Get the full API URL for a given endpoint
 * @param {string} endpoint - API endpoint
 * @returns {string} Full URL
 */
export function getApiUrl(endpoint) {
  return `${API_BASE_URL}${endpoint}`;
}

export { API_BASE_URL };
