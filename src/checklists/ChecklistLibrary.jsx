import React, { useState } from "react";
import { useChecklistTemplates } from "../hooks/useChecklistTemplates.js";
import { createTemplate } from "./checklistTemplates.js";
import { validateTemplateName, validateItems } from "../utils/checklistValidation.js";
import { applyTemplateToCard } from "../services/trelloChecklistService.js";
import TemplateCard from "../components/TemplateCard.jsx";
import TemplateEditor from "../components/TemplateEditor.jsx";
import "../styles/checklist-library.css";

export default function ChecklistLibrary({ t }) {
  const { templates, loading, error, persist } = useChecklistTemplates(t);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  async function save(data) {
    const nameError = validateTemplateName(data.name);
    const itemsError = validateItems(data.items.map((item) => item.name));
    if (nameError || itemsError) { setMessage(nameError || itemsError); return; }
    const nextTemplate = data.id ? data : createTemplate(data);
    const next = data.id
      ? templates.map((item) => item.id === data.id ? nextTemplate : item)
      : [...templates, nextTemplate];
    await persist(next);
    setEditing(null);
    setMessage("Template saved.");
  }

  async function remove(id) {
    await persist(templates.filter((item) => item.id !== id));
  }

  async function apply(template) {
    try {
      await applyTemplateToCard(t, template);
      setMessage(`Applied "${template.name}" to this card.`);
    } catch (err) {
      setMessage(err.message || "Could not apply template.");
    }
  }

  const visible = templates.filter((item) =>
    `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <main className="library"><p>Loading templates…</p></main>;

  return (
    <main className="library">
      <header className="library__header">
        <div><h1>Checklist Library</h1><p>Reusable checklists for your Trello cards.</p></div>
        {!editing && <button onClick={() => setEditing({})}>+ New template</button>}
      </header>
      {(error || message) && <p className="library__message" role="status">{error || message}</p>}
      {editing ? (
        <TemplateEditor initialTemplate={editing.id ? editing : null} onSave={save} onCancel={() => setEditing(null)} />
      ) : (
        <>
          <input className="library__search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates…" />
          {visible.length ? <section className="template-list">
            {visible.map((template) => <TemplateCard key={template.id} template={template}
              onApply={apply} onEdit={setEditing} onDelete={remove} />)}
          </section> : <section className="library__empty"><h2>No templates yet</h2><p>Create a reusable checklist to get started.</p></section>}
        </>
      )}
    </main>
  );
}
