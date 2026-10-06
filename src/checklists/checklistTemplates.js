export function createTemplate({ name, category = "General", items = [] }) {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    category: category.trim() || "General",
    items: items.map((item) => ({
      id: crypto.randomUUID(),
      name: typeof item === "string" ? item.trim() : item.name.trim(),
    })).filter((item) => item.name),
    createdAt: now,
    updatedAt: now,
  };
}
