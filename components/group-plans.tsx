"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, ClockIcon } from "@/components/icons";
import { SectionHeader } from "@/components/ui";
import { futurePlans } from "@/data/mock-data";
import { POLLS_EVENT, readPolls, SavedPoll } from "@/components/poll-creator";

function dateParts(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return {
    day: new Intl.DateTimeFormat("it-IT", { day: "2-digit" }).format(date),
    month: new Intl.DateTimeFormat("it-IT", { month: "short" }).format(date).replace(".", "").toUpperCase(),
    label: new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long" }).format(date),
  };
}

export function GroupPlans({ groupId }: { groupId: string }) {
  const [polls, setPolls] = useState<SavedPoll[]>([]);

  useEffect(() => {
    const sync = () => setPolls(readPolls().filter((poll) => poll.groupId === groupId));
    sync();
    window.addEventListener(POLLS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(POLLS_EVENT, sync); window.removeEventListener("storage", sync); };
  }, [groupId]);

  const savedPlans = polls.map((poll) => {
    const parts = dateParts(poll.date);
    return { id: poll.id, day: parts.day, month: parts.month, title: poll.proposal, meta: `${parts.label} · ${poll.time}`, going: 0 };
  });

  return <section><SectionHeader title="Programmi futuri" /><div className="space-y-3">{[...savedPlans, ...futurePlans.map((plan) => ({ ...plan, id: `mock-${plan.title}` }))].map((plan) => <article key={plan.id} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-panel p-4"><div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/[0.05] text-center"><div><span className="block text-lg font-bold leading-none">{plan.day}</span><span className="text-[9px] font-bold text-violet">{plan.month}</span></div></div><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold">{plan.title}</h3><p className="mt-1 flex items-center gap-1 text-xs text-zinc-500"><ClockIcon className="size-3" />{plan.meta}</p><p className="mt-1 text-[11px] text-zinc-600">{plan.going} partecipanti</p></div><CalendarIcon className="size-5 text-zinc-600" /></article>)}</div></section>;
}
