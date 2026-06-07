"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckIcon, ChevronRightIcon, ClockIcon, PencilIcon } from "@/components/icons";
import { Avatar, StatusDot } from "@/components/ui";
import { currentUser } from "@/data/mock-data";

const presets = ["Libero", "Occupato", "Studio", "Lavoro", "Aperitivo", "Sport"];

export function PersonalStatus() {
  const [status, setStatus] = useState(currentUser.status);
  const [draft, setDraft] = useState(currentUser.status);
  const [editing, setEditing] = useState(false);

  function saveStatus(event: FormEvent) {
    event.preventDefault();
    const nextStatus = draft.trim();
    if (!nextStatus) return;
    setStatus(nextStatus);
    setEditing(false);
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-violet/25 bg-gradient-to-br from-violet/[0.18] via-[#17121f] to-panel p-5 shadow-card">
      <div className="absolute -right-10 -top-14 size-40 rounded-full bg-violet/20 blur-3xl" />
      <div className="relative flex items-start gap-4">
        <Avatar initials={currentUser.initials} className="size-14 text-sm text-white" tone="bg-gradient-to-br from-violet to-fuchsia-500" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400"><StatusDot />Il tuo stato</div>
          <h1 className="mt-1.5 text-xl font-bold leading-tight">{status}</h1>
          <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500"><ClockIcon className="size-3.5" />{currentUser.statusUntil}</p>
        </div>
        <button onClick={() => setEditing((value) => !value)} className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:border-violet/50 hover:text-white" aria-label="Modifica stato"><PencilIcon className="size-4" /></button>
      </div>

      {editing ? (
        <form onSubmit={saveStatus} className="relative mt-5 border-t border-white/10 pt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Scegli un preset</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {presets.map((preset) => <button key={preset} type="button" onClick={() => setDraft(preset)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${draft === preset ? "border-violet bg-violet text-white" : "border-white/10 bg-white/[0.04] text-zinc-400"}`}>{preset}</button>)}
          </div>
          <label className="mt-4 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500" htmlFor="custom-status">Oppure scrivi il tuo</label>
          <div className="mt-2 flex gap-2">
            <input id="custom-status" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={48} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none transition focus:border-violet" placeholder="Cosa stai facendo?" />
            <button type="submit" className="grid size-11 shrink-0 place-items-center rounded-xl bg-violet text-white shadow-glow" aria-label="Salva stato"><CheckIcon className="size-5" /></button>
          </div>
        </form>
      ) : (
        <Link href="/check-in" className="relative mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm font-bold transition hover:border-violet/40">Condividi dove sei<ChevronRightIcon className="size-5 text-violet" /></Link>
      )}
    </section>
  );
}
