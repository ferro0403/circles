"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRightIcon } from "@/components/icons";
import { StatusDot } from "@/components/ui";
import { groups } from "@/data/mock-data";
import { POLLS_EVENT, readPolls, SavedPoll } from "@/components/poll-creator";

export function GroupList() {
  const [savedPolls, setSavedPolls] = useState<SavedPoll[]>([]);

  useEffect(() => {
    const sync = () => setSavedPolls(readPolls());
    sync();
    window.addEventListener(POLLS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(POLLS_EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);

  return <div className="mt-7 space-y-3">{groups.map((group) => {
    const localPolls = savedPolls.filter((poll) => poll.groupId === group.id);
    const latestPoll = localPolls.at(-1);
    return <Link key={group.id} href={`/gruppi/${group.id}`} className="block rounded-3xl border border-white/10 bg-panel p-5 transition hover:border-white/20"><div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-white/[0.05] text-xl">{group.emoji}</span><div className="min-w-0 flex-1"><h2 className="truncate font-bold">{group.name}</h2><p className="mt-1 text-xs text-zinc-500">{group.members} membri</p></div><ChevronRightIcon className="size-5 text-zinc-600" /></div><div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-4"><span className="flex items-center gap-2 text-xs text-zinc-300"><StatusDot />{group.activeNow ? `${group.activeNow} attivi adesso` : "Nessuno attivo"}</span><span className="text-xs text-zinc-500">{latestPoll ? `${latestPoll.date} · ${latestPoll.time}` : group.nextPlan}</span></div>{(group.poll || latestPoll) && <div className="mt-3 rounded-xl bg-violet/[0.07] px-3 py-2 text-xs font-semibold text-violet">{latestPoll ? `Sondaggio attivo · ${latestPoll.title}` : `Sondaggio attivo · ${group.poll?.votes} voti`}</div>}</Link>;
  })}</div>;
}
