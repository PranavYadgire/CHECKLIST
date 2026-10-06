import { useCallback, useEffect, useState } from "react";
import { getTemplates, saveTemplates } from "../checklists/checklistStorage.js";

export function useChecklistTemplates(t) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setTemplates(await getTemplates(t));
    } catch (err) {
      setError(err.message || "Could not load templates.");
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { refresh(); }, [refresh]);

  const persist = useCallback(async (next) => {
    setError("");
    try {
      await saveTemplates(t, next);
      setTemplates(next);
    } catch (err) {
      setError(err.message || "Could not save templates.");
      throw err;
    }
  }, [t]);

  return { templates, loading, error, refresh, persist };
}
