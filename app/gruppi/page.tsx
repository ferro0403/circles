import Link from "next/link";
import { ChevronRightIcon, PlusIcon, UsersIcon } from "@/components/icons";
import { PageHeader, StatusDot } from "@/components/ui";
import { groups } from "@/data/mock-data";

export default function GroupsPage() {
  return <div className="pb-4"><PageHeader title="I tuoi gruppi" eyebrow="Organizzati insieme" action={<button className="grid size-10 place-items-center rounded-full bg-violet text-white"><PlusIcon className="size-5" /></button>} />
    <div className="mt-4 rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-800 to-panel p-5"><div className="grid size-11 place-items-center rounded-2xl bg-violet text-white"><UsersIcon className="size-5" /></div><h2 className="mt-4 text-xl font-bold">La prossima uscita nasce qui.</h2><p className="mt-2 text-sm leading-6 text-zinc-400">Guarda chi è libero, proponi un programma e votate insieme. Senza chat infinite.</p></div>
    <div className="mt-7 space-y-3">{groups.map((group) => <Link key={group.id} href={`/gruppi/${group.id}`} className="block rounded-3xl border border-white/10 bg-panel p-5 transition hover:border-white/20"><div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-white/[0.05] text-xl">{group.emoji}</span><div className="min-w-0 flex-1"><h2 className="truncate font-bold">{group.name}</h2><p className="mt-1 text-xs text-zinc-500">{group.members} membri</p></div><ChevronRightIcon className="size-5 text-zinc-600" /></div><div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-4"><span className="flex items-center gap-2 text-xs text-zinc-300"><StatusDot />{group.activeNow ? `${group.activeNow} attivi adesso` : "Nessuno attivo"}</span><span className="text-xs text-zinc-500">{group.nextPlan}</span></div>{group.poll && <div className="mt-3 rounded-xl bg-violet/[0.07] px-3 py-2 text-xs font-semibold text-violet">Sondaggio attivo · {group.poll.votes} voti</div>}</Link>)}</div>
  </div>;
}
