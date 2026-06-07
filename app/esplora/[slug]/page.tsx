import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalIcon, PinIcon } from "@/components/icons";
import { PlaceVisual } from "@/components/place-card";
import { Avatar, PageHeader, StatusDot } from "@/components/ui";
import { places } from "@/data/mock-data";

export function generateStaticParams() { return places.map((place) => ({ slug: place.id })); }

export default async function PlaceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = places.find((item) => item.id === slug);
  if (!place) notFound();

  return <div className="pb-4"><PageHeader title={place.name} eyebrow={place.category} backHref="/esplora" />
    <PlaceVisual variant={place.image} className="mt-2 h-64 rounded-[2rem] border border-white/10" />
    <div className="mt-5 flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><span className={`size-2 rounded-full ${place.openNow ? "bg-lime" : "bg-zinc-600"}`} /><span className={`text-xs font-semibold ${place.openNow ? "text-lime" : "text-zinc-500"}`}>{place.openNow ? "Aperto ora" : "Chiuso ora"}</span></div><p className="mt-2 flex items-start gap-1.5 text-sm leading-5 text-zinc-400"><PinIcon className="mt-0.5 size-4 shrink-0" />{place.address}</p></div><span className="rounded-full border border-white/10 px-3 py-2 text-xs text-zinc-400">{place.distance}</span></div>
    <p className="mt-6 text-sm leading-6 text-zinc-300">{place.description}</p>
    <div className="mt-6 grid grid-cols-2 gap-3"><a href={place.mapsUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-bold text-black"><PinIcon className="size-4" />Google Maps</a><a href={place.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-panel py-3.5 text-sm font-bold">Instagram<ExternalIcon className="size-4" /></a></div>
    <section className="mt-8 rounded-3xl border border-white/10 bg-panel p-5"><div className="flex items-center justify-between"><div><h2 className="font-bold">Amici qui adesso</h2><p className="mt-1 text-xs text-zinc-500">Mostriamo solo persone che conosci</p></div><span className="flex items-center gap-1 rounded-full bg-lime/10 px-2.5 py-1 text-xs font-bold text-lime"><StatusDot />{place.friends.length}</span></div><div className="mt-5 space-y-4">{place.friends.map((friend, index) => <div key={friend} className="flex items-center gap-3"><Avatar initials={friend.slice(0, 2).toUpperCase()} className="size-11" tone={index % 2 ? "bg-cyan-300" : "bg-violet-300"} /><div className="flex-1"><p className="text-sm font-bold">{friend}</p><p className="text-xs text-zinc-500">Qui da circa {index + 1}h</p></div><Link href="/check-in" className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold">Raggiungi</Link></div>)}</div></section>
  </div>;
}
