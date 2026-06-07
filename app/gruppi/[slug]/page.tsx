import { notFound } from "next/navigation";
import { CalendarIcon, ClockIcon, MoreIcon, PlusIcon } from "@/components/icons";
import { Avatar, PageHeader, SectionHeader, StatusDot } from "@/components/ui";
import { friends, futurePlans, groupMembers, groups } from "@/data/mock-data";
import { PollCreator } from "@/components/poll-creator";

export function generateStaticParams() { return groups.map((group) => ({ slug: group.id })); }

export default async function GroupDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const group = groups.find((item) => item.id === slug);
  if (!group) notFound();

  return <div className="space-y-8 pb-4"><PageHeader title={group.name} eyebrow={`${group.members} membri`} backHref="/gruppi" action={<button className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04]"><MoreIcon className="size-5" /></button>} />
    <section className="rounded-[2rem] border border-violet/20 bg-gradient-to-br from-violet/[0.16] to-panel p-5"><div className="flex items-center justify-between"><div><p className="flex items-center gap-2 text-xs font-semibold text-violet"><StatusDot />{group.activeNow} persone attive</p><h2 className="mt-2 text-2xl font-bold">Chi c’è stasera?</h2></div><span className="text-4xl">{group.emoji}</span></div><button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet py-3.5 text-sm font-bold text-white"><PlusIcon className="size-4" />Aggiungi disponibilità</button></section>

    <section><SectionHeader title="Disponibilità" /><div className="grid grid-cols-2 gap-3">{groupMembers.map((member) => <div key={member.name} className="rounded-2xl border border-white/10 bg-panel p-3"><div className="flex items-center gap-2"><Avatar initials={member.initials} className="size-9" tone={member.state === "free" ? "bg-violet" : member.state === "later" ? "bg-cyan-300" : "bg-zinc-500"} /><span className="text-sm font-bold">{member.name}</span></div><p className={`mt-3 text-xs font-semibold ${member.state === "free" ? "text-violet" : "text-zinc-500"}`}>{member.availability}</p></div>)}</div></section>

    <section><SectionHeader title="Cosa fanno adesso" /><div className="space-y-2">{friends.slice(0, 2).map((friend) => <div key={friend.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-panel p-3"><Avatar initials={friend.initials} className="size-11" tone={friend.color} /><div className="flex-1"><p className="text-sm font-bold">{friend.name} · <span className="font-normal text-zinc-400">{friend.activity}</span></p><p className="mt-1 text-xs text-zinc-500">{friend.place} · {friend.until}</p></div><StatusDot /></div>)}</div></section>

    <PollCreator initialTitle={group.poll?.title} initialVotes={group.poll?.votes} initialCloses={group.poll?.closes} />

    <section><SectionHeader title="Programmi futuri" /><div className="space-y-3">{futurePlans.map((plan) => <article key={plan.title} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-panel p-4"><div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/[0.05] text-center"><div><span className="block text-lg font-bold leading-none">{plan.day}</span><span className="text-[9px] font-bold text-violet">{plan.month}</span></div></div><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold">{plan.title}</h3><p className="mt-1 flex items-center gap-1 text-xs text-zinc-500"><ClockIcon className="size-3" />{plan.meta}</p><p className="mt-1 text-[11px] text-zinc-600">{plan.going} partecipanti</p></div><CalendarIcon className="size-5 text-zinc-600" /></article>)}</div></section>
  </div>;
}
