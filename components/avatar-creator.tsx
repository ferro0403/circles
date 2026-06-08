"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, CheckIcon, SparklesIcon } from "@/components/icons";
import { AvatarArt, defaultAvatar, useSavedAvatar } from "@/components/local-profile";
import type { AvatarOptions } from "@/components/local-profile";

const optionSets = {
  type: ["masculine", "feminine", "neutral"],
  hair: ["crop", "waves", "buzz", "bun", "curls", "bob", "quiff", "afro", "long", "mohawk"],
  eyes: ["round", "happy", "focused", "sparkle", "wide", "sleepy", "wink", "lashes"],
  outfit: ["hoodie", "tee", "jacket", "sweater", "shirt", "blazer", "sport", "dress", "overalls", "turtleneck"],
  expression: ["smile", "calm", "grin", "open", "surprised", "smirk", "kiss", "tongue"],
} as const;

const labels: Record<string, string> = {
  masculine: "Maschile", feminine: "Femminile", neutral: "Neutro",
  crop: "Corti", waves: "Mossi", buzz: "Rasati", bun: "Chignon", curls: "Ricci", bob: "Caschetto", quiff: "Ciuffo", afro: "Afro", long: "Lunghi", mohawk: "Cresta",
  round: "Tondi", happy: "Felici", focused: "Decisi", sparkle: "Stelle", wide: "Grandi", sleepy: "Assonnati", wink: "Occhiolino", lashes: "Ciglia",
  hoodie: "Felpa", tee: "T-shirt", jacket: "Giacca", sweater: "Maglione", shirt: "Camicia", blazer: "Blazer", sport: "Sport", dress: "Abito", overalls: "Salopette", turtleneck: "Dolcevita",
  smile: "Sorriso", calm: "Serena", grin: "Risata", open: "Allegra", surprised: "Sorpresa", smirk: "Sicura", kiss: "Bacio", tongue: "Scherzosa",
};

const colors = {
  skin: ["#f8d9bf", "#efc29b", "#dca47d", "#ad7251", "#754631", "#3f281f"],
  hairColor: ["#17131a", "#3f2a24", "#6b3f27", "#a16207", "#d6a756", "#b91c1c", "#6d28d9", "#db2777"],
  outfitColor: ["#7c3aed", "#4c1d95", "#2563eb", "#0891b2", "#059669", "#e11d48", "#ea580c", "#27272a"],
  backgroundColor: ["#5b21b6", "#7c3aed", "#2563eb", "#0891b2", "#059669", "#be185d", "#c2410c", "#3f3f46"],
};

function ChoiceRow<K extends keyof typeof optionSets>({ title, name, value, onChange }: { title: string; name: K; value: AvatarOptions[K]; onChange: (value: AvatarOptions[K]) => void }) {
  return <fieldset><legend className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{title}</legend><div className="hide-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">{(optionSets[name] as readonly string[]).map((option) => <button type="button" key={option} onClick={() => onChange(option as AvatarOptions[K])} className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition ${value === option ? "border-violet bg-violet text-white shadow-glow" : "border-white/10 bg-white/[0.04] text-zinc-400"}`}>{labels[option]}</button>)}</div></fieldset>;
}

function ColorRow({ title, palette, value, onChange }: { title: string; palette: readonly string[]; value: string; onChange: (value: string) => void }) {
  return <fieldset><legend className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{title}</legend><div className="mt-3 flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-panel p-3">{palette.map((color) => <button type="button" key={color} onClick={() => onChange(color)} className={`grid size-11 place-items-center rounded-full transition ${value === color ? "ring-2 ring-violet ring-offset-4 ring-offset-panel" : ""}`} style={{ backgroundColor: color }} aria-label={`${title}: ${color}`}>{value === color && <CheckIcon className="size-5 text-white drop-shadow" />}</button>)}</div></fieldset>;
}

export function AvatarCreator() {
  const { avatar: savedAvatar, hydrated, saveAvatar } = useSavedAvatar();
  const [options, setOptions] = useState<AvatarOptions>(defaultAvatar);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (hydrated) setOptions(savedAvatar ?? defaultAvatar);
  }, [hydrated, savedAvatar]);

  function update<K extends keyof AvatarOptions>(key: K, value: AvatarOptions[K]) {
    setOptions((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function save() {
    saveAvatar(options);
    setSaved(true);
  }

  return <div className="pb-8"><header className="flex items-center justify-between py-4"><Link href="/profilo" className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04]" aria-label="Torna al profilo"><ArrowLeftIcon className="size-5" /></Link><div className="text-center"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet">Il tuo stile</p><h1 className="text-lg font-bold">Crea avatar</h1></div><span className="size-10" /></header>
    <section className="relative mx-auto mt-3 aspect-square max-w-[310px] overflow-hidden rounded-[2.5rem] border border-violet/25 bg-gradient-to-br from-violet/[0.13] via-panel to-black p-5 shadow-glow"><div className="absolute left-5 top-5 z-10 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] font-bold text-zinc-300 backdrop-blur"><SparklesIcon className="size-3.5 text-violet" />ANTEPRIMA LIVE</div><AvatarArt options={options} className="h-full w-full rounded-[2rem]" /></section>

    <div className="mt-8 space-y-7"><ChoiceRow title="Tipo" name="type" value={options.type} onChange={(value) => update("type", value)} /><ColorRow title="Colore pelle" palette={colors.skin} value={options.skin} onChange={(value) => update("skin", value)} /><ChoiceRow title="Capelli" name="hair" value={options.hair} onChange={(value) => update("hair", value)} /><ColorRow title="Colore capelli" palette={colors.hairColor} value={options.hairColor} onChange={(value) => update("hairColor", value)} /><ChoiceRow title="Occhi" name="eyes" value={options.eyes} onChange={(value) => update("eyes", value)} /><ChoiceRow title="Espressione" name="expression" value={options.expression} onChange={(value) => update("expression", value)} /><ChoiceRow title="Outfit" name="outfit" value={options.outfit} onChange={(value) => update("outfit", value)} /><ColorRow title="Colore outfit" palette={colors.outfitColor} value={options.outfitColor} onChange={(value) => update("outfitColor", value)} /><ColorRow title="Sfondo avatar" palette={colors.backgroundColor} value={options.backgroundColor} onChange={(value) => update("backgroundColor", value)} /></div>

    <button type="button" onClick={save} className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold transition ${saved ? "bg-white text-black" : "bg-violet text-white shadow-glow"}`}>{saved ? <><CheckIcon className="size-5" />Avatar salvato</> : "Salva avatar"}</button>
    {saved && <p role="status" className="mt-3 text-center text-sm font-semibold text-violet">Le modifiche sono state salvate sul dispositivo.</p>}
    <Link href="/profilo" className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] py-4 text-sm font-semibold text-zinc-300"><ArrowLeftIcon className="size-4" />Torna al profilo</Link>
  </div>;
}
