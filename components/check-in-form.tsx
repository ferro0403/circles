"use client";

import { useState } from "react";
import { CheckIcon, ChevronRightIcon, PinIcon, SearchIcon } from "@/components/icons";
import { groups, places } from "@/data/mock-data";

export function CheckInForm() {
  const [mode, setMode] = useState<"place" | "free">("place");
  const [selectedPlace, setSelectedPlace] = useState(places[0].id);
  const [visibility, setVisibility] = useState("Amici");
  const [duration, setDuration] = useState("2h");
  const [shared, setShared] = useState(false);

  if (shared) {
    return <div className="flex min-h-[65vh] flex-col items-center justify-center text-center"><div className="grid size-20 place-items-center rounded-full bg-violet text-white shadow-glow"><CheckIcon className="size-10" /></div><h2 className="mt-6 text-3xl font-bold">Check-in condiviso!</h2><p className="mt-2 max-w-xs text-sm leading-6 text-zinc-400">I tuoi amici ora sanno dove trovarti. Lo stato scadrà automaticamente tra {duration}.</p><button onClick={() => setShared(false)} className="mt-8 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold">Modifica check-in</button></div>;
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="grid grid-cols-2 rounded-2xl bg-white/[0.04] p-1">
        <button onClick={() => setMode("place")} className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${mode === "place" ? "bg-white text-black" : "text-zinc-500"}`}>Attività</button>
        <button onClick={() => setMode("free")} className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${mode === "free" ? "bg-white text-black" : "text-zinc-500"}`}>Luogo libero</button>
      </div>

      {mode === "place" ? <div><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">Dove sei?</label><div className="relative"><SearchIcon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-500" /><input className="w-full rounded-2xl border border-white/10 bg-panel py-4 pl-12 pr-4 text-sm outline-none placeholder:text-zinc-600 focus:border-violet/50" placeholder="Cerca un’attività registrata" /></div><div className="mt-3 space-y-2">{places.slice(0, 3).map((place) => <button key={place.id} onClick={() => setSelectedPlace(place.id)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left ${selectedPlace === place.id ? "border-violet/50 bg-violet/[0.07]" : "border-white/10 bg-panel"}`}><span className="grid size-11 place-items-center rounded-xl bg-white/[0.06]"><PinIcon className="size-5 text-violet" /></span><span className="flex-1"><span className="block text-sm font-semibold">{place.name}</span><span className="text-xs text-zinc-500">{place.category} · {place.distance}</span></span>{selectedPlace === place.id && <CheckIcon className="size-5 text-violet" />}</button>)}</div></div> : <div className="space-y-3"><label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Descrivi il luogo</label><input className="w-full rounded-2xl border border-white/10 bg-panel px-4 py-4 text-sm outline-none focus:border-violet/50" placeholder="Es. Al parco vicino alle terme" /><input className="w-full rounded-2xl border border-white/10 bg-panel px-4 py-4 text-sm outline-none focus:border-violet/50" placeholder="Link Google Maps (facoltativo)" /></div>}

      <fieldset><legend className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Chi può vederlo?</legend><div className="space-y-2">{["Amici", ...groups.slice(0, 2).map((group) => group.name)].map((item) => <button key={item} onClick={() => setVisibility(item)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-panel p-4 text-sm font-semibold"><span>{item === "Amici" ? "Tutti gli amici" : item}</span><span className={`grid size-5 place-items-center rounded-full border ${visibility === item ? "border-violet bg-violet text-white" : "border-zinc-600"}`}>{visibility === item && <CheckIcon className="size-3" />}</span></button>)}</div></fieldset>

      <fieldset><legend className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Per quanto tempo?</legend><div className="grid grid-cols-4 gap-2">{["1h", "2h", "4h", "Domani"].map((item) => <button key={item} onClick={() => setDuration(item)} className={`rounded-2xl border py-3 text-xs font-bold ${duration === item ? "border-violet bg-violet text-white" : "border-white/10 bg-panel text-zinc-400"}`}>{item}</button>)}</div></fieldset>

      <button onClick={() => setShared(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet py-4 font-bold text-white shadow-glow transition active:scale-[.98]">Condividi adesso<ChevronRightIcon className="size-5" /></button>
      <p className="text-center text-[11px] leading-5 text-zinc-600">Il check-in si cancella automaticamente alla scadenza. Nessuna posizione viene tracciata.</p>
    </div>
  );
}
