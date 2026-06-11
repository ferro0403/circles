"use client";

import { FormEvent, useEffect, useState } from "react";
import { PlusIcon } from "@/components/icons";
import { Avatar, SectionHeader } from "@/components/ui";
import { currentUser, groupMembers } from "@/data/mock-data";

export const AVAILABILITY_STORAGE_KEY = "circle.groupAvailability.v1";

type AvailabilityState = "free" | "maybe" | "busy";
type Availability = {
  id: string;
  groupId: string;
  state: AvailabilityState;
  note: string;
  date: string;
  createdAt: string;
};

const labels: Record<AvailabilityState, string> = { free: "Libero", maybe: "Forse", busy: "Occupato" };

function today(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readAvailability(): Availability[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(AVAILABILITY_STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function formatDate(value: string) {
  if (value === today()) return "Oggi";
  if (value === today(1)) return "Domani";
  return new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short" }).format(new Date(`${value}T12:00:00`));
}

export function GroupAvailability({ groupId }: { groupId: string }) {
  const [creating, setCreating] = useState(false);
  const [state, setState] = useState<AvailabilityState>("free");
  const [note, setNote] = useState("");
  const [dayMode, setDayMode] = useState<"today" | "tomorrow" | "custom">("today");
  const [customDate, setCustomDate] = useState(today());
  const [saved, setSaved] = useState<Availability[]>([]);

  useEffect(() => setSaved(readAvailability().filter((item) => item.groupId === groupId)), [groupId]);

  function saveAvailability(event: FormEvent) {
    event.preventDefault();
    const date = dayMode === "today" ? today() : dayMode === "tomorrow" ? today(1) : customDate;
    if (!date) return;
    const entry: Availability = {
      id: `${groupId}-${Date.now()}`,
      groupId,
      state,
      note: note.trim(),
      date,
      createdAt: new Date().toISOString(),
    };
    const allEntries = readAvailability();
    const nextAll = [...allEntries.filter((item) => !(item.groupId === groupId && item.date === date)), entry];
    window.localStorage.setItem(AVAILABILITY_STORAGE_KEY, JSON.stringify(nextAll));
    setSaved(nextAll.filter((item) => item.groupId === groupId));
    setNote("");
    setCreating(false);
  }

  return <>
    <section className="rounded-[2rem] border border-violet/20 bg-gradient-to-br from-violet/[0.16] to-panel p-5">
      <button onClick={() => setCreating((value) => !value)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet py-3.5 text-sm font-bold text-white"><PlusIcon className="size-4" />Aggiungi disponibilità</button>
      {creating && <form onSubmit={saveAvailability} className="mt-4 space-y-4 border-t border-white/10 pt-4">
        <fieldset><legend className="mb-2 text-xs font-bold text-zinc-400">Come sei disponibile?</legend><div className="grid grid-cols-3 gap-2">{(Object.keys(labels) as AvailabilityState[]).map((value) => <button type="button" key={value} onClick={() => setState(value)} className={`rounded-xl border py-3 text-xs font-bold ${state === value ? "border-violet bg-violet text-white" : "border-white/10 bg-black/20 text-zinc-400"}`}>{labels[value]}</button>)}</div></fieldset>
        <fieldset><legend className="mb-2 text-xs font-bold text-zinc-400">Per quale giorno?</legend><div className="grid grid-cols-3 gap-2">{([ ["today", "Oggi"], ["tomorrow", "Domani"], ["custom", "Altra data"] ] as const).map(([value, label]) => <button type="button" key={value} onClick={() => setDayMode(value)} className={`rounded-xl border py-3 text-xs font-bold ${dayMode === value ? "border-violet bg-violet text-white" : "border-white/10 bg-black/20 text-zinc-400"}`}>{label}</button>)}</div></fieldset>
        {dayMode === "custom" && <input type="date" min={today()} value={customDate} onChange={(event) => setCustomDate(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet" />}
        <input value={note} onChange={(event) => setNote(event.target.value)} maxLength={80} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet" placeholder="Nota opzionale" />
        <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setCreating(false)} className="rounded-xl border border-white/10 py-3 text-xs font-bold text-zinc-400">Annulla</button><button type="submit" className="rounded-xl bg-violet py-3 text-xs font-bold text-white">Salva</button></div>
      </form>}
    </section>

    <section><SectionHeader title="Disponibilità" /><div className="grid grid-cols-2 gap-3">
      {groupMembers.map((member) => <div key={`mock-${member.name}`} className="rounded-2xl border border-white/10 bg-panel p-3"><div className="flex items-center gap-2"><Avatar initials={member.initials} className="size-9" tone={member.state === "free" ? "bg-violet" : member.state === "later" ? "bg-cyan-300" : "bg-zinc-500"} /><span className="text-sm font-bold">{member.name}</span></div><p className={`mt-3 text-xs font-semibold ${member.state === "free" ? "text-violet" : "text-zinc-500"}`}>{member.availability}</p></div>)}
      {saved.sort((a, b) => a.date.localeCompare(b.date)).map((entry) => <div key={entry.id} className="rounded-2xl border border-violet/30 bg-panel p-3"><div className="flex items-center gap-2"><Avatar initials={currentUser.initials} className="size-9" tone={entry.state === "free" ? "bg-violet" : entry.state === "maybe" ? "bg-cyan-300" : "bg-zinc-500"} /><span className="text-sm font-bold">Tu</span></div><p className={`mt-3 text-xs font-semibold ${entry.state === "free" ? "text-violet" : "text-zinc-400"}`}>{labels[entry.state]} · {formatDate(entry.date)}</p>{entry.note && <p className="mt-1 text-[11px] text-zinc-500">{entry.note}</p>}</div>)}
    </div></section>
  </>;
}
