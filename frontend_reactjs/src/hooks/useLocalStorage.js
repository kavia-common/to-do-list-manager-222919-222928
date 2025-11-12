import { useEffect, useRef, useState } from 'react';

/**
 * Small, safe localStorage hook with JSON serialization and error handling.
 * Avoids crashes if storage is unavailable or data is malformed.
 *
 * PUBLIC_INTERFACE
 * @param {string} key - Storage key to read/write
 * @param {any} initialValue - Initial value if not present in storage
 * @returns {[any, Function, Function]} [value, setValue, reset]
 */
export function useLocalStorage(key, initialValue) {
  const isFirstRun = useRef(true);
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null || item === undefined) return initialValue;
      return JSON.parse(item);
    } catch {
      return initialValue;
    }
  });

  // Persist value changes
  useEffect(() => {
    // avoid writing initial value immediately if same as stored
    if (isFirstRun.current) {
      isFirstRun.current = false;
      try {
        const stored = window.localStorage.getItem(key);
        const parsed = stored ? JSON.parse(stored) : undefined;
        if (parsed === undefined && initialValue !== undefined) {
          window.localStorage.setItem(key, JSON.stringify(initialValue));
        }
      } catch {
        // ignore storage failures
      }
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage failures
    }
  }, [key, value, initialValue]);

  // PUBLIC_INTERFACE
  const reset = () => setValue(initialValue);

  return [value, setValue, reset];
}
