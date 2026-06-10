"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, CheckIcon, ExternalIcon, SparklesIcon } from "@/components/icons";
import { AvatarArt, defaultAvatar, useSavedAvatar } from "@/components/local-profile";
import type { AvatarOptions } from "@/components/local-profile";

const optionSets = {
  hair: ["short01", "short05", "short08", "short13", "short18", "long03", "long10", "long19"],
  eyes: ["variant01", "variant04", "variant07", "variant09", "variant12", "variant15", "variant20", "variant26"],
  mouth: ["variant01", "variant05", "variant10", "variant13", "variant18", "variant22", "variant25", "variant30"],
} as const;

const labels: Record<string, string> = {
  short01: "Pixie", short05: "Corti", short08: "Ciuffo", short13: "Mossi", short18: "Rasati", long03: "Caschetto", long10: "Ricci", long19: "Lunghi",
  variant01: "Classico", variant04: "Solare", variant07: "Dolce", variant09: "Deciso", variant12: "Allegro", variant15: "Sognante", variant20: "Vivace", variant26: "Sorpreso",
  variant05: "Sereno", variant10: "Sorriso", variant13: "Risata", variant18: "Timido", variant22: "Sicuro", variant25: "Wow", variant30: "Scherzoso",
};

const colors = {
  skinColor: ["f2d3b1", "ecad80", "d08b5b", "9e5622", "763900"],
  hairColor: ["0e0e0e", "6a4e35", "562306", "ac6511", "b9a05f", "afafaf", "592454", "ab2a18"],
  backgroundColor: ["5b21b6", "7c3aed", "2563eb", "0891b2", "059669", "be185d", "c2410c", "3f3f46"],
} as const;

const randomSeeds = ["Luna", "Milo", "Sole", "Pixel", "Nova", "Rio", "Ziggy", "Clover", "Pepper", "Sky"];

function ChoiceRow<K extends keyof typeof optionSets>({ title, name, value, onChange }: { title: string; name: K; value: AvatarOptions[K]; onChange: (value: AvatarOptions[K]) => void }) {
  return (
    <fieldset>
      <legend className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{title}</legend>
      <div className="hide-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {optionSets[name].map((option) => (
          <button type="button" key={option} onClick={() => onChange(option)} className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition ${value === option ? "border-violet bg-violet text-white shadow-glow" : "border-white/10 bg-white/[0.04] text-zinc-400 hover:border-white/20 hover:text-white"}`} aria-pressed={value === option}>
            {labels[option]}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function ColorRow({ title, palette, value, onChange }: { title: string; palette: readonly string[]; value: string; onChange: (value: string) => void }) {
  return (
    <fieldset>
      <legend className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{title}</legend>
      <div className="mt-3 flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-panel p-3">
        {palette.map((color) => (
          <button type="button" key={color} onClick={() => onChange(color)} className={`grid size-11 place-items-center rounded-full border border-white/10 transition ${value === color ? "ring-2 ring-violet ring-offset-4 ring-offset-panel" : "hover:scale-105"}`} style={{ backgroundColor: `#${color}` }} aria-label={`${title}: #${color}`} aria-pressed={value === color}>
            {value === color && <CheckIcon className="size-5 text-white drop-shadow" />}
          </button>
        ))}
      </div>
    </fieldset>
  );
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

  function surpriseMe() {
    const pick = <T,>(values: readonly T[]) => values[Math.floor(Math.random() * values.length)];
    setOptions({
      seed: `${pick(randomSeeds)}-${Date.now().toString(36)}`,
      skinColor: pick(colors.skinColor),
      hair: pick(optionSets.hair),
      hairColor: pick(colors.hairColor),
      eyes: pick(optionSets.eyes),
      mouth: pick(optionSets.mouth),
      backgroundColor: pick(colors.backgroundColor),
      glasses: Math.random() > 0.7,
    });
    setSaved(false);
  }

  function save() {
    saveAvatar({ ...options, seed: options.seed.trim() || defaultAvatar.seed });
    setSaved(true);
  }

  return (
    <div className="pb-8">
      <header className="flex items-center justify-between py-4">
        <Link href="/profilo" className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04]" aria-label="Torna al profilo"><ArrowLeftIcon className="size-5" /></Link>
        <div className="text-center"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet">Powered by DiceBear</p><h1 className="text-lg font-bold">Crea avatar</h1></div>
        <span className="size-10" />
      </header>

      <section className="relative mx-auto mt-3 aspect-square max-w-[310px] overflow-hidden rounded-[2.5rem] border border-violet/25 bg-gradient-to-br from-violet/[0.13] via-panel to-black p-5 shadow-glow">
        <div className="absolute left-5 top-5 z-10 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[10px] font-bold text-zinc-200 backdrop-blur"><SparklesIcon className="size-3.5 text-violet" />ANTEPRIMA LIVE</div>
        <AvatarArt options={options} className="h-full w-full rounded-[2rem]" />
      </section>

      <button type="button" onClick={surpriseMe} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-violet/30 bg-violet/10 px-4 py-3.5 text-sm font-bold text-violet transition hover:bg-violet/20"><SparklesIcon className="size-4" />Sorprendimi</button>

      <div className="mt-8 space-y-7">
        <fieldset>
          <label htmlFor="avatar-seed" className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Nome avatar</label>
          <p className="mt-1 text-xs text-zinc-500">Il nome rende il risultato unico e sempre riproducibile.</p>
          <input id="avatar-seed" value={options.seed} onChange={(event) => update("seed", event.target.value)} maxLength={40} className="mt-3 w-full rounded-2xl border border-white/10 bg-panel px-4 py-3.5 text-sm font-semibold text-white outline-none transition placeholder:text-zinc-600 focus:border-violet" placeholder="Scrivi un nome" />
        </fieldset>
        <ColorRow title="Colore pelle" palette={colors.skinColor} value={options.skinColor} onChange={(value) => update("skinColor", value)} />
        <ChoiceRow title="Capelli" name="hair" value={options.hair} onChange={(value) => update("hair", value)} />
        <ColorRow title="Colore capelli" palette={colors.hairColor} value={options.hairColor} onChange={(value) => update("hairColor", value)} />
        <ChoiceRow title="Occhi" name="eyes" value={options.eyes} onChange={(value) => update("eyes", value)} />
        <ChoiceRow title="Espressione" name="mouth" value={options.mouth} onChange={(value) => update("mouth", value)} />
        <ColorRow title="Sfondo" palette={colors.backgroundColor} value={options.backgroundColor} onChange={(value) => update("backgroundColor", value)} />
        <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-panel p-4">
          <span><span className="block text-sm font-bold text-white">Occhiali</span><span className="mt-0.5 block text-xs text-zinc-500">Aggiungi un accessorio al tuo look</span></span>
          <input type="checkbox" checked={options.glasses} onChange={(event) => update("glasses", event.target.checked)} className="peer sr-only" />
          <span className="relative h-7 w-12 rounded-full bg-zinc-700 transition peer-checked:bg-violet after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
        </label>
      </div>

      <button type="button" onClick={save} className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet px-4 py-4 text-sm font-bold text-white shadow-glow transition hover:bg-violet/90">{saved ? <><CheckIcon className="size-5" />Avatar salvato</> : "Salva avatar"}</button>
      <Link href="https://www.dicebear.com/styles/adventurer/" target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-zinc-500 transition hover:text-zinc-300">Adventurer by Lisa Wischofsky · DiceBear <ExternalIcon className="size-3.5" /></Link>
    </div>
  );
}
