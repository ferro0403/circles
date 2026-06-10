"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, CheckIcon, SparklesIcon } from "@/components/icons";
import { DiceBearAvatar, generateAvatarSvg, useSavedAvatar } from "@/components/local-profile";
import type { DiceBearAvatarConfig, PersonaBody, PersonaEyes, PersonaHair, PersonaMouth } from "@/components/local-profile";

const backgrounds = [
  { value: "5b21b6", label: "Viola" }, { value: "7c3aed", label: "Lavanda" },
  { value: "2563eb", label: "Blu" }, { value: "0891b2", label: "Cyan" },
  { value: "059669", label: "Verde" }, { value: "be185d", label: "Rosa" },
  { value: "c2410c", label: "Arancio" }, { value: "3f3f46", label: "Grafite" },
] as const;
const skinColors = ["eeb4a4", "e7a391", "e5a07e", "d78774", "b16a5b", "92594b", "623d36"] as const;
const hairColors = ["362c47", "6c4545", "f29c65", "f27d65", "dee1f5", "e16381", "e15c66", "111827"] as const;
const clothingColors = ["456dff", "6dbb58", "f55d81", "7555ca", "e24553", "54d7c7", "f3b63a", "27272a"] as const;
const randomSeeds = ["Luna", "Milo", "Sofia", "Leo", "Nina", "Teo", "Maya", "Edo", "Ari", "Noa"] as const;

const hairOptions: { value: PersonaHair; label: string }[] = [
  { value: "curly", label: "Ricci" }, { value: "bobCut", label: "Caschetto" }, { value: "bobBangs", label: "Caschetto con frangia" },
  { value: "buzzcut", label: "Rasati" }, { value: "fade", label: "Sfumati" }, { value: "long", label: "Lunghi" },
  { value: "extraLong", label: "Molto lunghi" }, { value: "curlyBun", label: "Chignon riccio" }, { value: "curlyHighTop", label: "Ricci alti" },
  { value: "pigtails", label: "Codini" }, { value: "mohawk", label: "Cresta" }, { value: "sideShave", label: "Rasatura laterale" },
  { value: "straightBun", label: "Chignon liscio" }, { value: "bunUndercut", label: "Chignon undercut" },
  { value: "shortCombover", label: "Corti pettinati" }, { value: "beanie", label: "Berretto" }, { value: "bald", label: "Senza capelli" },
];
const eyeOptions: { value: PersonaEyes; label: string }[] = [
  { value: "happy", label: "Felici" }, { value: "open", label: "Aperti" }, { value: "wink", label: "Occhiolino" },
  { value: "sleep", label: "Rilassati" }, { value: "glasses", label: "Occhiali" }, { value: "sunglasses", label: "Occhiali da sole" },
];
const mouthOptions: { value: PersonaMouth; label: string }[] = [
  { value: "smile", label: "Sorriso" }, { value: "bigSmile", label: "Grande sorriso" }, { value: "smirk", label: "Sorrisetto" },
  { value: "surprise", label: "Sorpresa" }, { value: "lips", label: "Labbra" }, { value: "frown", label: "Seria" }, { value: "pacifier", label: "Ciuccio" },
];
const bodyOptions: { value: PersonaBody; label: string }[] = [
  { value: "rounded", label: "Tondo" }, { value: "squared", label: "Squadrato" }, { value: "checkered", label: "Fantasia" }, { value: "small", label: "Minimal" },
];

type EditableConfig = Omit<DiceBearAvatarConfig, "svg">;

function ColorRow({ title, colors, value, onChange }: { title: string; colors: readonly string[]; value: string; onChange: (value: string) => void }) {
  return <fieldset><legend className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{title}</legend><div className="mt-3 flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-panel p-3">{colors.map((color) => <button type="button" key={color} onClick={() => onChange(color)} className={`grid size-11 place-items-center rounded-full transition ${value === color ? "ring-2 ring-violet ring-offset-4 ring-offset-panel" : ""}`} style={{ backgroundColor: `#${color}` }} aria-label={`${title}: #${color}`}>{value === color && <CheckIcon className="size-5 text-white drop-shadow" />}</button>)}</div></fieldset>;
}

function OptionSelect<T extends string>({ id, label, value, options, onChange }: { id: string; label: string; value: T; options: { value: T; label: string }[]; onChange: (value: T) => void }) {
  return <label htmlFor={id} className="block text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{label}<select id={id} value={value} onChange={(event) => onChange(event.target.value as T)} className="mt-3 w-full rounded-xl border border-white/10 bg-panel px-4 py-3 text-sm font-semibold normal-case tracking-normal text-zinc-200 outline-none transition focus:border-violet">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function editableConfig(config: DiceBearAvatarConfig): EditableConfig {
  return {
    style: "personas",
    seed: config.seed,
    backgroundColor: config.backgroundColor,
    skinColor: config.skinColor,
    hair: config.hair,
    hairColor: config.hairColor,
    eyes: config.eyes,
    mouth: config.mouth,
    body: config.body,
    clothingColor: config.clothingColor,
    flip: config.flip,
    scale: config.scale,
    facialHair: config.facialHair,
  };
}

function pick<T>(values: readonly T[]) {
  return values[Math.floor(Math.random() * values.length)];
}

