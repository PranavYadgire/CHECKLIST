# Project structure

```text
ReusableChecklistLibrary/
├── public/
│   ├── authorized.html
│   ├── authorized.js
│   ├── icons/
│   │   └── icon.svg
│   └── manifest.json
├── src/
│   ├── auth/                 # Existing Trello authorization popup
│   ├── checklists/           # Checklist-library feature
│   │   ├── ChecklistLibrary.jsx
│   │   ├── checklistStorage.js
│   │   └── checklistTemplates.js
│   ├── components/           # Reusable UI components
│   │   ├── TemplateCard.jsx
│   │   └── TemplateEditor.jsx
│   ├── constants/
│   │   └── storageKeys.js
│   ├── hooks/
│   │   └── useChecklistTemplates.js
│   ├── lib/                  # Existing Trello auth/API helpers
│   ├── powerup/
│   │   └── main.js           # Trello capability registration
│   ├── services/
│   │   └── trelloChecklistService.js
│   ├── styles/
│   │   └── checklist-library.css
│   └── utils/
│       └── checklistValidation.js
├── auth.html
├── index.html
├── powerup.html
├── package.json
├── vite.config.js
└── .gitignore
```

## Data model
A template is `{ id, name, category, items, createdAt, updatedAt }`.
Each item is `{ id, name }`. V1 uses Trello Power-Up member storage, so templates
are available to the member across boards where the Power-Up is enabled.
