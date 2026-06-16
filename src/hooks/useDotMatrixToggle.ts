import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "dot-matrix-animation";

export function useDotMatrixToggle(): [boolean, () => void] {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [enabled]);

  const toggle = useCallback(() => setEnabled((prev) => !prev), []);

  return [enabled, toggle];
}
