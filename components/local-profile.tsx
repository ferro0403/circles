"use client";

import { useCallback, useEffect, useState } from "react";
import { Avatar } from "@/components/ui";

export const AVATAR_STORAGE_KEY = "circle.avatar.dicebear.v1";
const LEGACY_STORAGE_KEYS = ["circle.avatar.v1", "circle-avatar"];
const AVATAR_EVENT = "circle-avatar-updated";
const DICEBEAR_ENDPOINT = "https://api.dicebear.com/10.x/adventurer/svg";

export type AvatarOptions = {
  seed: string;
  skinColor: string;
  hair: string;
  hairColor: string;
  eyes: string;
  mouth: string;
  backgroundColor: string;
  glasses: boolean;
};

export const defaultAvatar: AvatarOptions = {
  seed: "Circle",
  skinColor: "ecad80",
  hair: "short05",
  hairColor: "6a4e35",
  eyes: "variant04",
  mouth: "variant10",
  backgroundColor: "7c3aed",
  glasses: false,
};

function isDiceBearAvatar(value: unknown): value is Partial<AvatarOptions> {
  return Boolean(value && typeof value === "object" && "seed" in value);
}

function normalizeAvatar(value: unknown): AvatarOptions | null {
  return isDiceBearAvatar(value) ? { ...defaultAvatar, ...value } : null;
}

function readAvatar(): AvatarOptions | null {
  try {
    const stored = window.localStorage.getItem(AVATAR_STORAGE_KEY);
    if (stored) return normalizeAvatar(JSON.parse(stored));

    const hadLegacyAvatar = LEGACY_STORAGE_KEYS.some((key) => window.localStorage.getItem(key));
    if (hadLegacyAvatar) {
      window.localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(defaultAvatar));
      return defaultAvatar;
    }

    return null;
  } catch {
    return null;
  }
}

export function getDiceBearUrl(options: AvatarOptions) {
  const params = new URLSearchParams({
    seed: options.seed.trim() || defaultAvatar.seed,
    skinColor: options.skinColor,
    hairVariant: options.hair,
    hairColor: options.hairColor,
    eyesVariant: options.eyes,
    mouthVariant: options.mouth,
    backgroundColor: options.backgroundColor,
    glassesProbability: options.glasses ? "100" : "0",
    borderRadius: "18",
  });

  return `${DICEBEAR_ENDPOINT}?${params.toString()}`;
}

export function useSavedAvatar() {
  const [avatar, setAvatar] = useState<AvatarOptions | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAvatar(readAvatar());
    setHydrated(true);
    const sync = () => setAvatar(readAvatar());
    window.addEventListener(AVATAR_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AVATAR_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const saveAvatar = useCallback((next: AvatarOptions) => {
    window.localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(next));
    setAvatar(next);
    window.dispatchEvent(new Event(AVATAR_EVENT));
  }, []);

  return { avatar, hydrated, saveAvatar };
}

export function AvatarArt({ options, className = "h-full w-full" }: { options: AvatarOptions; className?: string }) {
  return (
    // DiceBear is rendered remotely so the same saved options work in every avatar placement.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={getDiceBearUrl(options)} className={className} alt="Avatar personale creato con DiceBear" />
  );
}

export function SavedAvatar({ initials, className, tone }: { initials: string; className: string; tone: string }) {
  const { avatar, hydrated } = useSavedAvatar();
  if (!hydrated || !avatar) return <Avatar initials={initials} className={className} tone={tone} />;
  return <div className={`${className} shrink-0 overflow-hidden rounded-full border border-white/10`}><AvatarArt options={avatar} /></div>;
}
