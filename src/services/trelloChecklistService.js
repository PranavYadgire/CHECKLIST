// Trello card checklist operations.

import {
  APP_KEY,
  APP_NAME,
} from "../lib/auth.js";

export const NOT_AUTHORIZED = "NOT_AUTHORIZED";

/**
 * Get a REST API client configured for this Power-Up.
 *
 * This is important because checklists.html is a secondary
 * iframe. Trello requires the REST API client to know the
 * Power-Up app key and app name.
 */
async function getRestApi() {
  if (
    !window.TrelloPowerUp ||
    typeof window.TrelloPowerUp.iframe !== "function"
  ) {
    throw new Error(
      "Trello Power-Up client is unavailable."
    );
  }

  const t = window.TrelloPowerUp.iframe({
    appKey: APP_KEY,
    appName: APP_NAME,
  });

  const restApi = await t.getRestApi();

  return {
    t,
    restApi,
  };
}


/**
 * Authorize the current Trello member if necessary.
 *
 * This function is called after the user clicks
 * "Add to Card", so Trello is allowed to open its
 * consent popup.
 */
async function ensureAuthorized(restApi) {

  const authorized =
    await restApi.isAuthorized();

  if (authorized) {
    return;
  }

  await restApi.authorize({
    expiration: "never",
    scope: "read,write",
  });

  const authorizedAfter =
    await restApi.isAuthorized();

  if (!authorizedAfter) {
    throw new Error(NOT_AUTHORIZED);
  }
}


/**
 * Add a checklist template to the current Trello card.
 */
export async function applyTemplateToCard(
  originalT,
  template
) {

  if (
    !template ||
    !template.name ||
    !Array.isArray(template.items) ||
    !template.items.length
  ) {
    throw new Error(
      "Invalid checklist template."
    );
  }

  const {
    t,
    restApi,
  } = await getRestApi();


  /*
   * Make sure the member is authorized before
   * attempting any Trello REST API request.
   */
  await ensureAuthorized(restApi);


  /*
   * Get the current Trello card.
   */
  const card =
    await t.card("id");

  if (!card?.id) {
    throw new Error(
      "Could not find the current Trello card."
    );
  }


  /*
   * Create the checklist on the card.
   */
  const checklist =
    await restApi.post(
      `/cards/${card.id}/checklists`,
      {
        name: template.name,
      }
    );


  if (!checklist?.id) {
    throw new Error(
      "Trello did not return the new checklist."
    );
  }


  /*
   * Create every checklist item.
   */
  for (
    const item of template.items
  ) {

    const itemName =
      typeof item === "string"
        ? item.trim()
        : String(
            item?.name || ""
          ).trim();

    if (!itemName) {
      continue;
    }

    await restApi.post(
      `/checklists/${checklist.id}/checkItems`,
      {
        name: itemName,
      }
    );
  }


  return checklist;
}