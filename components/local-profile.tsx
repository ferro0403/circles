"use client";

import { useCallback, useEffect, useState } from "react";
import { Avatar } from "@/components/ui";

export const AVATAR_STORAGE_KEY = "circle.avatar.v1";
const LEGACY_STORAGE_KEY = "circle-avatar";
const AVATAR_EVENT = "circle-avatar-updated";

export type AvatarOptions = {
  type: "masculine" | "feminine" | "neutral";
  skin: string;
  hair: "crop" | "waves" | "buzz" | "bun" | "curls" | "bob" | "quiff" | "afro" | "long" | "mohawk";
  hairColor: string;
  eyes: "round" | "happy" | "focused" | "sparkle" | "wide" | "sleepy" | "wink" | "lashes";
  outfit: "hoodie" | "tee" | "jacket" | "sweater" | "shirt" | "blazer" | "sport" | "dress" | "overalls" | "turtleneck";
  outfitColor: string;
  expression: "smile" | "calm" | "grin" | "open" | "surprised" | "smirk" | "kiss" | "tongue";
  backgroundColor: string;
};

export const defaultAvatar: AvatarOptions = {
  type: "neutral",
  skin: "#dca47d",
  hair: "waves",
  hairColor: "#33223d",
  eyes: "happy",
  outfit: "hoodie",
  outfitColor: "#7c3aed",
  expression: "smile",
  backgroundColor: "#5b21b6",
};

function normalizeAvatar(value: Partial<AvatarOptions> | null): AvatarOptions | null {
  return value ? { ...defaultAvatar, ...value } : null;
}

function readAvatar(): AvatarOptions | null {
  try {
    const stored = window.localStorage.getItem(AVATAR_STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!stored) return null;
    const avatar = normalizeAvatar(JSON.parse(stored) as Partial<AvatarOptions>);
    if (avatar && !window.localStorage.getItem(AVATAR_STORAGE_KEY)) window.localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(avatar));
    return avatar;
  } catch {
    return null;
  }
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
    return () => { window.removeEventListener(AVATAR_EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);

  const saveAvatar = useCallback((next: AvatarOptions) => {
    window.localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(next));
    setAvatar(next);
    window.dispatchEvent(new Event(AVATAR_EVENT));
  }, []);

  return { avatar, hydrated, saveAvatar };
}

function Hair({ options }: { options: AvatarOptions }) {
  const color = options.hairColor;
  switch (options.hair) {
    case "crop": return <path d="M52 79q2-54 48-54t48 54q-18-22-48-18T52 79Z" fill={color} />;
    case "waves": return <path d="M49 84q-4-50 29-59 14-16 31 0 43 7 42 61-14-21-29-18-13-18-27-3-20-13-46 19Z" fill={color} />;
    case "buzz": return <path d="M57 64q9-38 43-38t43 38q-42-14-86 0Z" fill={color} />;
    case "bun": return <><circle cx="104" cy="22" r="24" fill={color} /><path d="M53 79q2-53 47-53t47 53q-19-22-47-18T53 79Z" fill={color} /></>;
    case "curls": return <g fill={color}><circle cx="61" cy="51" r="22" /><circle cx="82" cy="37" r="23" /><circle cx="105" cy="36" r="24" /><circle cx="129" cy="43" r="23" /><circle cx="143" cy="64" r="20" /><path d="M49 83q14-28 51-25t51 25q-24-17-51-14T49 83Z" /></g>;
    case "bob": return <path d="M49 88q-3-64 51-64t51 64v31l-18-10V68q-32-18-66 0v41l-18 10Z" fill={color} />;
    case "quiff": return <path d="M54 79q2-35 25-45 2-26 31-25-5 13 11 16 26 11 25 54-20-20-47-17T54 79Z" fill={color} />;
    case "afro": return <g fill={color}><circle cx="100" cy="48" r="48" /><circle cx="58" cy="70" r="29" /><circle cx="142" cy="70" r="29" /></g>;
    case "long": return <path d="M46 91q-4-68 54-68t54 68l-8 65-24-12 9-76q-31-20-62 0l9 76-24 12Z" fill={color} />;
    case "mohawk": return <><path d="M87 51Q90 1 104 0q18 16 13 52Z" fill={color} /><path d="M57 73q10-37 43-37t43 37q-42-14-86 0Z" fill={color} /></>;
  }
}