export function AvatarCreator() {
  const { avatar: savedAvatar, hydrated, saveAvatar } = useSavedAvatar();
  const [config, setConfig] = useState<EditableConfig>(() => editableConfig(savedAvatar));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (hydrated) setConfig(editableConfig(savedAvatar));
  }, [hydrated, savedAvatar]);

  const preview = useMemo<DiceBearAvatarConfig>(() => ({ ...config, svg: generateAvatarSvg(config) }), [config]);

  function update<K extends keyof EditableConfig>(key: K, value: EditableConfig[K]) {
    setConfig((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function randomize() {
    const seed = `${pick(randomSeeds)}-${Math.floor(Math.random() * 10000)}`;
    setConfig((current) => ({
      ...current,
      seed,
      backgroundColor: pick(backgrounds).value,
      skinColor: pick(skinColors),
      hair: pick(hairOptions).value,
      hairColor: pick(hairColors),
      eyes: pick(eyeOptions).value,
      mouth: pick(mouthOptions).value,
      body: pick(bodyOptions).value,
      clothingColor: pick(clothingColors),
      facialHair: Math.random() > 0.75,
    }));
    setSaved(false);
  }

  function save() {
    saveAvatar(config);
    setSaved(true);
  }

  return <div className="pb-8"><header className="flex items-center justify-between py-4"><Link href="/profilo" className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04]" aria-label="Torna al profilo"><ArrowLeftIcon className="size-5" /></Link><div className="text-center"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet">DiceBear Personas</p><h1 className="text-lg font-bold">Crea avatar</h1></div><span className="size-10" /></header>

    <section className="relative mx-auto mt-3 aspect-square max-w-[310px] overflow-hidden rounded-[2.5rem] border border-violet/25 bg-gradient-to-br from-violet/[0.13] via-panel to-black p-5 shadow-glow"><div className="absolute left-5 top-5 z-10 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] font-bold text-zinc-300 backdrop-blur"><SparklesIcon className="size-3.5 text-violet" />ANTEPRIMA LIVE</div><DiceBearAvatar config={preview} className="h-full w-full overflow-hidden rounded-[2rem]" /></section>

    <div className="mt-8 space-y-7">
      <fieldset><label htmlFor="avatar-seed" className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Nome o seed</label><div className="mt-3 flex gap-2"><input id="avatar-seed" value={config.seed} onChange={(event) => update("seed", event.target.value)} maxLength={48} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-panel px-4 py-3 text-sm outline-none transition focus:border-violet" placeholder="Es. Luca" /><button type="button" onClick={randomize} className="shrink-0 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-bold text-zinc-300">Randomizza</button></div><p className="mt-2 text-[11px] leading-5 text-zinc-600">Lo stesso seed e le stesse opzioni generano sempre lo stesso avatar.</p></fieldset>

      <ColorRow title="Colore sfondo" colors={backgrounds.map((color) => color.value)} value={config.backgroundColor} onChange={(value) => update("backgroundColor", value)} />
      <ColorRow title="Colore pelle" colors={skinColors} value={config.skinColor} onChange={(value) => update("skinColor", value)} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <OptionSelect id="avatar-hair" label="Capelli" value={config.hair} options={hairOptions} onChange={(value) => update("hair", value)} />
        <OptionSelect id="avatar-eyes" label="Occhi" value={config.eyes} options={eyeOptions} onChange={(value) => update("eyes", value)} />
        <OptionSelect id="avatar-mouth" label="Espressione" value={config.mouth} options={mouthOptions} onChange={(value) => update("mouth", value)} />
        <OptionSelect id="avatar-body" label="Outfit" value={config.body} options={bodyOptions} onChange={(value) => update("body", value)} />
      </div>

      <ColorRow title="Colore capelli" colors={hairColors} value={config.hairColor} onChange={(value) => update("hairColor", value)} />
      <ColorRow title="Colore outfit" colors={clothingColors} value={config.clothingColor} onChange={(value) => update("clothingColor", value)} />

      <fieldset><legend className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Inquadratura</legend><input type="range" min="80" max="120" step="5" value={config.scale} onChange={(event) => update("scale", Number(event.target.value))} className="mt-4 w-full accent-violet" /><div className="mt-1 flex justify-between text-[11px] text-zinc-600"><span>Più spazio</span><span>{config.scale}%</span><span>Primo piano</span></div></fieldset>

      <div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => update("flip", !config.flip)} className={`rounded-2xl border px-3 py-3 text-xs font-semibold ${config.flip ? "border-violet bg-violet text-white" : "border-white/10 bg-panel text-zinc-400"}`}>Specchia avatar</button><button type="button" onClick={() => update("facialHair", !config.facialHair)} className={`rounded-2xl border px-3 py-3 text-xs font-semibold ${config.facialHair ? "border-violet bg-violet text-white" : "border-white/10 bg-panel text-zinc-400"}`}>Barba e baffi</button></div>
    </div>

    <button type="button" onClick={save} className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold transition ${saved ? "bg-white text-black" : "bg-violet text-white shadow-glow"}`}>{saved ? <><CheckIcon className="size-5" />Avatar salvato</> : "Salva avatar"}</button>
    {saved && <p role="status" className="mt-3 text-center text-sm font-semibold text-violet">Configurazione e SVG salvati sul dispositivo.</p>}
    <Link href="/profilo" className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] py-4 text-sm font-semibold text-zinc-300"><ArrowLeftIcon className="size-4" />Torna al profilo</Link>
  </div>;
}
