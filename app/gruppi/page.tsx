import { PlusIcon, UsersIcon } from "@/components/icons";
import { PageHeader } from "@/components/ui";
import { GroupList } from "@/components/group-list";

export default function GroupsPage() {
  return <div className="pb-4"><PageHeader title="I tuoi gruppi" eyebrow="Organizzati insieme" action={<button className="grid size-10 place-items-center rounded-full bg-violet text-white"><PlusIcon className="size-5" /></button>} />
    <div className="mt-4 rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-800 to-panel p-5"><div className="grid size-11 place-items-center rounded-2xl bg-violet text-white"><UsersIcon className="size-5" /></div><h2 className="mt-4 text-xl font-bold">La prossima uscita nasce qui.</h2><p className="mt-2 text-sm leading-6 text-zinc-400">Guarda chi è libero, proponi un programma e votate insieme. Senza chat infinite.</p></div>
    <GroupList />
  </div>;
}
