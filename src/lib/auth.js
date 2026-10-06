// Trello REST API Client authorization helpers.
// Trello's Power-Up REST API client securely manages the member token.

export const APP_KEY = import.meta.env.VITE_TRELLO_APP_KEY;
export const APP_NAME = "Reusable Checklist Library";

/**
 * Returns Trello's REST API client.
 */
export function getRestApi(t) {
  if (!t || typeof t.getRestApi !== "function") {
    throw new Error("Trello REST API client is unavailable.");
  }

  return t.getRestApi();
}

/**
 * Returns the token managed by Trello's REST API client.
 */
export async function getToken(t) {
  try {
    const client = getRestApi(t);
    return await client.getToken();
  } catch (error) {
    console.error("[Checklist Library] getToken error:", error);
    return null;
  }
}

/**
 * Check whether the current Trello member has authorized the Power-Up.
 */
export async function isAuthorized(t) {
  try {
    const client = getRestApi(t);
    return await client.isAuthorized();
  } catch (error) {
    console.error(
      "[Checklist Library] authorization check failed:",
      error
    );

    return false;
  }
}

/**
 * Start Trello authorization.
 *
 * Trello handles the authorization popup and securely stores
 * the resulting token for the member.
 */
export async function authorize(t) {
  if (!APP_KEY) {
    throw new Error(
      "VITE_TRELLO_APP_KEY is not configured."
    );
  }

  const client = getRestApi(t);

  return client.authorize({
    expiration: "never"
  });
}

/**
 * Remove the token managed by Trello's REST API client.
 */
export async function clearToken(t) {
  try {
    const client = getRestApi(t);
    await client.clearToken();
  } catch (error) {
    console.error(
      "[Checklist Library] clearToken error:",
      error
    );
  }
}