import { notFound } from "next/navigation";
import { CalendarIcon, CheckIcon, ClockIcon, MoreIcon, PlusIcon } from "@/components/icons";
import { Avatar, PageHeader, SectionHeader, StatusDot } from "@/components/ui";
import { friends, futurePlans, groupMembers, groups } from "@/data/mock-data";

export function generateStaticParams() { return groups.map((group) => ({ slug: group.id })); }

export default async function GroupDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const group = groups.find((item) => item.id === slug);
  if (!group) notFound();

  return <div className="space-y-8 pb-4"><PageHeader title={group.name} eyebrow={`${group.members} membri`} backHref="/gruppi" action={<button className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04]"><MoreIcon className="size-5" /></button>} />
    <section className="rounded-[2rem] border border-lime/20 bg-gradient-to-br from-[#1c2115] to-panel p-5"><div className="flex items-center justify-between"><div><p className="flex items-center gap-2 text-xs font-semibold text-lime"><StatusDot />{group.activeNow} persone attive</p><h2 className="mt-2 text-2xl font-bold">Chi c’è stasera?</h2></div><span className="text-4xl">{group.emoji}</span></div><button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-lime py-3.5 text-sm font-bold text-black"><PlusIcon className="size-4" />Aggiungi disponibilità</button></section>

    <section><SectionHeader title="Disponibilità" /><div className="grid grid-cols-2 gap-3">{groupMembers.map((member) => <div key={member.name} className="rounded-2xl border border-white/10 bg-panel p-3"><div className="flex items-center gap-2"><Avatar initials={member.initials} className="size-9" tone={member.state === "free" ? "bg-lime" : member.state === "later" ? "bg-cyan-300" : "bg-zinc-500"} /><span className="text-sm font-bold">{member.name}</span></div><p className={`mt-3 text-xs font-semibold ${member.state === "free" ? "text-lime" : "text-zinc-500"}`}>{member.availability}</p></div>)}</div></section>

    <section><SectionHeader title="Cosa fanno adesso" /><div className="space-y-2">{friends.slice(0, 2).map((friend) => <div key={friend.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-panel p-3"><Avatar initials={friend.initials} className="size-11" tone={friend.color} /><div className="flex-1"><p className="text-sm font-bold">{friend.name} · <span className="font-normal text-zinc-400">{friend.activity}</span></p><p className="mt-1 text-xs text-zinc-500">{friend.place} · {friend.until}</p></div><StatusDot /></div>)}</div></section>

    {group.poll && <section><SectionHeader title="Sondaggio attivo" /><div className="rounded-3xl border border-white/10 bg-panel p-5"><span className="rounded-full bg-lime/10 px-2.5 py-1 text-[10px] font-bold text-lime">SCELTA DI GRUPPO</span><h3 className="mt-4 text-lg font-bold">{group.poll.title}</h3><div className="mt-4 space-y-2">{[{ name: "Da Mario", percent: 67 }, { name: "Agriturismo Rio Verde", percent: 22 }, { name: "Pizza al parco", percent: 11 }].map((option, index) => <button key={option.name} className="relative flex w-full overflow-hidden rounded-xl bg-white/[0.05] px-3 py-3 text-left text-xs font-semibold"><span className="absolute inset-y-0 left-0 bg-lime/10" style={{ width: `${option.percent}%` }} /><span className="relative flex-1">{option.name}</span><span className="relative flex items-center gap-1 text-zinc-500">{index === 0 && <CheckIcon className="size-3 text-lime" />}{option.percent}%</span></button>)}</div><p className="mt-4 text-xs text-zinc-500">{group.poll.votes} voti · {group.poll.closes}</p></div></section>}

    <section><SectionHeader title="Programmi futuri" /><div className="space-y-3">{futurePlans.map((plan) => <article key={plan.title} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-panel p-4"><div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/[0.05] text-center"><div><span className="block text-lg font-bold leading-none">{plan.day}</span><span className="text-[9px] font-bold text-lime">{plan.month}</span></div></div><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold">{plan.title}</h3><p className="mt-1 flex items-center gap-1 text-xs text-zinc-500"><ClockIcon className="size-3" />{plan.meta}</p><p className="mt-1 text-[11px] text-zinc-600">{plan.going} partecipanti</p></div><CalendarIcon className="size-5 text-zinc-600" /></article>)}</div></section>
  </div>;
}
