# Reusable Checklist Library — Trello Power-Up

A Vite + React Trello Power-Up starter based on the supplied Insight project.
The existing authorization and Trello connector setup are retained; the new
feature folders below are ready for the checklist-library V1.

## Run locally
1. Install Node.js (LTS).
2. Run `npm install`.
3. Run `npm run dev`.
4. For Trello testing, serve the built files over HTTPS and configure the
   Power-Up iframe URLs in the Trello Power-Up admin page.

## Build
`npm run build` creates the deployable site in `dist/`.

## V1 scope
- Create a checklist template
- Organize templates
- Apply a template to a Trello card
- Edit and delete templates

Templates are stored per Trello member using Power-Up data (`t.set` / `t.get`).
The starter below defines the data and service boundaries; feature UI/API wiring
can be implemented incrementally.
