"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CompassIcon, HomeIcon, PlusIcon, UserIcon, UsersIcon } from "@/components/icons";

const items = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Esplora", href: "/esplora", icon: CompassIcon },
  { label: "Condividi", href: "/check-in", icon: PlusIcon, primary: true },
  { label: "Gruppi", href: "/gruppi", icon: UsersIcon },
  { label: "Profilo", href: "/profilo", icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md border-t border-white/10 bg-[#0b0c0e]/95 px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
      <div className="flex items-end justify-between">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} aria-label={item.label} className={`group flex min-w-14 flex-col items-center gap-1 text-[10px] font-medium transition ${active ? "text-violet" : "text-zinc-500 hover:text-zinc-200"}`}>
              <span className={item.primary ? "-mt-7 grid size-14 place-items-center rounded-full border-4 border-[#0b0c0e] bg-violet text-white shadow-glow transition group-active:scale-95" : "grid size-7 place-items-center"}>
                <Icon className={item.primary ? "size-7" : "size-5"} />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
