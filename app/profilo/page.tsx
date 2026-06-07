import Link from "next/link";
import { ChevronRightIcon, QrIcon, ShieldIcon, UserIcon } from "@/components/icons";
import { Avatar, PageHeader, StatusDot } from "@/components/ui";
import { currentUser } from "@/data/mock-data";

const settings = [
  { title: "Visibilità dello stato", value: "Solo amici", icon: UserIcon },
  { title: "Inviti ai gruppi", value: "Amici degli amici", icon: ShieldIcon },
  { title: "Notifiche", value: "Attive", icon: StatusDot },
];

export default function ProfilePage() {
  return <div className="pb-4"><PageHeader title="Profilo" eyebrow="Il tuo spazio" />
    <section className="mt-4 flex flex-col items-center rounded-[2rem] border border-white/10 bg-panel p-6 text-center"><div className="relative"><Avatar initials={currentUser.initials} className="size-24 text-2xl" tone="bg-violet" /><span className="absolute bottom-1 right-1 size-4 rounded-full border-4 border-panel bg-violet" /></div><h2 className="mt-4 text-2xl font-bold">{currentUser.name}</h2><p className="mt-1 text-sm font-semibold text-violet">{currentUser.nickname}</p><p className="mt-3 max-w-xs text-sm text-zinc-500">Riolo Terme · Nel gruppo dal 2026</p><Link href="/avatar" className="mt-5 rounded-full bg-violet px-5 py-2.5 text-xs font-bold text-white shadow-glow">Crea il tuo avatar</Link></section>

    <section className="mt-5 rounded-3xl border border-white/10 bg-white p-5 text-black"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Il tuo Circle code</p><h3 className="mt-1 text-lg font-bold">Fatti aggiungere</h3></div><QrIcon className="size-20" /></div><p className="mt-3 text-xs leading-5 text-zinc-500">Mostra questo codice a un amico per connettervi su Circle.</p></section>

    <section className="mt-8"><div className="mb-3 flex items-center gap-2"><ShieldIcon className="size-4 text-violet" /><h2 className="text-lg font-bold">Privacy e impostazioni</h2></div><div className="overflow-hidden rounded-3xl border border-white/10 bg-panel">{settings.map((setting, index) => { const Icon = setting.icon; return <button key={setting.title} className={`flex w-full items-center gap-3 p-4 text-left ${index ? "border-t border-white/[0.07]" : ""}`}><span className="grid size-10 place-items-center rounded-xl bg-white/[0.05]"><Icon className="size-4 text-violet" /></span><span className="flex-1"><span className="block text-sm font-semibold">{setting.title}</span><span className="mt-0.5 block text-xs text-zinc-500">{setting.value}</span></span><ChevronRightIcon className="size-5 text-zinc-600" /></button>; })}</div></section>
    <p className="mt-8 text-center text-[11px] text-zinc-700">Circle demo · Versione 0.1</p>
  </div>;
}
