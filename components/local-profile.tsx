"use client";

import { useCallback, useEffect, useState } from "react";
import { Avatar } from "@/components/ui";

export const AVATAR_STORAGE_KEY = "circle.avatar.dicebear.v2";
const LEGACY_STORAGE_KEYS = ["circle.avatar.dicebear.v1", "circle.avatar.v1", "circle-avatar"];
const AVATAR_EVENT = "circle-avatar-updated";
const DICEBEAR_ENDPOINT = "https://api.dicebear.com/10.x/adventurer/svg";

export type AvatarOptions = {
  seed: string;
  skinColor: string;
  hair: string;
  hairColor: string;
  eyes: string;
  eyebrows: string;
  mouth: string;
  glasses: string | null;
  earrings: string | null;
  details: string | null;
  backgroundColor: string;
  scale: number;
  rotate: number;
};

export const defaultAvatar: AvatarOptions = {
  seed: "Circle",
  skinColor: "ecad80",
  hair: "short05",
  hairColor: "6a4e35",
  eyes: "variant04",
  eyebrows: "variant01",
  mouth: "variant10",
  glasses: null,
  earrings: null,
  details: null,
  backgroundColor: "7c3aed",
  scale: 1,
  rotate: 0,
};

function isDiceBearAvatar(value: unknown): value is Partial<AvatarOptions> & { glasses?: string | boolean | null } {
  return Boolean(value && typeof value === "object" && "seed" in value);
}

function normalizeAvatar(value: unknown): AvatarOptions | null {
  if (!isDiceBearAvatar(value)) return null;

  return {
    ...defaultAvatar,
    ...value,
    glasses: typeof value.glasses === "string" ? value.glasses : value.glasses ? "variant01" : null,
  };
}

function readAvatar(): AvatarOptions | null {
  try {
    const stored = window.localStorage.getItem(AVATAR_STORAGE_KEY);
    if (stored) return normalizeAvatar(JSON.parse(stored));

    for (const key of LEGACY_STORAGE_KEYS) {
      const legacy = window.localStorage.getItem(key);
      if (!legacy) continue;
      const avatar = normalizeAvatar(JSON.parse(legacy)) ?? defaultAvatar;
      window.localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(avatar));
      return avatar;
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
    eyebrowsVariant: options.eyebrows,
    mouthVariant: options.mouth,
    backgroundColor: options.backgroundColor,
    scale: String(options.scale),
    rotate: String(options.rotate),
    glassesProbability: options.glasses ? "100" : "0",
    earringsProbability: options.earrings ? "100" : "0",
    detailsProbability: options.details ? "100" : "0",
    borderRadius: "18",
  });

  if (options.glasses) params.set("glassesVariant", options.glasses);
  if (options.earrings) params.set("earringsVariant", options.earrings);
  if (options.details) params.set("detailsVariant", options.details);

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