function Eyes({ options }: { options: AvatarOptions }) {
  const line = { fill: "none", stroke: "#171119", strokeWidth: 4, strokeLinecap: "round" as const };
  switch (options.eyes) {
    case "round": return <><circle cx="79" cy="92" r="5" fill="#171119" /><circle cx="121" cy="92" r="5" fill="#171119" /><circle cx="77.5" cy="90.5" r="1.5" fill="white" /><circle cx="119.5" cy="90.5" r="1.5" fill="white" /></>;
    case "happy": return <><path d="M72 93q7-8 14 0" {...line} /><path d="M114 93q7-8 14 0" {...line} /></>;
    case "focused": return <><path d="m72 89 14 3" {...line} /><path d="m114 92 14-3" {...line} /></>;
    case "sparkle": return <><path d="m79 84 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#171119" /><path d="m121 84 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#171119" /></>;
    case "wide": return <><ellipse cx="79" cy="92" rx="6" ry="8" fill="white" stroke="#171119" strokeWidth="3" /><ellipse cx="121" cy="92" rx="6" ry="8" fill="white" stroke="#171119" strokeWidth="3" /><circle cx="79" cy="94" r="3" /><circle cx="121" cy="94" r="3" /></>;
    case "sleepy": return <><path d="M72 91q7 4 14 0" {...line} /><path d="M114 91q7 4 14 0" {...line} /></>;
    case "wink": return <><path d="M72 93q7-8 14 0" {...line} /><circle cx="121" cy="92" r="5" fill="#171119" /></>;
    case "lashes": return <><path d="M71 93q8-9 16 0M113 93q8-9 16 0M73 87l-3-4M85 87l3-4M115 87l-3-4M127 87l3-4" {...line} strokeWidth="3" /></>;
  }
}

function Mouth({ expression }: { expression: AvatarOptions["expression"] }) {
  switch (expression) {
    case "smile": return <path d="M87 112q13 14 26 0" fill="none" stroke="#8f3f58" strokeWidth="4" strokeLinecap="round" />;
    case "calm": return <path d="M92 115h16" stroke="#8f3f58" strokeWidth="4" strokeLinecap="round" />;
    case "grin": return <path d="M85 110q15 20 30 0Z" fill="white" stroke="#8f3f58" strokeWidth="3" />;
    case "open": return <ellipse cx="100" cy="116" rx="10" ry="8" fill="#7d3344" />;
    case "surprised": return <circle cx="100" cy="116" r="7" fill="#7d3344" />;
    case "smirk": return <path d="M91 116q13 3 20-5" fill="none" stroke="#8f3f58" strokeWidth="4" strokeLinecap="round" />;
    case "kiss": return <path d="m94 114 6-3 6 3-6 4Z" fill="#a74661" />;
    case "tongue": return <><path d="M86 110q14 18 28 0Z" fill="#7d3344" /><path d="M94 119q6 7 12 0" fill="#fb7185" /></>;
  }
}

