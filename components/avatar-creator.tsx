/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, CheckIcon, ChevronRightIcon, ExternalIcon, SparklesIcon } from "@/components/icons";
import { AvatarArt, defaultAvatar, getDiceBearUrl, useSavedAvatar } from "@/components/local-profile";
import type { AvatarOptions } from "@/components/local-profile";

const range = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => `${prefix}${String(index + 1).padStart(2, "0")}`);
const variantRange = (count: number) => range("variant", count);

const DICEBEAR_OPTIONS = {
  hair: [...range("long", 26), ...range("short", 19)],
  eyes: variantRange(26),
  eyebrows: variantRange(15),
  mouth: variantRange(30),
  glasses: variantRange(5),
  earrings: variantRange(6),
  details: ["birthmark", "blush", "freckles", "mustache"],
} as const;

const skinColors = [
  { value: "f2d3b1", label: "Chiara" },
  { value: "ecad80", label: "Dorata" },
  { value: "9e5622", label: "Bruna" },
  { value: "763900", label: "Scura" },
] as const;

const hairColors = [
  { value: "0e0e0e", label: "Nero" },
  { value: "2c1b18", label: "Castano scuro" },
  { value: "6a4e35", label: "Castano" },
  { value: "562306", label: "Castano intenso" },
  { value: "796a45", label: "Castano chiaro" },
  { value: "ac6511", label: "Biondo scuro" },
  { value: "b9a05f", label: "Biondo" },
  { value: "e5d7a3", label: "Biondo platino" },
  { value: "cb6820", label: "Ramato" },
  { value: "ab2a18", label: "Rosso" },
  { value: "afafaf", label: "Grigio" },
  { value: "f5f5f5", label: "Bianco" },
  { value: "2563eb", label: "Blu" },
  { value: "85c2c6", label: "Azzurro" },
  { value: "3eac2c", label: "Verde" },
  { value: "dba3be", label: "Rosa" },
  { value: "592454", label: "Viola" },
] as const;

const backgroundColors = [
  { value: "5b21b6", label: "Viola scuro" }, { value: "7c3aed", label: "Viola" },
  { value: "2563eb", label: "Blu" }, { value: "0891b2", label: "Azzurro" },
  { value: "059669", label: "Verde" }, { value: "be185d", label: "Rosa" },
  { value: "c2410c", label: "Arancio" }, { value: "3f3f46", label: "Grafite" },
] as const;

const sectionMeta = {
  appearance: { title: "Aspetto", description: "Nome, dimensione e rotazione" },
  skin: { title: "Pelle", description: `${skinColors.length} colori` },
  hair: { title: "Capelli", description: `${DICEBEAR_OPTIONS.hair.length} varianti · ${hairColors.length} colori` },
  eyes: { title: "Occhi", description: `${DICEBEAR_OPTIONS.eyes.length} occhi · ${DICEBEAR_OPTIONS.eyebrows.length} sopracciglia` },
  mouth: { title: "Bocca / Espressione", description: `${DICEBEAR_OPTIONS.mouth.length} varianti` },
  accessories: { title: "Accessori", description: `${DICEBEAR_OPTIONS.glasses.length + DICEBEAR_OPTIONS.earrings.length + DICEBEAR_OPTIONS.details.length} varianti` },
  outfit: { title: "Outfit", description: "Non disponibile in Adventurer" },
  background: { title: "Sfondo", description: `${backgroundColors.length} colori` },
} as const;

type SectionKey = keyof typeof sectionMeta;
const randomSeeds = ["Luna", "Milo", "Sole", "Pixel", "Nova", "Rio", "Ziggy", "Clover", "Pepper", "Sky"];

function Accordion({ id, open, onToggle, children }: { id: SectionKey; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  const meta = sectionMeta[id];
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-panel">
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-3 px-4 py-4 text-left" aria-expanded={open} aria-controls={`avatar-section-${id}`}>
        <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-white">{meta.title}</span><span className="mt-0.5 block text-xs text-zinc-500">{meta.description}</span></span>
        <ChevronRightIcon className={`size-5 shrink-0 text-zinc-500 transition-transform ${open ? "rotate-90 text-violet" : ""}`} />
      </button>
      {open && <div id={`avatar-section-${id}`} className="border-t border-white/10 px-4 py-5">{children}</div>}
    </section>
  );
}

