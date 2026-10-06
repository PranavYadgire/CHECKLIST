import {
  APP_KEY,
  getToken,
  clearToken,
} from "./auth.js";

const NOT_AUTHORIZED = "NOT_AUTHORIZED";

/**
 * Make an authenticated Trello API request.
 */
async function trelloRequest(
  t,
  path,
  {
    method = "GET",
    params = {},
  } = {}
) {
  const token = await getToken(t);

  if (!token) {
    throw new Error(NOT_AUTHORIZED);
  }

  const url = new URL(
    `https://api.trello.com/1${path}`
  );

  url.searchParams.set("key", APP_KEY);
  url.searchParams.set("token", token);

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null
      ) {
        url.searchParams.set(
          key,
          String(value)
        );
      }
    }
  );

  const response = await fetch(
    url.toString(),
    {
      method,
    }
  );

  if (response.status === 401) {
    await clearToken(t);

    throw new Error(
      NOT_AUTHORIZED
    );
  }

  if (!response.ok) {
    const errorText =
      await response
        .text()
        .catch(() => "");

    throw new Error(
      `Trello API error ${response.status}: ${
        errorText ||
        response.statusText
      }`
    );
  }

  return response.json();
}


/**
 * Get the current Trello card ID.
 */
export async function getCurrentCardId(t) {
  const card = await t.card("id");

  if (!card || !card.id) {
    throw new Error(
      "Unable to determine the current Trello card."
    );
  }

  return card.id;
}


/**
 * Create a real checklist on the current card.
 */
export async function createChecklist(
  t,
  cardId,
  checklistName
) {
  if (!cardId) {
    throw new Error(
      "Card ID is missing."
    );
  }

  if (!checklistName) {
    throw new Error(
      "Checklist name is missing."
    );
  }

  return trelloRequest(
    t,
    `/cards/${cardId}/checklists`,
    {
      method: "POST",
      params: {
        name: checklistName,
        pos: "bottom",
      },
    }
  );
}


/**
 * Create one checklist item.
 */
export async function createChecklistItem(
  t,
  checklistId,
  itemName,
  position
) {
  if (!checklistId) {
    throw new Error(
      "Checklist ID is missing."
    );
  }

  if (!itemName) {
    return null;
  }

  return trelloRequest(
    t,
    `/checklists/${checklistId}/checkItems`,
    {
      method: "POST",
      params: {
        name: itemName,
        pos:
          position !== undefined
            ? position
            : "bottom",
        checked: false,
      },
    }
  );
}


/**
 * Create a complete checklist from a template.
 *
 * This creates:
 * 1. One real Trello checklist
 * 2. Every item inside that checklist
 */
export async function addTemplateToCard(
  t,
  template
) {
  if (
    !template ||
    !template.name ||
    !Array.isArray(template.items)
  ) {
    throw new Error(
      "Invalid checklist template."
    );
  }

  const cardId =
    await getCurrentCardId(t);

  const checklist =
    await createChecklist(
      t,
      cardId,
      template.name
    );

  if (
    !checklist ||
    !checklist.id
  ) {
    throw new Error(
      "Trello did not return a checklist ID."
    );
  }

  const validItems =
    template.items
      .map(item =>
        String(item || "").trim()
      )
      .filter(Boolean);

  const createdItems = [];

  for (
    let i = 0;
    i < validItems.length;
    i++
  ) {
    const created =
      await createChecklistItem(
        t,
        checklist.id,
        validItems[i],
        i
      );

    createdItems.push(created);
  }

  return {
    cardId,
    checklist,
    items: createdItems,
  };
}