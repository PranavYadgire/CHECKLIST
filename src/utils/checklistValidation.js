export function validateTemplateName(name) {
  if (!name || !name.trim()) return "Enter a template name.";
  if (name.trim().length > 80) return "Use 80 characters or fewer.";
  return "";
}

export function validateItems(items) {
  if (!Array.isArray(items) || items.filter((item) => String(item).trim()).length === 0) {
    return "Add at least one checklist item.";
  }
  return "";
}
