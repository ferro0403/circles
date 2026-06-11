"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";

export const STATUS_STORAGE_KEY = "circle.status.v1";
export const CHECK_IN_STORAGE_KEY = "circle.checkIn.v1";
export const GROUP_AVAILABILITY_STORAGE_KEY = "circle.groupAvailability.v1";
export const POLLS_STORAGE_KEY = "circle.polls.v1";
export const POLL_VOTES_STORAGE_KEY = "circle.pollVotes.v1";
export const NOTIFICATIONS_STORAGE_KEY = "circle.notifications.v1";

export type CheckIn = {
  mode: "place" | "free";
  selectedPlace: string;
  freePlace: string;
  mapsUrl: string;
  visibility: string;
  duration: string;
  active: boolean;
  updatedAt?: string;
  expiresAt?: string;
};

export const initialCheckIn: CheckIn = {
  mode: "place",
  selectedPlace: "cinema-moderno",
  freePlace: "",
  mapsUrl: "",
  visibility: "Amici",
  duration: "2h",
  active: false,
};

const checkInDurationMs: Record<string, number> = {
  "1h": 60 * 60_000,
  "2h": 2 * 60 * 60_000,
  "4h": 4 * 60 * 60_000,
  Domani: 24 * 60 * 60_000,
};

export function getCheckInExpiry(checkIn: CheckIn) {
  if (checkIn.expiresAt) return new Date(checkIn.expiresAt).getTime();
  if (!checkIn.updatedAt) return 0;
  return new Date(checkIn.updatedAt).getTime() + (checkInDurationMs[checkIn.duration] ?? 0);
}

export function isCheckInActive(checkIn: CheckIn, now = Date.now()) {
  return checkIn.active && getCheckInExpiry(checkIn) > now;
}

export function getCheckInRemaining(checkIn: CheckIn, now = Date.now()) {
  const remaining = Math.max(0, getCheckInExpiry(checkIn) - now);
  if (remaining < 60_000) return "meno di un minuto";
  const totalMinutes = Math.ceil(remaining / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!hours) return `${minutes} min`;
  if (!minutes) return `${hours} ${hours === 1 ? "ora" : "ore"}`;
  return `${hours}h ${minutes}min`;
}


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
