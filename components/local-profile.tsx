"use client";

import { createAvatar } from "@dicebear/core";
import * as personas from "@dicebear/personas";
import { useCallback, useEffect, useMemo, useState } from "react";

export const AVATAR_STORAGE_KEY = "circle.avatar.v1";
const AVATAR_EVENT = "circle-avatar-updated";

export type PersonaHair = "bald" | "beanie" | "bobBangs" | "bobCut" | "bunUndercut" | "buzzcut" | "curly" | "curlyBun" | "curlyHighTop" | "extraLong" | "fade" | "long" | "mohawk" | "pigtails" | "shortCombover" | "sideShave" | "straightBun";
export type PersonaEyes = "glasses" | "happy" | "open" | "sleep" | "sunglasses" | "wink";
export type PersonaMouth = "bigSmile" | "frown" | "lips" | "pacifier" | "smile" | "smirk" | "surprise";
export type PersonaBody = "checkered" | "rounded" | "small" | "squared";

export type DiceBearAvatarConfig = {
  style: "personas";
  seed: string;
  backgroundColor: string;
  skinColor: string;
  hair: PersonaHair;
  hairColor: string;
  eyes: PersonaEyes;
  mouth: PersonaMouth;
  body: PersonaBody;
  clothingColor: string;
  flip: boolean;
  scale: number;
  facialHair: boolean;
  svg: string;
};

export const defaultAvatarConfig: DiceBearAvatarConfig = {
  style: "personas",
  seed: "Luca Bianchi",
  backgroundColor: "5b21b6",
  skinColor: "e5a07e",
  hair: "curly",
  hairColor: "362c47",
  eyes: "happy",
  mouth: "smile",
  body: "rounded",
  clothingColor: "456dff",
  flip: false,
  scale: 100,
  facialHair: false,
  svg: "",
};

export function generateAvatarSvg(config: Omit<DiceBearAvatarConfig, "svg"> | DiceBearAvatarConfig) {
  return createAvatar(personas, {
    seed: config.seed.trim() || defaultAvatarConfig.seed,
    backgroundColor: [config.backgroundColor],
    skinColor: [config.skinColor],
    hair: [config.hair],
    hairColor: [config.hairColor],
    eyes: [config.eyes],
    mouth: [config.mouth],
    body: [config.body],
    clothingColor: [config.clothingColor],
    flip: config.flip,
    scale: config.scale,
    radius: 18,
    facialHairProbability: config.facialHair ? 100 : 0,
  }).toString();
}

function completeConfig(value: Partial<DiceBearAvatarConfig> | null): DiceBearAvatarConfig {
  const config = value?.seed ? { ...defaultAvatarConfig, ...value, style: "personas" as const } : defaultAvatarConfig;
  return { ...config, svg: generateAvatarSvg(config) };
}

function readAvatar(): DiceBearAvatarConfig {
  try {
    const stored = window.localStorage.getItem(AVATAR_STORAGE_KEY);
    return stored ? completeConfig(JSON.parse(stored) as Partial<DiceBearAvatarConfig>) : completeConfig(defaultAvatarConfig);
  } catch {
    return completeConfig(defaultAvatarConfig);
  }
}

export function useSavedAvatar() {
  const [avatar, setAvatar] = useState<DiceBearAvatarConfig>(() => completeConfig(defaultAvatarConfig));
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

  const saveAvatar = useCallback((next: Omit<DiceBearAvatarConfig, "svg"> | DiceBearAvatarConfig) => {
    const saved = { ...next, style: "personas" as const, svg: generateAvatarSvg(next) };
    window.localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(saved));
    setAvatar(saved);
    window.dispatchEvent(new Event(AVATAR_EVENT));
    return saved;
  }, []);

  return { avatar, hydrated, saveAvatar };
}

export function DiceBearAvatar({ config, className = "h-full w-full" }: { config: DiceBearAvatarConfig; className?: string }) {
  const svg = useMemo(() => generateAvatarSvg(config), [config]);
  return <div className={`${className} [&>svg]:h-full [&>svg]:w-full`} role="img" aria-label="Avatar personale DiceBear" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export function SavedAvatar({ className }: { initials?: string; className: string; tone?: string }) {
  const { avatar } = useSavedAvatar();
  return <div className={`${className} shrink-0 overflow-hidden rounded-full border border-white/10`}><DiceBearAvatar config={avatar} /></div>;
}
