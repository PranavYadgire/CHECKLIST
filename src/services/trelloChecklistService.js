// Trello card checklist operations. Uses the existing authenticated REST helper.
import { apiFetch } from "../lib/trelloApi.js";

export async function applyTemplateToCard(t, template) {
  const card = await t.card("id");
  const checklist = await apiFetch(t, `/cards/${card.id}/checklists`, {
    method: "POST",
    params: { name: template.name },
  });

  for (const item of template.items) {
    await apiFetch(t, `/checklists/${checklist.id}/checkItems`, {
      method: "POST",
      params: { name: item.name },
    });
  }
  return checklist;
}
