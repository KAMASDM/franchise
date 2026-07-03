import { useState, useCallback } from "react";
import logger from "../utils/logger";

const STORAGE_KEY = "saved_searches_v1";
const MAX_SAVED = 10;

const readStore = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

/**
 * Saved marketplace searches, persisted in localStorage.
 * A saved search is just a name + the /brands query string, which the
 * URL-synced marketplace can restore verbatim.
 */
export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState(readStore);

  const persist = useCallback((next) => {
    setSavedSearches(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      logger.error("Failed to persist saved searches:", error);
    }
  }, []);

  const saveSearch = useCallback(
    (name, queryString) => {
      const entry = {
        id: `${Date.now()}`,
        name: name.trim(),
        queryString,
        createdAt: new Date().toISOString(),
      };
      // Replace an existing search with the same name, newest first, capped
      const next = [entry, ...savedSearches.filter((s) => s.name !== entry.name)].slice(0, MAX_SAVED);
      persist(next);
      return entry;
    },
    [savedSearches, persist]
  );

  const removeSearch = useCallback(
    (id) => {
      persist(savedSearches.filter((s) => s.id !== id));
    },
    [savedSearches, persist]
  );

  return { savedSearches, saveSearch, removeSearch };
};

export default useSavedSearches;
