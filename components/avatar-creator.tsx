"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, CheckIcon, SparklesIcon } from "@/components/icons";

type AvatarOptions = {
  hair: "crop" | "waves" | "buzz" | "bun";
  eyes: "round" | "happy" | "focused";
  outfit: "hoodie" | "tee" | "jacket";
  expression: "smile" | "calm" | "grin";
  skin: string;
};

const skinColors = ["#f5cfae", "#dca47d", "#ad7251", "#754631", "#3f281f"];
const hairOptions: AvatarOptions["hair"][] = ["crop", "waves", "buzz", "bun"];
const eyeOptions: AvatarOptions["eyes"][] = ["round", "happy", "focused"];
const outfitOptions: AvatarOptions["outfit"][] = ["hoodie", "tee", "jacket"];
const expressionOptions: AvatarOptions["expression"][] = ["smile", "calm", "grin"];

const labels = {
  crop: "Corti", waves: "Mossi", buzz: "Rasati", bun: "Chignon",
  round: "Tondi", happy: "Felici", focused: "Decisi",
  hoodie: "Felpa", tee: "T-shirt", jacket: "Giacca",
  smile: "Sorriso", calm: "Calma", grin: "Risata",
};

function ChoiceRow<T extends string>({ title, options, value, onChange }: { title: string; options: readonly T[]; value: T; onChange: (value: T) => void }) {
  return <fieldset><legend className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{title}</legend><div className="hide-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">{options.map((option) => <button type="button" key={option} onClick={() => onChange(option)} className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition ${value === option ? "border-violet bg-violet text-white shadow-glow" : "border-white/10 bg-white/[0.04] text-zinc-400"}`}>{labels[option as keyof typeof labels]}</button>)}</div></fieldset>;
}

function AvatarPreview({ options }: { options: AvatarOptions }) {
  const eyeShape = options.eyes === "round" ? <><circle cx="79" cy="91" r="4" fill="#171119" /><circle cx="121" cy="91" r="4" fill="#171119" /></> : options.eyes === "happy" ? <><path d="M73 92q6-7 12 0" fill="none" stroke="#171119" strokeWidth="4" strokeLinecap="round" /><path d="M115 92q6-7 12 0" fill="none" stroke="#171119" strokeWidth="4" strokeLinecap="round" /></> : <><path d="m73 89 12 2" stroke="#171119" strokeWidth="4" strokeLinecap="round" /><path d="m115 91 12-2" stroke="#171119" strokeWidth="4" strokeLinecap="round" /></>;
  const mouth = options.expression === "smile" ? <path d="M88 111q12 12 24 0" fill="none" stroke="#7d3344" strokeWidth="4" strokeLinecap="round" /> : options.expression === "grin" ? <path d="M86 109q14 18 28 0Z" fill="white" stroke="#7d3344" strokeWidth="3" strokeLinejoin="round" /> : <path d="M92 114h16" stroke="#7d3344" strokeWidth="4" strokeLinecap="round" />;
  const hair = options.hair === "crop" ? <path d="M55 76q2-48 45-48t45 48q-17-20-45-16T55 76Z" fill="#211927" /> : options.hair === "waves" ? <path d="M53 80q-7-50 27-54 12-17 32 0 37 5 34 55-12-19-25-17-13-16-25-2-18-12-43 18Z" fill="#33223d" /> : options.hair === "bun" ? <><circle cx="100" cy="24" r="24" fill="#271d2c" /><path d="M55 79q1-51 45-51t45 51q-18-22-45-18T55 79Z" fill="#271d2c" /></> : <path d="M58 64q8-36 42-36t42 36q-41-14-84 0Z" fill="#17131a" />;
  const outfitColor = options.outfit === "hoodie" ? "#7c3aed" : options.outfit === "tee" ? "#27232d" : "#4c1d95";

  return <svg viewBox="0 0 200 220" className="h-full w-full" role="img" aria-label="Anteprima del tuo avatar"><defs><linearGradient id="avatar-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#5b21b6" /><stop offset="1" stopColor="#d946ef" /></linearGradient></defs><circle cx="100" cy="104" r="91" fill="url(#avatar-bg)" opacity=".18" /><path d="M34 220q4-72 66-72t66 72" fill={outfitColor} />{options.outfit === "hoodie" && <path d="M66 159q34 38 68 0M100 185v34" fill="none" stroke="#a78bfa" strokeWidth="5" opacity=".7" />}<path d="M82 143h36v28q-18 15-36 0Z" fill={options.skin} /><ellipse cx="100" cy="91" rx="47" ry="58" fill={options.skin} />{hair}{eyeShape}<path d="M100 94v10" stroke="#8b5c48" strokeWidth="3" strokeLinecap="round" opacity=".55" />{mouth}<circle cx="62" cy="104" r="7" fill={options.skin} /><circle cx="138" cy="104" r="7" fill={options.skin} /></svg>;
}

export function AvatarCreator() {
  const [options, setOptions] = useState<AvatarOptions>({ hair: "waves", eyes: "happy", outfit: "hoodie", expression: "smile", skin: skinColors[1] });
  const [saved, setSaved] = useState(false);

  function update<K extends keyof AvatarOptions>(key: K, value: AvatarOptions[K]) {
    setOptions((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function save() {
    localStorage.setItem("circle-avatar", JSON.stringify(options));
    setSaved(true);
  }

  return <div className="pb-8"><header className="flex items-center justify-between py-4"><Link href="/profilo" className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04]" aria-label="Torna al profilo"><ArrowLeftIcon className="size-5" /></Link><div className="text-center"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet">Il tuo stile</p><h1 className="text-lg font-bold">Crea avatar</h1></div><span className="size-10" /></header>
    <section className="relative mx-auto mt-3 aspect-square max-w-[310px] overflow-hidden rounded-[2.5rem] border border-violet/25 bg-gradient-to-br from-violet/[0.13] via-panel to-black p-5 shadow-glow"><div className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] font-bold text-zinc-300 backdrop-blur"><SparklesIcon className="size-3.5 text-violet" />ANTEPRIMA LIVE</div><AvatarPreview options={options} /></section>
    <div className="mt-8 space-y-7"><ChoiceRow title="Capelli" options={hairOptions} value={options.hair} onChange={(value) => update("hair", value)} /><ChoiceRow title="Occhi" options={eyeOptions} value={options.eyes} onChange={(value) => update("eyes", value)} /><ChoiceRow title="Outfit" options={outfitOptions} value={options.outfit} onChange={(value) => update("outfit", value)} /><ChoiceRow title="Espressione" options={expressionOptions} value={options.expression} onChange={(value) => update("expression", value)} /><fieldset><legend className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Colore pelle</legend><div className="mt-3 flex justify-between rounded-2xl border border-white/10 bg-panel p-3">{skinColors.map((color) => <button type="button" key={color} onClick={() => update("skin", color)} className={`grid size-11 place-items-center rounded-full transition ${options.skin === color ? "ring-2 ring-violet ring-offset-4 ring-offset-panel" : ""}`} style={{ backgroundColor: color }} aria-label={`Tonalità pelle ${color}`}>{options.skin === color && <CheckIcon className="size-5 text-black/70" />}</button>)}</div></fieldset></div>
    <button onClick={save} className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold transition ${saved ? "bg-white text-black" : "bg-violet text-white shadow-glow"}`}>{saved ? <><CheckIcon className="size-5" />Avatar salvato</> : "Salva avatar"}</button>
  </div>;
}
