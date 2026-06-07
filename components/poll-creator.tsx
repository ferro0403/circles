"use client";

import { FormEvent, useState } from "react";
import { CheckIcon, PlusIcon } from "@/components/icons";

type Poll = { question: string; options: string[] };

export function PollCreator({ initialTitle, initialVotes, initialCloses }: { initialTitle?: string; initialVotes?: number; initialCloses?: string }) {
  const [creating, setCreating] = useState(false);
  const [createdPoll, setCreatedPoll] = useState<Poll | null>(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  function createPoll(event: FormEvent) {
    event.preventDefault();
    const validOptions = options.map((option) => option.trim()).filter(Boolean);
    if (!question.trim() || validOptions.length < 2) return;
    setCreatedPoll({ question: question.trim(), options: validOptions });
    setCreating(false);
    setQuestion("");
    setOptions(["", ""]);
  }

  return <section><div className="mb-3 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet">Decidete insieme</p><h2 className="mt-0.5 text-lg font-bold">Sondaggi</h2></div><button onClick={() => setCreating((value) => !value)} className="flex items-center gap-1.5 rounded-full bg-violet px-3.5 py-2.5 text-xs font-bold text-white shadow-glow"><PlusIcon className="size-4" />Nuovo sondaggio</button></div>
    {creating && <form onSubmit={createPoll} className="mb-3 rounded-3xl border border-violet/30 bg-gradient-to-br from-violet/[0.12] to-panel p-5"><label htmlFor="poll-question" className="text-xs font-bold text-zinc-300">Domanda</label><input id="poll-question" autoFocus value={question} onChange={(event) => setQuestion(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet" placeholder="Es. Dove andiamo sabato?" /><div className="mt-4 space-y-2">{options.map((option, index) => <input key={index} value={option} onChange={(event) => setOptions((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet" placeholder={`Opzione ${index + 1}`} />)}</div>{options.length < 4 && <button type="button" onClick={() => setOptions((current) => [...current, ""])} className="mt-3 flex items-center gap-1 text-xs font-semibold text-violet"><PlusIcon className="size-3.5" />Aggiungi opzione</button>}<div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={() => setCreating(false)} className="rounded-xl border border-white/10 py-3 text-xs font-bold text-zinc-400">Annulla</button><button type="submit" className="rounded-xl bg-violet py-3 text-xs font-bold text-white">Pubblica</button></div></form>}
    {createdPoll && <div className="mb-3 rounded-3xl border border-violet/30 bg-violet/[0.08] p-5"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-violet"><CheckIcon className="size-4" />Sondaggio pubblicato</div><h3 className="mt-3 text-lg font-bold">{createdPoll.question}</h3><div className="mt-4 space-y-2">{createdPoll.options.map((option) => <div key={option} className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-xs font-semibold">{option}</div>)}</div><p className="mt-4 text-xs text-zinc-500">0 voti · Appena creato</p></div>}
    {initialTitle && <div className="rounded-3xl border border-white/10 bg-panel p-5"><span className="rounded-full bg-violet/10 px-2.5 py-1 text-[10px] font-bold text-violet">SCELTA DI GRUPPO</span><h3 className="mt-4 text-lg font-bold">{initialTitle}</h3><div className="mt-4 space-y-2">{[{ name: "Da Mario", percent: 67 }, { name: "Agriturismo Rio Verde", percent: 22 }, { name: "Pizza al parco", percent: 11 }].map((option, index) => <button key={option.name} className="relative flex w-full overflow-hidden rounded-xl bg-white/[0.05] px-3 py-3 text-left text-xs font-semibold"><span className="absolute inset-y-0 left-0 bg-violet/10" style={{ width: `${option.percent}%` }} /><span className="relative flex-1">{option.name}</span><span className="relative flex items-center gap-1 text-zinc-500">{index === 0 && <CheckIcon className="size-3 text-violet" />}{option.percent}%</span></button>)}</div><p className="mt-4 text-xs text-zinc-500">{initialVotes} voti · {initialCloses}</p></div>}
  </section>;
}
