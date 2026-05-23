import { useCallback, useEffect, useState } from "react";
import { SAVED_JOBS_KEY } from "../utils/constants.js";

const readSaved = () => {
  try {
    const raw = localStorage.getItem(SAVED_JOBS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const useSavedJobs = () => {
  const [savedIds, setSavedIds] = useState(readSaved);

  useEffect(() => {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  const isSaved = useCallback((jobId) => savedIds.includes(jobId), [savedIds]);

  const toggleSave = useCallback((jobId) => {
    setSavedIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  }, []);

  return { savedIds, isSaved, toggleSave };
};

export default useSavedJobs;
