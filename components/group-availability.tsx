"use client";

import { FormEvent, useMemo, useState } from "react";
import { PlusIcon } from "@/components/icons";
import { Avatar, SectionHeader, StatusDot } from "@/components/ui";
import { currentUser, groupMembers } from "@/data/mock-data";
import { GROUP_AVAILABILITY_STORAGE_KEY, useLocalStorageState } from "@/lib/circle-storage";

type AvailabilityStatus = "free" | "maybe" | "busy";
type Availability = {
  id: string;
  groupId: string;
  status: AvailabilityStatus;
  note: string;
  date: string;
  createdAt: string;
};

const statusLabels: Record<AvailabilityStatus, string> = {
  free: "Libero",
  maybe: "Forse",
  busy: "Occupato",
};

function toLocalDate(date: Date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function dateFromChoice(choice: "today" | "tomorrow" | "custom", customDate: string) {
  const date = new Date();
  if (choice === "tomorrow") date.setDate(date.getDate() + 1);
  return choice === "custom" ? customDate : toLocalDate(date);
}

function formatDate(value: string) {
  const today = toLocalDate(new Date());
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = toLocalDate(tomorrowDate);
  if (value === today) return "Oggi";
  if (value === tomorrow) return "Domani";
  return new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short" }).format(new Date(`${value}T12:00:00`));
}

export function GroupAvailability({ groupId, activeNow, emoji }: { groupId: string; activeNow: number; emoji: string }) {
  const [entries, setEntries] = useLocalStorageState<Availability[]>(GROUP_AVAILABILITY_STORAGE_KEY, []);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<AvailabilityStatus>("free");
  const [note, setNote] = useState("");
  const [dayChoice, setDayChoice] = useState<"today" | "tomorrow" | "custom">("today");
  const [customDate, setCustomDate] = useState(toLocalDate(new Date()));
  const groupEntries = useMemo(() => entries.filter((entry) => entry.groupId === groupId), [entries, groupId]);

  function addAvailability(event: FormEvent) {
    event.preventDefault();
    const date = dateFromChoice(dayChoice, customDate);
    if (!date) return;
    const entry: Availability = {
      id: `${groupId}-${Date.now()}`,
      groupId,
      status,
      note: note.trim(),
      date,
      createdAt: new Date().toISOString(),
    };
    setEntries((current) => [...current, entry]);
    setNote("");
    setOpen(false);
  }

  return <>
    <section className="rounded-[2rem] border border-violet/20 bg-gradient-to-br from-violet/[0.16] to-panel p-5"><div className="flex items-center justify-between"><div><p className="flex items-center gap-2 text-xs font-semibold text-violet"><StatusDot />{activeNow} persone attive</p><h2 className="mt-2 text-2xl font-bold">Chi c’è stasera?</h2></div><span className="text-4xl">{emoji}</span></div><button onClick={() => setOpen((value) => !value)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet py-3.5 text-sm font-bold text-white"><PlusIcon className="size-4" />Aggiungi disponibilità</button>
      {open && <form onSubmit={addAvailability} className="mt-4 border-t border-white/10 pt-4">
        <fieldset><legend className="text-xs font-bold text-zinc-300">Stato</legend><div className="mt-2 grid grid-cols-3 gap-2">{(["free", "maybe", "busy"] as AvailabilityStatus[]).map((value) => <button key={value} type="button" onClick={() => setStatus(value)} className={`rounded-xl border py-3 text-xs font-bold ${status === value ? "border-violet bg-violet text-white" : "border-white/10 bg-black/20 text-zinc-400"}`}>{statusLabels[value]}</button>)}</div></fieldset>
        <fieldset className="mt-4"><legend className="text-xs font-bold text-zinc-300">Giorno</legend><div className="mt-2 grid grid-cols-3 gap-2">{(["today", "tomorrow", "custom"] as const).map((value) => <button key={value} type="button" onClick={() => setDayChoice(value)} className={`rounded-xl border py-3 text-xs font-bold ${dayChoice === value ? "border-violet bg-violet text-white" : "border-white/10 bg-black/20 text-zinc-400"}`}>{value === "today" ? "Oggi" : value === "tomorrow" ? "Domani" : "Altra data"}</button>)}</div></fieldset>
        {dayChoice === "custom" && <input aria-label="Data personalizzata" type="date" min={toLocalDate(new Date())} value={customDate} onChange={(event) => setCustomDate(event.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet" />}
        <label htmlFor="availability-note" className="mt-4 block text-xs font-bold text-zinc-300">Nota opzionale</label><input id="availability-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={80} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet" placeholder="Es. dalle 20:30" />
        <div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-white/10 py-3 text-xs font-bold text-zinc-400">Annulla</button><button type="submit" className="rounded-xl bg-white py-3 text-xs font-bold text-black">Salva</button></div>
      </form>}
    </section>

    <section><SectionHeader title="Disponibilità" /><div className="grid grid-cols-2 gap-3">{groupMembers.map((member) => <div key={member.name} className="rounded-2xl border border-white/10 bg-panel p-3"><div className="flex items-center gap-2"><Avatar initials={member.initials} className="size-9" tone={member.state === "free" ? "bg-violet" : member.state === "later" ? "bg-cyan-300" : "bg-zinc-500"} /><span className="text-sm font-bold">{member.name}</span></div><p className={`mt-3 text-xs font-semibold ${member.state === "free" ? "text-violet" : "text-zinc-500"}`}>{member.availability}</p></div>)}
      {groupEntries.map((entry) => <div key={entry.id} className="rounded-2xl border border-violet/30 bg-panel p-3"><div className="flex items-center gap-2"><Avatar initials={currentUser.initials} className="size-9" tone={entry.status === "free" ? "bg-violet" : entry.status === "maybe" ? "bg-cyan-300" : "bg-zinc-500"} /><span className="text-sm font-bold">Tu</span></div><p className={`mt-3 text-xs font-semibold ${entry.status === "free" ? "text-violet" : "text-zinc-500"}`}>{statusLabels[entry.status]} · {formatDate(entry.date)}{entry.note ? ` · ${entry.note}` : ""}</p></div>)}
    </div></section>
  </>;
}
