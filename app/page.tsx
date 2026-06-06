import Link from "next/link";
import { BellIcon, ChevronRightIcon, ClockIcon, PinIcon } from "@/components/icons";
import { PlaceCard } from "@/components/place-card";
import { Avatar, SectionHeader, StatusDot } from "@/components/ui";
import { currentUser, friends, groups, places } from "@/data/mock-data";

export default function HomePage() {
  return (
    <div className="space-y-8 pb-4">
      <header className="flex items-center justify-between py-4">
        <div><p className="text-xs text-zinc-500">Sei a</p><button className="mt-0.5 flex items-center gap-1.5 text-xl font-bold"><PinIcon className="size-4 text-lime" />{currentUser.city}<ChevronRightIcon className="size-4 text-zinc-600" /></button></div>
        <button className="relative grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04]" aria-label="Notifiche"><BellIcon className="size-5" /><span className="absolute right-2 top-2 size-2 rounded-full border-2 border-ink bg-lime" /></button>
      </header>

      <section className="relative overflow-hidden rounded-[2rem] border border-lime/20 bg-gradient-to-br from-[#1b2015] via-panel to-panel p-5 shadow-glow">
        <div className="absolute -right-12 -top-12 size-36 rounded-full bg-lime/10 blur-2xl" />
        <div className="relative flex items-start gap-4"><Avatar initials={currentUser.initials} className="size-14 text-sm" tone="bg-lime" /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="text-xs font-semibold text-zinc-400">Il tuo stato</p><StatusDot /></div><h1 className="mt-1 text-xl font-bold leading-tight">{currentUser.status}</h1><p className="mt-1 flex items-center gap-1 text-xs text-zinc-500"><ClockIcon className="size-3.5" />{currentUser.statusUntil}</p></div></div>
        <Link href="/check-in" className="relative mt-5 flex items-center justify-between rounded-2xl bg-lime px-4 py-3.5 text-sm font-bold text-black">Aggiorna il tuo stato<ChevronRightIcon className="size-5" /></Link>
      </section>

      <section><SectionHeader title="Amici attivi" href="/esplora" /><div className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">{friends.map((friend) => <article key={friend.id} className="min-w-[155px] rounded-3xl border border-white/10 bg-panel p-4"><div className="flex items-start justify-between"><Avatar initials={friend.initials} className="size-11" tone={friend.color} /><StatusDot className="mt-1" /></div><h3 className="mt-4 text-sm font-bold">{friend.name}</h3><p className="mt-1 text-xs font-semibold text-zinc-200">{friend.activity}</p><p className="mt-0.5 truncate text-[11px] text-zinc-500">{friend.place} · {friend.until}</p></article>)}</div></section>

      <section><SectionHeader title="Nei tuoi gruppi" href="/gruppi" />
        <div className="space-y-3">{groups.filter((group) => group.poll).slice(0, 2).map((group) => <Link key={group.id} href={`/gruppi/${group.id}`} className="block rounded-3xl border border-white/10 bg-panel p-4"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-white/[0.06] text-xl">{group.emoji}</span><div className="flex-1"><h3 className="text-sm font-bold">{group.name}</h3><p className="text-[11px] text-zinc-500">{group.members} membri · {group.activeNow} attivi ora</p></div><ChevronRightIcon className="size-5 text-zinc-600" /></div><div className="mt-4 rounded-2xl bg-white/[0.04] p-3"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold">{group.poll?.title}</p><span className="rounded-full bg-lime/10 px-2 py-1 text-[10px] font-bold text-lime">SONDAGGIO</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800"><div className="h-full w-2/3 rounded-full bg-lime" /></div><p className="mt-2 text-[10px] text-zinc-500">{group.poll?.votes} voti · {group.poll?.closes}</p></div></Link>)}</div>
      </section>

      <section><SectionHeader title="Popolari a Riolo" href="/esplora" /><div className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">{places.map((place) => <PlaceCard key={place.id} place={place} compact />)}</div></section>
    </div>
  );
}
