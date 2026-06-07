import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeftIcon, ChevronRightIcon } from "@/components/icons";

export function PageHeader({ title, eyebrow, backHref, action }: { title: string; eyebrow?: string; backHref?: string; action?: ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 items-center gap-3">
        {backHref && <Link href={backHref} className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04]" aria-label="Indietro"><ArrowLeftIcon className="size-5" /></Link>}
        <div className="min-w-0">
          {eyebrow && <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet">{eyebrow}</p>}
          <h1 className="truncate text-2xl font-bold tracking-tight text-white">{title}</h1>
        </div>
      </div>
      {action}
    </header>
  );
}

export function SectionHeader({ title, href, label = "Vedi tutto" }: { title: string; href?: string; label?: string }) {
  return <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold tracking-tight text-white">{title}</h2>{href && <Link href={href} className="flex items-center text-xs font-semibold text-zinc-400 hover:text-violet">{label}<ChevronRightIcon className="size-4" /></Link>}</div>;
}

export function Avatar({ initials, className = "", tone = "bg-zinc-700" }: { initials: string; className?: string; tone?: string }) {
  return <div className={`grid shrink-0 place-items-center rounded-full border border-white/10 text-xs font-bold text-zinc-950 ${tone} ${className}`}>{initials}</div>;
}

export function Pill({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return <span className={`inline-flex shrink-0 items-center rounded-full border px-3 py-2 text-xs font-semibold ${active ? "border-violet bg-violet text-white" : "border-white/10 bg-white/[0.04] text-zinc-300"}`}>{children}</span>;
}

export function StatusDot({ className = "" }: { className?: string }) {
  return <span className={`inline-block size-2 rounded-full bg-violet shadow-[0_0_12px_rgba(139,92,246,.7)] ${className}`} />;
}
