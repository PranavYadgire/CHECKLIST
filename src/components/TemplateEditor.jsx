import React, { useState } from "react";

export default function TemplateEditor({ initialTemplate, onSave, onCancel }) {
  const [name, setName] = useState(initialTemplate?.name || "");
  const [category, setCategory] = useState(initialTemplate?.category || "General");
  const [itemsText, setItemsText] = useState((initialTemplate?.items || []).map((x) => x.name).join("\n"));

  function submit(event) {
    event.preventDefault();
    onSave({
      ...initialTemplate,
      name: name.trim(),
      category: category.trim() || "General",
      items: itemsText.split("\n").map((x) => x.trim()).filter(Boolean)
        .map((item, index) => ({ id: initialTemplate?.items?.[index]?.id || crypto.randomUUID(), name: item })),
      updatedAt: new Date().toISOString(),
    });
  }

  return (
    <form className="template-editor" onSubmit={submit}>
      <label>Template name<input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} /></label>
      <label>Category<input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. QA, Launch, Hiring" /></label>
      <label>Checklist items <span>(one per line)</span><textarea value={itemsText} onChange={(e) => setItemsText(e.target.value)} rows={7} required /></label>
      <div className="template-editor__actions">
        <button type="submit">Save template</button>
        <button type="button" className="button-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
