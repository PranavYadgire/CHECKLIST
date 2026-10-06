// Trello Power-Up authentication configuration

export const APP_KEY =
  import.meta.env.VITE_TRELLO_APP_KEY;

export const APP_NAME =
  "Reusable Checklist Library";

export function getRestApi(t) {
  if (!t || typeof t.getRestApi !== "function") {
    throw new Error(
      "Trello REST API client is unavailable."
    );
  }

  return t.getRestApi();
}

export async function getToken(t) {
  try {
    const api = await getRestApi(t);

    return await api.getToken();
  } catch (error) {
    console.error(
      "[Checklist Library] getToken error:",
      error
    );

    return null;
  }
}

export async function isAuthorized(t) {
  try {
    const api = await getRestApi(t);

    return await api.isAuthorized();
  } catch (error) {
    console.error(
      "[Checklist Library] isAuthorized error:",
      error
    );

    return false;
  }
}

export async function authorize(t) {
  if (!APP_KEY) {
    throw new Error(
      "VITE_TRELLO_APP_KEY is not configured."
    );
  }

  const api = await getRestApi(t);

  return api.authorize({
    expiration: "never",
    scope: "read,write"
  });
}

export async function clearToken(t) {
  try {
    const api = await getRestApi(t);

    await api.clearToken();
  } catch (error) {
    console.error(
      "[Checklist Library] clearToken error:",
      error
    );
  }
}