function VariantGrid<K extends keyof AvatarOptions>({ title, options, optionKey, value, avatar, onChange, nullable = false }: { title: string; options: readonly string[]; optionKey: K; value: AvatarOptions[K]; avatar: AvatarOptions; onChange: (value: AvatarOptions[K]) => void; nullable?: boolean }) {
  const values = nullable ? [null, ...options] : options;
  return (
    <fieldset>
      <legend className="mb-3 flex w-full items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400"><span>{title}</span><span className="text-[10px] text-zinc-600">{options.length} disponibili</span></legend>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {values.map((option) => {
          const selected = value === option;
          const preview = { ...avatar, [optionKey]: option } as AvatarOptions;
          const label = option === null ? "Nessuno" : option.replace("variant", "Variante ").replace("short", "Corto ").replace("long", "Lungo ");
          const shortLabel = option === null ? "Nessuno" : option.replace("variant", "V").replace("short", "C").replace("long", "L");
          return (
            <button type="button" key={option ?? "none"} onClick={() => onChange(option as AvatarOptions[K])} className={`relative min-w-0 overflow-hidden rounded-2xl border p-1.5 text-center transition ${selected ? "border-violet bg-violet/15 ring-1 ring-violet" : "border-white/10 bg-black/20 active:scale-95"}`} aria-pressed={selected} aria-label={`${title}: ${label}`}>
              {option === null ? <span className="grid aspect-square place-items-center rounded-xl bg-white/[0.04] text-2xl text-zinc-600">×</span> : <img src={getDiceBearUrl(preview)} alt="" loading="lazy" className="aspect-square w-full rounded-xl bg-zinc-900 object-cover" />}
              <span className="mt-1.5 block truncate px-0.5 text-[10px] font-semibold text-zinc-300">{shortLabel}</span>
              {selected && <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-violet text-white"><CheckIcon className="size-3" /></span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ColorGrid({ title, colors, value, onChange }: { title: string; colors: readonly { value: string; label: string }[]; value: string; onChange: (value: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">{title}</legend>
      <div className="grid grid-cols-2 gap-2">
        {colors.map((color) => <button type="button" key={color.value} onClick={() => onChange(color.value)} className={`flex min-w-0 items-center gap-2 rounded-2xl border p-2.5 text-left transition ${value === color.value ? "border-violet bg-violet/10" : "border-white/10 bg-black/20"}`} aria-pressed={value === color.value}><span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15" style={{ backgroundColor: `#${color.value}` }}>{value === color.value && <CheckIcon className="size-4 text-white drop-shadow" />}</span><span className="truncate text-[11px] font-semibold text-zinc-300">{color.label}</span></button>)}
      </div>
    </fieldset>
  );
}

export function AvatarCreator() {
  const { avatar: savedAvatar, hydrated, saveAvatar } = useSavedAvatar();
  const [options, setOptions] = useState<AvatarOptions>(defaultAvatar);
  const [openSection, setOpenSection] = useState<SectionKey>("appearance");
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (hydrated) setOptions(savedAvatar ?? defaultAvatar); }, [hydrated, savedAvatar]);

  function update<K extends keyof AvatarOptions>(key: K, value: AvatarOptions[K]) {
    setOptions((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function surpriseMe() {
    const pick = <T,>(values: readonly T[]) => values[Math.floor(Math.random() * values.length)];
    setOptions({
      seed: `${pick(randomSeeds)}-${Date.now().toString(36)}`,
      skinColor: pick(skinColors).value,
      hair: pick(DICEBEAR_OPTIONS.hair), hairColor: pick(hairColors).value,
      eyes: pick(DICEBEAR_OPTIONS.eyes), eyebrows: pick(DICEBEAR_OPTIONS.eyebrows), mouth: pick(DICEBEAR_OPTIONS.mouth),
      glasses: Math.random() > 0.55 ? pick(DICEBEAR_OPTIONS.glasses) : null,
      earrings: Math.random() > 0.65 ? pick(DICEBEAR_OPTIONS.earrings) : null,
      details: Math.random() > 0.7 ? pick(DICEBEAR_OPTIONS.details) : null,
      backgroundColor: pick(backgroundColors).value, scale: 1, rotate: 0,
    });
    setSaved(false);
  }

  function save() {
    saveAvatar({ ...options, seed: options.seed.trim() || defaultAvatar.seed });
    setSaved(true);
  }

  const accordion = (id: SectionKey, children: React.ReactNode) => <Accordion id={id} open={openSection === id} onToggle={() => setOpenSection((current) => current === id ? "appearance" : id)}>{children}</Accordion>;

  return (
    <div className="min-h-dvh pb-28">
      <header className="flex items-center justify-between py-4">
        <Link href="/profilo" className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04]" aria-label="Torna al profilo"><ArrowLeftIcon className="size-5" /></Link>
        <div className="text-center"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet">DiceBear Adventurer</p><h1 className="text-lg font-bold">Crea avatar</h1></div><span className="size-10" />
      </header>

      <section className="mx-auto mt-2 max-w-[280px] rounded-[2rem] border border-violet/25 bg-[#0d0c11] p-3 shadow-glow">
        <div className="relative aspect-square overflow-hidden rounded-[1.45rem]"><div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[9px] font-bold text-zinc-200 backdrop-blur"><SparklesIcon className="size-3 text-violet" />LIVE</div><AvatarArt options={options} className="h-full w-full" /></div>
      </section>

      <button type="button" onClick={surpriseMe} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-violet/30 bg-violet/10 px-4 py-3 text-sm font-bold text-violet"><SparklesIcon className="size-4" />Sorprendimi</button>

      <div className="mt-5 space-y-3">
        {accordion("appearance", <div className="space-y-5"><label htmlFor="avatar-seed" className="block text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">Nome avatar<input id="avatar-seed" value={options.seed} onChange={(event) => update("seed", event.target.value)} maxLength={40} className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm font-semibold normal-case tracking-normal text-white outline-none focus:border-violet" /></label><label className="block text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">Zoom <span className="float-right text-violet">{options.scale.toFixed(2)}×</span><input type="range" min="0.75" max="1.25" step="0.05" value={options.scale} onChange={(event) => update("scale", Number(event.target.value))} className="mt-4 w-full accent-violet" /></label><label className="block text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">Rotazione <span className="float-right text-violet">{options.rotate}°</span><input type="range" min="-15" max="15" step="1" value={options.rotate} onChange={(event) => update("rotate", Number(event.target.value))} className="mt-4 w-full accent-violet" /></label><p className="rounded-2xl bg-white/[0.04] p-3 text-xs leading-5 text-zinc-500">Testa: variante default, l’unica supportata dallo stile Adventurer.</p></div>)}
        {accordion("skin", <ColorGrid title="Colore pelle" colors={skinColors} value={options.skinColor} onChange={(value) => update("skinColor", value)} />)}
        {accordion("hair", <div className="space-y-6"><VariantGrid title="Acconciatura" options={DICEBEAR_OPTIONS.hair} optionKey="hair" value={options.hair} avatar={options} onChange={(value) => update("hair", value)} /><ColorGrid title="Colore capelli" colors={hairColors} value={options.hairColor} onChange={(value) => update("hairColor", value)} /></div>)}
        {accordion("eyes", <div className="space-y-6"><VariantGrid title="Occhi" options={DICEBEAR_OPTIONS.eyes} optionKey="eyes" value={options.eyes} avatar={options} onChange={(value) => update("eyes", value)} /><VariantGrid title="Sopracciglia" options={DICEBEAR_OPTIONS.eyebrows} optionKey="eyebrows" value={options.eyebrows} avatar={options} onChange={(value) => update("eyebrows", value)} /></div>)}
        {accordion("mouth", <VariantGrid title="Bocca / espressione" options={DICEBEAR_OPTIONS.mouth} optionKey="mouth" value={options.mouth} avatar={options} onChange={(value) => update("mouth", value)} />)}
        {accordion("accessories", <div className="space-y-6"><VariantGrid title="Occhiali" options={DICEBEAR_OPTIONS.glasses} optionKey="glasses" value={options.glasses} avatar={options} onChange={(value) => update("glasses", value)} nullable /><VariantGrid title="Orecchini" options={DICEBEAR_OPTIONS.earrings} optionKey="earrings" value={options.earrings} avatar={options} onChange={(value) => update("earrings", value)} nullable /><VariantGrid title="Dettagli" options={DICEBEAR_OPTIONS.details} optionKey="details" value={options.details} avatar={options} onChange={(value) => update("details", value)} nullable /></div>)}
        {accordion("outfit", <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-4 text-sm leading-6 text-zinc-400"><p className="font-bold text-white">Nessun outfit disponibile</p><p className="mt-1">Lo stile DiceBear Adventurer 10.1.0 è un ritratto e non include componenti per abiti o outfit. La sezione resta visibile per chiarire che non ci sono opzioni nascoste.</p></div>)}
        {accordion("background", <ColorGrid title="Colore sfondo" colors={backgroundColors} value={options.backgroundColor} onChange={(value) => update("backgroundColor", value)} />)}
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-[#0d0c11] p-3">
        <button type="button" onClick={save} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet px-4 py-4 text-sm font-bold text-white shadow-glow">{saved ? <><CheckIcon className="size-5" />Avatar salvato</> : "Salva avatar"}</button>
        <p className="mt-3 text-center text-[10px] leading-4 text-zinc-600">131 varianti personalizzabili esposte · salvataggio locale</p>
      </div>
      <Link href="https://www.dicebear.com/styles/adventurer/" target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-zinc-500">Adventurer by Lisa Wischofsky · DiceBear <ExternalIcon className="size-3.5" /></Link>
    </div>
  );
}
