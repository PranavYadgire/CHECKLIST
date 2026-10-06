// Trello checklist operations

import {
  APP_KEY,
  APP_NAME
} from "../lib/auth.js";

export const NOT_AUTHORIZED =
  "NOT_AUTHORIZED";


async function getTrelloApi(t) {

  if (!t) {
    throw new Error(
      "Trello context is unavailable."
    );
  }

  const restApi =
    await t.getRestApi();

  const authorized =
    await restApi.isAuthorized();

  if (!authorized) {

    throw new Error(
      NOT_AUTHORIZED
    );
  }

  const token =
    await restApi.getToken();

  if (!token) {

    throw new Error(
      NOT_AUTHORIZED
    );
  }

  return {
    restApi,
    token
  };
}


async function trelloRequest(
  method,
  path,
  params,
  token
) {

  const url =
    new URL(
      `https://api.trello.com/1${path}`
    );


  url.searchParams.set(
    "key",
    APP_KEY
  );


  url.searchParams.set(
    "token",
    token
  );


  if (params) {

    Object.entries(params)
      .forEach(
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

  }


  const response =
    await fetch(
      url.toString(),
      {
        method,

        headers: {
          "Accept":
            "application/json"
        }
      }
    );


  if (response.status === 401) {

    throw new Error(
      NOT_AUTHORIZED
    );
  }


  if (!response.ok) {

    let message =
      `Trello API error ${response.status}`;

    try {

      const data =
        await response.json();

      if (data?.message) {
        message +=
          `: ${data.message}`;
      }

    } catch (e) {
      // Ignore JSON parsing failure.
    }

    throw new Error(
      message
    );
  }


  return response.json();
}


export async function applyTemplateToCard(
  t,
  template
) {

  if (
    !template ||
    !template.name ||
    !Array.isArray(template.items) ||
    template.items.length === 0
  ) {

    throw new Error(
      "Invalid checklist template."
    );
  }


  console.log(
    "[Checklist Library] Starting checklist creation..."
  );


  const {
    token
  } =
    await getTrelloApi(t);


  const card =
    await t.card("id");


  if (
    !card ||
    !card.id
  ) {

    throw new Error(
      "Could not find the current Trello card."
    );
  }


  console.log(
    "[Checklist Library] Card ID:",
    card.id
  );


  /*
   * Create the checklist.
   */

  const checklist =
    await trelloRequest(
      "POST",
      `/cards/${card.id}/checklists`,
      {
        name:
          template.name
      },
      token
    );


  if (
    !checklist ||
    !checklist.id
  ) {

    throw new Error(
      "Trello did not return the created checklist."
    );
  }


  console.log(
    "[Checklist Library] Checklist created:",
    checklist.id
  );


  /*
   * Add each checklist item.
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


    await trelloRequest(
      "POST",
      `/checklists/${checklist.id}/checkItems`,
      {
        name:
          itemName
      },
      token
    );


    console.log(
      "[Checklist Library] Added item:",
      itemName
    );

  }


  console.log(
    "[Checklist Library] Checklist successfully added."
  );


  return checklist;
}