"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { groups } from "@/data/mock-data";
import { POLLS_STORAGE_KEY, useLocalStorageState } from "@/lib/circle-storage";
import type { StoredPoll } from "@/components/poll-creator";

export function GroupPollBadge({ groupId, mockVotes }: { groupId: string; mockVotes?: number }) {
  const [polls] = useLocalStorageState<StoredPoll[]>(POLLS_STORAGE_KEY, []);
  const localCount = polls.filter((poll) => poll.groupId === groupId).length;
  if (!localCount && mockVotes === undefined) return null;
  return <div className="mt-3 rounded-xl bg-violet/[0.07] px-3 py-2 text-xs font-semibold text-violet">{localCount ? `${localCount} sondaggi salvati` : `Sondaggio attivo · ${mockVotes} voti`}</div>;
}

export function HomeGroupPolls() {
  const [polls] = useLocalStorageState<StoredPoll[]>(POLLS_STORAGE_KEY, []);
  const groupsWithPolls = groups.map((group) => {
    const localPoll = polls.find((poll) => poll.groupId === group.id);
    return { group, localPoll };
  }).filter(({ group, localPoll }) => localPoll || group.poll).slice(0, 2);

  return <div className="space-y-3">{groupsWithPolls.map(({ group, localPoll }) => {
    const title = localPoll?.title ?? group.poll?.title;
    const votes = group.poll?.votes ?? 0;
    return <Link key={group.id} href={`/gruppi/${group.id}`} className="block rounded-3xl border border-white/10 bg-panel p-4"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-white/[0.06] text-xl">{group.emoji}</span><div className="flex-1"><h3 className="text-sm font-bold">{group.name}</h3><p className="text-[11px] text-zinc-500">{group.members} membri · {group.activeNow} attivi ora</p></div><ChevronRightIcon className="size-5 text-zinc-600" /></div><div className="mt-4 rounded-2xl bg-white/[0.04] p-3"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold">{title}</p><span className="rounded-full bg-violet/10 px-2 py-1 text-[10px] font-bold text-violet">SONDAGGIO</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800"><div className="h-full w-2/3 rounded-full bg-violet" /></div><p className="mt-2 text-[10px] text-zinc-500">{localPoll ? "Salvato su questo dispositivo" : `${votes} voti · ${group.poll?.closes}`}</p></div></Link>;
  })}</div>;
}
