import { TEMPLATE_STORAGE_KEY } from "../constants/storageKeys.js";

export async function getTemplates(t) {
  return (await t.get("member", "private", TEMPLATE_STORAGE_KEY)) || [];
}

export async function saveTemplates(t, templates) {
  await t.set("member", "private", TEMPLATE_STORAGE_KEY, templates);
  return templates;
}
