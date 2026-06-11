"use client";

import Link from "next/link";
import { useState } from "react";
import { BellIcon, CalendarIcon, CheckIcon, PinIcon, UsersIcon } from "@/components/icons";
import { NOTIFICATIONS_STORAGE_KEY, useLocalStorageState } from "@/lib/circle-storage";

type NotificationType = "friend-request" | "group-invite" | "new-poll" | "new-check-in";

type CircleNotification = {
  id: string;
  type: NotificationType;
  title: string;
  detail: string;
  time: string;
  href: string;
  read: boolean;
};

const initialNotifications: CircleNotification[] = [
  { id: "friend-sofia", type: "friend-request", title: "Richiesta di amicizia", detail: "Sofia vuole aggiungerti agli amici.", time: "5 min fa", href: "/profilo", read: false },
  { id: "group-calcetto", type: "group-invite", title: "Invito al gruppo", detail: "Marco ti ha invitato a Calcetto del giovedì.", time: "20 min fa", href: "/gruppi/calcetto", read: false },
  { id: "poll-riolo", type: "new-poll", title: "Nuovo sondaggio", detail: "Compagnia Riolo: Dove andiamo sabato?", time: "1 ora fa", href: "/gruppi/compagnia-riolo", read: false },
  { id: "check-in-parco", type: "new-check-in", title: "Nuovo check-in", detail: "Sofia è da Al Parco per un aperitivo.", time: "2 ore fa", href: "/esplora/al-parco", read: true },
];

const notificationLabels: Record<NotificationType, string> = {
  "friend-request": "AMICIZIA",
  "group-invite": "GRUPPO",
  "new-poll": "SONDAGGIO",
  "new-check-in": "CHECK-IN",
};

function NotificationIcon({ type }: { type: NotificationType }) {
  const className = "size-4";
  if (type === "new-poll") return <CalendarIcon className={className} />;
  if (type === "new-check-in") return <PinIcon className={className} />;
  return <UsersIcon className={className} />;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useLocalStorageState<CircleNotification[]>(NOTIFICATIONS_STORAGE_KEY, initialNotifications);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  function markAsRead(id: string) {
    setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, read: true } : notification));
  }

  function markAllAsRead() {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  }

  return <>
    <button onClick={() => setOpen(true)} className="relative grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.05] shadow-card" aria-label={`Notifiche${unreadCount ? `, ${unreadCount} non lette` : ""}`} aria-expanded={open}>
      <BellIcon className="size-5" />
      {unreadCount > 0 && <span className="absolute right-2.5 top-2.5 size-2 rounded-full border-2 border-ink bg-violet shadow-glow" />}
    </button>

    {open && <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[max(4.5rem,env(safe-area-inset-top))] backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="notifications-title" onClick={() => setOpen(false)}>
      <section className="max-h-[75vh] w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#111114] shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet">Circle</p><h2 id="notifications-title" className="mt-0.5 text-lg font-bold">Notifiche</h2></div>
          <button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full border border-white/10 text-zinc-400" aria-label="Chiudi notifiche">×</button>
        </header>
        <div className="max-h-[58vh] space-y-2 overflow-y-auto p-3">
          {notifications.map((notification) => <Link key={notification.id} href={notification.href} onClick={() => markAsRead(notification.id)} className={`flex gap-3 rounded-2xl border p-3 transition ${notification.read ? "border-white/5 bg-white/[0.025]" : "border-violet/25 bg-violet/[0.08]"}`}>
            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${notification.read ? "bg-white/[0.05] text-zinc-500" : "bg-violet text-white"}`}><NotificationIcon type={notification.type} /></span>
            <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="text-[9px] font-black tracking-[0.12em] text-violet">{notificationLabels[notification.type]}</span><span className="shrink-0 text-[10px] text-zinc-600">{notification.time}</span></span><span className="mt-1 block text-sm font-bold">{notification.title}</span><span className="mt-0.5 block text-xs leading-5 text-zinc-400">{notification.detail}</span></span>
          </Link>)}
        </div>
        <footer className="border-t border-white/10 p-3"><button onClick={markAllAsRead} disabled={!unreadCount} className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-zinc-400 disabled:opacity-40"><CheckIcon className="size-4" />Segna tutte come lette</button></footer>
      </section>
    </div>}
  </>;
}
