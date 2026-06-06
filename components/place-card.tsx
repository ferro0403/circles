import Link from "next/link";
import type { Place } from "@/data/mock-data";
import { Avatar, StatusDot } from "@/components/ui";
import { PinIcon } from "@/components/icons";

export function PlaceVisual({ variant, className = "" }: { variant: string; className?: string }) {
  const styles: Record<string, string> = {
    cinema: "from-indigo-950 via-violet-800 to-rose-500",
    bar: "from-amber-900 via-orange-600 to-lime-300",
    gym: "from-slate-900 via-cyan-800 to-cyan-300",
    restaurant: "from-red-950 via-rose-800 to-amber-400",
  };
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${styles[variant] ?? styles.cinema} ${className}`} role="img" aria-label="Immagine segnaposto attività">
      <div className="absolute -right-8 -top-8 size-28 rounded-full border-[18px] border-white/10" />
      <div className="absolute bottom-3 left-4 h-1 w-16 rounded-full bg-white/35" />
      <div className="absolute bottom-6 left-4 h-1 w-10 rounded-full bg-white/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
}

export function PlaceCard({ place, compact = false }: { place: Place; compact?: boolean }) {
  return (
    <Link href={`/esplora/${place.id}`} className={`group block overflow-hidden rounded-3xl border border-white/10 bg-panel transition hover:border-white/20 ${compact ? "min-w-[245px]" : ""}`}>
      <PlaceVisual variant={place.image} className={compact ? "h-28" : "h-36"} />
      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-3">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-lime">{place.category}</p><h3 className="mt-0.5 font-bold text-white">{place.name}</h3></div>
          <span className="mt-1 text-xs text-zinc-500">{place.distance}</span>
        </div>
        <p className="flex items-center gap-1 text-xs text-zinc-500"><PinIcon className="size-3.5" />{place.address.split(",")[0]}</p>
        {place.friends.length > 0 && <div className="mt-3 flex items-center"><div className="flex -space-x-2">{place.friends.slice(0, 3).map((friend, index) => <Avatar key={friend} initials={friend.slice(0, 2).toUpperCase()} className="size-7 border-2 border-panel text-[8px]" tone={index % 2 ? "bg-cyan-300" : "bg-violet-300"} />)}</div><p className="ml-2 flex items-center gap-1 text-[11px] text-zinc-400"><StatusDot />{place.friends.join(" e ")} qui</p></div>}
      </div>
    </Link>
  );
}
