"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CheckIcon, ChevronRightIcon, ClockIcon, PencilIcon } from "@/components/icons";
import { StatusDot } from "@/components/ui";
import { SavedAvatar } from "@/components/local-profile";
import { currentUser } from "@/data/mock-data";

export const STATUS_STORAGE_KEY = "circle.status.v1";
const STATUS_EVENT = "circle-status-updated";
const presets = ["Libero", "Occupato", "Studio", "Lavoro", "Aperitivo", "Sport"];

type SavedStatus = { value: string };

function readStatus() {
  try {
    const stored = window.localStorage.getItem(STATUS_STORAGE_KEY);
    if (!stored) return currentUser.status;
    const parsed = JSON.parse(stored) as SavedStatus;
    return typeof parsed.value === "string" ? parsed.value : currentUser.status;
  } catch {
    return currentUser.status;
  }
}

function persistStatus(value: string) {
  window.localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify({ value } satisfies SavedStatus));
  window.dispatchEvent(new Event(STATUS_EVENT));
}

export function SavedPersonalStatus() {
  const [status, setStatus] = useState(currentUser.status);

  useEffect(() => {
    const sync = () => setStatus(readStatus());
    sync();
    window.addEventListener(STATUS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(STATUS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return <p className="mt-3 text-sm font-semibold text-zinc-300">{status || "Nessuno stato impostato"}</p>;
}

export function PersonalStatus() {
  const [status, setStatus] = useState(currentUser.status);
  const [draft, setDraft] = useState(currentUser.status);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const savedStatus = readStatus();
    setStatus(savedStatus);
    setDraft(savedStatus);
  }, []);

  function saveStatus(event: FormEvent) {
    event.preventDefault();
    const nextStatus = draft.trim();
    if (!nextStatus) return;
    persistStatus(nextStatus);
    setStatus(nextStatus);
    setDraft(nextStatus);
    setEditing(false);
  }

  function removeStatus() {
    persistStatus("");
    setStatus("");
    setDraft("");
    setEditing(false);
  }

  function toggleEditing() {
    setDraft(status);
    setEditing((value) => !value);
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-violet/25 bg-gradient-to-br from-violet/[0.18] via-panel to-panel p-5 shadow-card">
      <div className="absolute -right-10 -top-10 size-32 rounded-full bg-violet/20 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <div className="relative">
          <SavedAvatar initials={currentUser.initials} className="size-14" tone="bg-violet" />
          <StatusDot className="absolute -bottom-0.5 -right-0.5 ring-4 ring-panel" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet">Il tuo stato</p><ClockIcon className="size-3 text-zinc-500" /></div>
          <h2 className="mt-1 truncate text-lg font-bold">{status || "Nessuno stato impostato"}</h2>
          {status && <p className="text-xs text-zinc-500">{currentUser.statusUntil}</p>}
        </div>
        <button onClick={toggleEditing} className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:border-violet/50 hover:text-white" aria-label="Modifica stato"><PencilIcon className="size-4" /></button>
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
          {status && <button type="button" onClick={removeStatus} className="mt-3 text-xs font-semibold text-zinc-500">Rimuovi stato</button>}
        </form>
      ) : (
        <Link href="/check-in" className="relative mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-sm font-bold transition hover:border-violet/40">Condividi dove sei<ChevronRightIcon className="size-5 text-violet" /></Link>
      )}
    </section>
  );
}