function Outfit({ options }: { options: AvatarOptions }) {
  const color = options.outfitColor;
  const base = <path d="M27 220q7-76 73-76t73 76" fill={color} />;
  switch (options.outfit) {
    case "hoodie": return <>{base}<path d="M61 159q39 42 78 0M100 184v36" fill="none" stroke="white" strokeWidth="5" opacity=".35" /></>;
    case "tee": return <>{base}<path d="M78 151q22 18 44 0" fill="none" stroke="white" strokeWidth="5" opacity=".25" /></>;
    case "jacket": return <>{base}<path d="m60 158 40 34 40-34M100 192v28" fill="none" stroke="#171119" strokeWidth="6" opacity=".55" /><path d="M90 154h20v31H90z" fill="white" opacity=".8" /></>;
    case "sweater": return <>{base}<path d="M43 184h114M39 204h122" stroke="white" strokeWidth="7" opacity=".18" /></>;
    case "shirt": return <>{base}<path d="m80 151 20 19 20-19M100 170v50" fill="none" stroke="white" strokeWidth="5" opacity=".7" /><circle cx="100" cy="185" r="2" fill="white" /><circle cx="100" cy="199" r="2" fill="white" /></>;
    case "blazer": return <>{base}<path d="m68 151 32 42 32-42M100 193v27" fill="none" stroke="#111827" strokeWidth="7" opacity=".65" /><path d="M91 154h18v36H91z" fill="white" /></>;
    case "sport": return <>{base}<path d="M55 168h90M100 148v72" stroke="white" strokeWidth="6" opacity=".45" /><circle cx="100" cy="177" r="10" fill="white" opacity=".35" /></>;
    case "dress": return <>{base}<path d="M69 151q31 26 62 0l13 69H56Z" fill={color} /><path d="M80 151q20 21 40 0" fill="none" stroke="white" strokeWidth="5" opacity=".45" /></>;
    case "overalls": return <>{base}<path d="M68 160h64v60H68zM72 151l12 26M128 151l-12 26" fill="#334155" stroke="#94a3b8" strokeWidth="5" /><circle cx="82" cy="177" r="3" fill="#fbbf24" /><circle cx="118" cy="177" r="3" fill="#fbbf24" /></>;
    case "turtleneck": return <>{base}<path d="M78 145h44v30H78z" fill={color} stroke="white" strokeOpacity=".2" strokeWidth="4" /></>;
  }
}

export function AvatarArt({ options, className = "h-full w-full" }: { options: AvatarOptions; className?: string }) {
  const faceRx = options.type === "masculine" ? 47 : options.type === "feminine" ? 44 : 46;
  const faceRy = options.type === "feminine" ? 59 : 56;
  return <svg viewBox="0 0 200 220" className={className} role="img" aria-label="Avatar personale cartoon"><defs><linearGradient id={`avatar-bg-${options.backgroundColor.replace("#", "")}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={options.backgroundColor} /><stop offset="1" stopColor="#18181b" /></linearGradient></defs><rect width="200" height="220" rx="42" fill={`url(#avatar-bg-${options.backgroundColor.replace("#", "")})`} /><circle cx="35" cy="36" r="44" fill="white" opacity=".08" /><circle cx="173" cy="155" r="58" fill="black" opacity=".1" /><Outfit options={options} /><path d="M81 141h38v30q-19 16-38 0Z" fill={options.skin} /><ellipse cx="100" cy="92" rx={faceRx} ry={faceRy} fill={options.skin} /><circle cx="58" cy="103" r="8" fill={options.skin} /><circle cx="142" cy="103" r="8" fill={options.skin} /><Hair options={options} /><Eyes options={options} /><path d="M100 96v11" stroke="#8b5c48" strokeWidth="3" strokeLinecap="round" opacity=".5" /><Mouth expression={options.expression} /><circle cx="70" cy="109" r="7" fill="#fb7185" opacity=".13" /><circle cx="130" cy="109" r="7" fill="#fb7185" opacity=".13" /></svg>;
}

export function SavedAvatar({ initials, className, tone }: { initials: string; className: string; tone: string }) {
  const { avatar, hydrated } = useSavedAvatar();
  if (!hydrated || !avatar) return <Avatar initials={initials} className={className} tone={tone} />;
  return <div className={`${className} shrink-0 overflow-hidden rounded-full border border-white/10`}><AvatarArt options={avatar} /></div>;
}
