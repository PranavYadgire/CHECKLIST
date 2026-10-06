import React from "react";

export default function TemplateCard({ template, onApply, onEdit, onDelete }) {
  return (
    <article className="template-card">
      <div className="template-card__content">
        <h3>{template.name}</h3>
        <span className="template-card__category">{template.category}</span>
        <p>{template.items.length} checklist items</p>
      </div>
      <div className="template-card__actions">
        {onApply && <button onClick={() => onApply(template)}>Apply to card</button>}
        <button onClick={() => onEdit(template)}>Edit</button>
        <button className="button-danger" onClick={() => onDelete(template.id)}>Delete</button>
      </div>
    </article>
  );
}
