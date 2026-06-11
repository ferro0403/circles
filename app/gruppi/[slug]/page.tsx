import { notFound } from "next/navigation";
import { CalendarIcon, ClockIcon, MoreIcon } from "@/components/icons";
import { Avatar, PageHeader, SectionHeader, StatusDot } from "@/components/ui";
import { friends, futurePlans, groups } from "@/data/mock-data";
import { PollCreator } from "@/components/poll-creator";
import { GroupAvailability } from "@/components/group-availability";

export function generateStaticParams() { return groups.map((group) => ({ slug: group.id })); }

export default async function GroupDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const group = groups.find((item) => item.id === slug);
  if (!group) notFound();

  return <div className="space-y-8 pb-4"><PageHeader title={group.name} eyebrow={`${group.members} membri`} backHref="/gruppi" action={<button className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04]"><MoreIcon className="size-5" /></button>} />
    <GroupAvailability groupId={group.id} activeNow={group.activeNow} emoji={group.emoji} />

    <section><SectionHeader title="Cosa fanno adesso" /><div className="space-y-2">{friends.slice(0, 2).map((friend) => <div key={friend.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-panel p-3"><Avatar initials={friend.initials} className="size-11" tone={friend.color} /><div className="flex-1"><p className="text-sm font-bold">{friend.name} · <span className="font-normal text-zinc-400">{friend.activity}</span></p><p className="mt-1 text-xs text-zinc-500">{friend.place} · {friend.until}</p></div><StatusDot /></div>)}</div></section>

    <PollCreator groupId={group.id} initialTitle={group.poll?.title} initialVotes={group.poll?.votes} initialCloses={group.poll?.closes} />

    <section><SectionHeader title="Programmi futuri" /><div className="space-y-3">{futurePlans.map((plan) => <article key={plan.title} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-panel p-4"><div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/[0.05] text-center"><div><span className="block text-lg font-bold leading-none">{plan.day}</span><span className="text-[9px] font-bold text-violet">{plan.month}</span></div></div><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold">{plan.title}</h3><p className="mt-1 flex items-center gap-1 text-xs text-zinc-500"><ClockIcon className="size-3" />{plan.meta}</p><p className="mt-1 text-[11px] text-zinc-600">{plan.going} partecipanti</p></div><CalendarIcon className="size-5 text-zinc-600" /></article>)}</div></section>
  </div>;
}
