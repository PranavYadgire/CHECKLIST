// Trello checklist operations

export const NOT_AUTHORIZED =
  "NOT_AUTHORIZED";


export async function applyTemplateToCard(
  t,
  template
) {

  if (!t) {
    throw new Error(
      "Trello context is unavailable."
    );
  }


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
    "[Checklist Library] Getting Trello REST API..."
  );


  const api =
    await t.getRestApi();


  const authorized =
    await api.isAuthorized();


  console.log(
    "[Checklist Library] Authorized:",
    authorized
  );


  if (!authorized) {

    const error =
      new Error(
        NOT_AUTHORIZED
      );

    error.code =
      NOT_AUTHORIZED;

    throw error;
  }


  const card =
    await t.card("id");


  if (!card || !card.id) {
    throw new Error(
      "Could not find the current Trello card."
    );
  }


  console.log(
    "[Checklist Library] Card:",
    card.id
  );


  const checklist =
    await api.post(
      `/cards/${card.id}/checklists`,
      {
        name: template.name
      }
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


    await api.post(
      `/checklists/${checklist.id}/checkItems`,
      {
        name: itemName
      }
    );


    console.log(
      "[Checklist Library] Added item:",
      itemName
    );
  }


  return checklist;
}