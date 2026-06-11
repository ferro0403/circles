import { BellIcon, ChevronRightIcon, PinIcon } from "@/components/icons";
import { PlaceCard } from "@/components/place-card";
import { Avatar, SectionHeader, StatusDot } from "@/components/ui";
import { currentUser, friends, places } from "@/data/mock-data";
import { PersonalStatus } from "@/components/personal-status";
import { HomeGroupPolls } from "@/components/group-poll-summary";

export default function HomePage() {
  return (
    <div className="space-y-8 pb-4">
      <header className="flex items-center justify-between py-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-violet">Circle</p>
          <button className="mt-1 flex items-center gap-2 text-xl font-bold tracking-tight">
            <PinIcon className="size-4 text-violet" />
            {currentUser.city}
            <span className="ml-1 text-sm font-semibold text-zinc-500">26°</span>
            <ChevronRightIcon className="size-4 text-zinc-700" />
          </button>
        </div>
        <button className="relative grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.05] shadow-card" aria-label="Notifiche"><BellIcon className="size-5" /><span className="absolute right-2.5 top-2.5 size-2 rounded-full border-2 border-ink bg-violet shadow-glow" /></button>
      </header>

      <PersonalStatus />

      <section><SectionHeader title="Amici attivi" href="/esplora" /><div className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">{friends.map((friend) => <article key={friend.id} className="min-w-[155px] rounded-3xl border border-white/10 bg-panel p-4"><div className="flex items-start justify-between"><Avatar initials={friend.initials} className="size-11" tone={friend.color} /><StatusDot className="mt-1" /></div><h3 className="mt-4 text-sm font-bold">{friend.name}</h3><p className="mt-1 text-xs font-semibold text-zinc-200">{friend.activity}</p><p className="mt-0.5 truncate text-[11px] text-zinc-500">{friend.place} · {friend.until}</p></article>)}</div></section>

      <section><SectionHeader title="Nei tuoi gruppi" href="/gruppi" /><HomeGroupPolls /></section>

      <section><SectionHeader title="Popolari a Riolo" href="/esplora" /><div className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">{places.map((place) => <PlaceCard key={place.id} place={place} compact />)}</div></section>
    </div>
  );
}
