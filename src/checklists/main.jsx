import React from "react";
import { createRoot } from "react-dom/client";
import ChecklistLibrary from "./ChecklistLibrary.jsx";

const t = window.TrelloPowerUp.iframe();
createRoot(document.getElementById("root")).render(<ChecklistLibrary t={t} />);
