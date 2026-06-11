"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";

export const STATUS_STORAGE_KEY = "circle.status.v1";
export const CHECK_IN_STORAGE_KEY = "circle.checkIn.v1";
export const GROUP_AVAILABILITY_STORAGE_KEY = "circle.groupAvailability.v1";
export const POLLS_STORAGE_KEY = "circle.polls.v1";
export const POLL_VOTES_STORAGE_KEY = "circle.pollVotes.v1";


function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : (JSON.parse(value) as T);
  } catch {
    return fallback;
  }
}

export function useLocalStorageState<T>(key: string, fallback: T): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);
  const fallbackRef = useRef(fallback);

  useEffect(() => {
    const sync = () => setValue(readStoredValue(key, fallbackRef.current));
    sync();
    setHydrated(true);

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === key) sync();
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [key]);

  const persistValue = useCallback<Dispatch<SetStateAction<T>>>((nextValue) => {
    setValue((currentValue) => {
      const resolvedValue = typeof nextValue === "function"
        ? (nextValue as (current: T) => T)(currentValue)
        : nextValue;
      window.localStorage.setItem(key, JSON.stringify(resolvedValue));
      return resolvedValue;
    });
  }, [key]);

  return [value, persistValue, hydrated];
}
