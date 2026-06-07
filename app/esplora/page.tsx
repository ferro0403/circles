import { PinIcon, SearchIcon } from "@/components/icons";
import { PlaceCard } from "@/components/place-card";
import { PageHeader, Pill } from "@/components/ui";
import { categories, places } from "@/data/mock-data";

export default function ExplorePage() {
  return <div className="pb-4"><PageHeader title="Esplora" eyebrow="Riolo Terme" action={<button className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04]"><PinIcon className="size-5 text-lime" /></button>} />
    <div className="relative mt-2"><SearchIcon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-500" /><input className="w-full rounded-2xl border border-white/10 bg-panel py-4 pl-12 pr-4 text-sm outline-none placeholder:text-zinc-600 focus:border-lime/50" placeholder="Cerca un posto o un’attività" /></div>
    <div className="hide-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1"><Pill active>Tutto</Pill>{categories.map((category) => <Pill key={category}>{category}</Pill>)}</div>
    <div className="mt-8 flex items-end justify-between"><div><h2 className="text-lg font-bold">Posti vicino a te</h2><p className="mt-1 text-xs text-zinc-500">Solo luoghi con amici presenti</p></div><span className="text-xs font-semibold text-lime">{places.length} risultati</span></div>
    <div className="mt-4 space-y-4">{places.map((place) => <PlaceCard key={place.id} place={place} />)}</div>
  </div>;
}
