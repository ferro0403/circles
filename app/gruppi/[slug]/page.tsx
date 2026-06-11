import { notFound } from "next/navigation";
import { MoreIcon } from "@/components/icons";
import { Avatar, PageHeader, SectionHeader, StatusDot } from "@/components/ui";
import { friends, groups } from "@/data/mock-data";
import { PollCreator } from "@/components/poll-creator";
import { GroupAvailability } from "@/components/group-availability";
import { GroupPlans } from "@/components/group-plans";

export function generateStaticParams() { return groups.map((group) => ({ slug: group.id })); }

export default async function GroupDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const group = groups.find((item) => item.id === slug);
  if (!group) notFound();

  return <div className="space-y-8 pb-4"><PageHeader title={group.name} eyebrow={`${group.members} membri`} backHref="/gruppi" action={<button className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04]"><MoreIcon className="size-5" /></button>} />
    <section className="rounded-[2rem] border border-violet/20 bg-gradient-to-br from-violet/[0.16] to-panel p-5"><div className="flex items-center justify-between"><div><p className="flex items-center gap-2 text-xs font-semibold text-violet"><StatusDot />{group.activeNow} persone attive</p><h2 className="mt-2 text-2xl font-bold">Chi c’è stasera?</h2></div><span className="text-4xl">{group.emoji}</span></div></section>

    <GroupAvailability groupId={group.id} />

    <section><SectionHeader title="Cosa fanno adesso" /><div className="space-y-2">{friends.slice(0, 2).map((friend) => <div key={friend.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-panel p-3"><Avatar initials={friend.initials} className="size-11" tone={friend.color} /><div className="flex-1"><p className="text-sm font-bold">{friend.name} · <span className="font-normal text-zinc-400">{friend.activity}</span></p><p className="mt-1 text-xs text-zinc-500">{friend.place} · {friend.until}</p></div><StatusDot /></div>)}</div></section>

    <PollCreator groupId={group.id} initialTitle={group.poll?.title} initialVotes={group.poll?.votes} initialCloses={group.poll?.closes} />

    <GroupPlans groupId={group.id} />
  </div>;
}
