"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckIcon, PlusIcon } from "@/components/icons";
import { places } from "@/data/mock-data";

export const POLLS_STORAGE_KEY = "circle.polls.v1";
export const POLL_VOTES_STORAGE_KEY = "circle.pollVotes.v1";
export const POLLS_EVENT = "circle-polls-updated";

export type PollOption = { id: string; label: string; source: "activity" | "free" };
export type SavedPoll = {
  id: string;
  groupId: string;
  title: string;
  date: string;
  time: string;
  proposal: string;
  options: PollOption[];
  createdAt: string;
};

type Votes = Record<string, string>;
type OptionDraft = { source: "activity" | "free"; value: string };

export function readPolls(): SavedPoll[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(POLLS_STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readVotes(): Votes {
  try {
    const value = JSON.parse(window.localStorage.getItem(POLL_VOTES_STORAGE_KEY) ?? "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function distributeVotes(total: number, optionCount: number) {
  return Array.from({ length: optionCount }, (_, index) => Math.floor(total / optionCount) + (index < total % optionCount ? 1 : 0));
}

function PollCard({ poll, baseVotes = 0, closes = "Appena creato" }: { poll: SavedPoll; baseVotes?: number; closes?: string }) {
  const [votes, setVotes] = useState<Votes>({});
  useEffect(() => setVotes(readVotes()), []);
  const selectedOption = votes[poll.id];
  const initialCounts = distributeVotes(baseVotes, poll.options.length);
  const totalVotes = baseVotes + (selectedOption ? 1 : 0);

  function vote(optionId: string) {
    const next = { ...readVotes(), [poll.id]: optionId };
    window.localStorage.setItem(POLL_VOTES_STORAGE_KEY, JSON.stringify(next));
    setVotes(next);
  }

  return <div className="rounded-3xl border border-white/10 bg-panel p-5"><span className="rounded-full bg-violet/10 px-2.5 py-1 text-[10px] font-bold text-violet">SCELTA DI GRUPPO</span><h3 className="mt-4 text-lg font-bold">{poll.title}</h3><p className="mt-1 text-xs text-zinc-500">{poll.date} · {poll.time} · {poll.proposal}</p><div className="mt-4 space-y-2">{poll.options.map((option, index) => { const count = initialCounts[index] + (selectedOption === option.id ? 1 : 0); const percent = totalVotes ? Math.round(count / totalVotes * 100) : 0; return <button type="button" key={option.id} onClick={() => vote(option.id)} className={`relative flex w-full overflow-hidden rounded-xl border px-3 py-3 text-left text-xs font-semibold ${selectedOption === option.id ? "border-violet/60 bg-violet/[0.08]" : "border-transparent bg-white/[0.05]"}`}><span className="absolute inset-y-0 left-0 bg-violet/10" style={{ width: `${percent}%` }} /><span className="relative flex-1">{option.label}</span><span className="relative flex items-center gap-1 text-zinc-500">{selectedOption === option.id && <CheckIcon className="size-3 text-violet" />}{count} {count === 1 ? "voto" : "voti"}</span></button>; })}</div><p className="mt-4 text-xs text-zinc-500">{totalVotes} voti · {closes}</p></div>;
}

export function PollCreator({ groupId, initialTitle, initialVotes = 0, initialCloses }: { groupId: string; initialTitle?: string; initialVotes?: number; initialCloses?: string }) {
  const [creating, setCreating] = useState(false);
  const [polls, setPolls] = useState<SavedPoll[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [proposal, setProposal] = useState("");
  const [options, setOptions] = useState<OptionDraft[]>([{ source: "activity", value: places[0].id }, { source: "free", value: "" }]);

  useEffect(() => setPolls(readPolls().filter((poll) => poll.groupId === groupId)), [groupId]);

  function createPoll(event: FormEvent) {
    event.preventDefault();
    const validOptions = options.map((option, index) => ({ id: `option-${Date.now()}-${index}`, label: option.source === "activity" ? places.find((place) => place.id === option.value)?.name ?? "" : option.value.trim(), source: option.source })).filter((option) => option.label);
    if (!title.trim() || !date || !time || !proposal.trim() || validOptions.length < 2) return;
    const poll: SavedPoll = { id: `${groupId}-${Date.now()}`, groupId, title: title.trim(), date, time, proposal: proposal.trim(), options: validOptions, createdAt: new Date().toISOString() };
    const next = [...readPolls(), poll];
    window.localStorage.setItem(POLLS_STORAGE_KEY, JSON.stringify(next));
    setPolls(next.filter((item) => item.groupId === groupId));
    window.dispatchEvent(new Event(POLLS_EVENT));
    setCreating(false); setTitle(""); setDate(""); setTime(""); setProposal(""); setOptions([{ source: "activity", value: places[0].id }, { source: "free", value: "" }]);
  }

  const mockPoll: SavedPoll | null = initialTitle ? { id: `mock-${groupId}`, groupId, title: initialTitle, date: "Data del gruppo", time: "Orario da confermare", proposal: "Proposta iniziale", options: ["Da Mario", "Agriturismo Rio Verde", "Pizza al parco"].map((label, index) => ({ id: `mock-${groupId}-${index}`, label, source: "free" })), createdAt: "" } : null;

  return <section><div className="mb-3 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet">Decidete insieme</p><h2 className="mt-0.5 text-lg font-bold">Sondaggi</h2></div><button onClick={() => setCreating((value) => !value)} className="flex items-center gap-1.5 rounded-full bg-violet px-3.5 py-2.5 text-xs font-bold text-white shadow-glow"><PlusIcon className="size-4" />Nuovo sondaggio</button></div>
    {creating && <form onSubmit={createPoll} className="mb-3 rounded-3xl border border-violet/30 bg-gradient-to-br from-violet/[0.12] to-panel p-5"><label htmlFor="poll-title" className="text-xs font-bold text-zinc-300">Titolo sondaggio</label><input id="poll-title" autoFocus required value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet" placeholder="Es. Cosa facciamo sabato?" /><div className="mt-3 grid grid-cols-2 gap-2"><input aria-label="Data proposta" required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet" /><input aria-label="Ora proposta" required type="time" value={time} onChange={(event) => setTime(event.target.value)} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet" /></div><input required value={proposal} onChange={(event) => setProposal(event.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet" placeholder="Luogo o attività proposta" />
      <div className="mt-4 space-y-3">{options.map((option, index) => <div key={index} className="grid grid-cols-[110px_1fr] gap-2"><select aria-label={`Tipo opzione ${index + 1}`} value={option.source} onChange={(event) => setOptions((current) => current.map((item, itemIndex) => itemIndex === index ? { source: event.target.value as OptionDraft["source"], value: event.target.value === "activity" ? places[0].id : "" } : item))} className="rounded-xl border border-white/10 bg-black/30 px-2 text-xs outline-none focus:border-violet"><option value="activity">Attività</option><option value="free">Luogo libero</option></select>{option.source === "activity" ? <select aria-label={`Attività opzione ${index + 1}`} value={option.value} onChange={(event) => setOptions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet">{places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}</select> : <input required value={option.value} onChange={(event) => setOptions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet" placeholder={`Opzione ${index + 1}`} />}</div>)}</div>
      {options.length < 6 && <button type="button" onClick={() => setOptions((current) => [...current, { source: "free", value: "" }])} className="mt-3 flex items-center gap-1 text-xs font-semibold text-violet"><PlusIcon className="size-3.5" />Aggiungi opzione</button>}<div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={() => setCreating(false)} className="rounded-xl border border-white/10 py-3 text-xs font-bold text-zinc-400">Annulla</button><button type="submit" className="rounded-xl bg-violet py-3 text-xs font-bold text-white">Pubblica</button></div></form>}
    <div className="space-y-3">{polls.map((poll) => <PollCard key={poll.id} poll={poll} />)}{mockPoll && <PollCard poll={mockPoll} baseVotes={initialVotes} closes={initialCloses} />}</div>
  </section>;
}
