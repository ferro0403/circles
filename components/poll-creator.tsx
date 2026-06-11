"use client";

import { FormEvent, useMemo, useState } from "react";
import { CalendarIcon, CheckIcon, ClockIcon, PinIcon, PlusIcon } from "@/components/icons";
import { places } from "@/data/mock-data";
import { POLLS_STORAGE_KEY, POLL_VOTES_STORAGE_KEY, useLocalStorageState } from "@/lib/circle-storage";

type PollOption = {
  id: string;
  label: string;
  source: "place" | "free";
  placeId?: string;
};

export type StoredPoll = {
  id: string;
  groupId: string;
  title: string;
  proposedDate: string;
  proposedTime: string;
  proposedLocation: string;
  proposedLocationSource: "place" | "free";
  options: PollOption[];
  createdAt: string;
};

type OptionDraft = {
  source: "place" | "free";
  value: string;
};

type DisplayPoll = StoredPoll & {
  baseVotes: number;
  closes?: string;
  isMock?: boolean;
};

type PollVotes = Record<string, string>;

const initialOptionDrafts: OptionDraft[] = [
  { source: "place", value: places[0]?.id ?? "" },
  { source: "free", value: "" },
];

function today() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function mockOptions(groupId: string): PollOption[] {
  const labels = groupId === "calcetto"
    ? ["Sì, ci sono", "Forse", "No, non riesco"]
    : ["Da Mario", "Agriturismo Rio Verde", "Pizza al parco"];
  return labels.map((label, index) => ({ id: `mock-${groupId}-option-${index}`, label, source: "free" }));
}

function getBaseCounts(total: number, optionCount: number) {
  if (!optionCount) return [];
  const first = Math.ceil(total * 0.67);
  const remaining = Math.max(0, total - first);
  return Array.from({ length: optionCount }, (_, index) => {
    if (index === 0) return first;
    if (index === 1) return Math.ceil(remaining * 0.67);
    if (index === 2) return Math.max(0, remaining - Math.ceil(remaining * 0.67));
    return 0;
  });
}

function formatPollDate(value: string) {
  if (!value) return "Data da definire";
  return new Intl.DateTimeFormat("it-IT", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${value}T12:00:00`));
}

export function PollCreator({ groupId, initialTitle, initialVotes = 0, initialCloses }: { groupId: string; initialTitle?: string; initialVotes?: number; initialCloses?: string }) {
  const [creating, setCreating] = useState(false);
  const [storedPolls, setStoredPolls] = useLocalStorageState<StoredPoll[]>(POLLS_STORAGE_KEY, []);
  const [votes, setVotes] = useLocalStorageState<PollVotes>(POLL_VOTES_STORAGE_KEY, {});
  const [title, setTitle] = useState("");
  const [proposedDate, setProposedDate] = useState(today());
  const [proposedTime, setProposedTime] = useState("20:30");
  const [locationSource, setLocationSource] = useState<"place" | "free">("place");
  const [locationValue, setLocationValue] = useState(places[0]?.id ?? "");
  const [options, setOptions] = useState<OptionDraft[]>(initialOptionDrafts);

  const polls = useMemo<DisplayPoll[]>(() => {
    const localPolls = storedPolls
      .filter((poll) => poll.groupId === groupId)
      .map((poll) => ({ ...poll, baseVotes: 0 }));
    if (!initialTitle) return localPolls;
    const mockPoll: DisplayPoll = {
      id: `mock-${groupId}`,
      groupId,
      title: initialTitle,
      proposedDate: "",
      proposedTime: "",
      proposedLocation: "",
      proposedLocationSource: "free",
      options: mockOptions(groupId),
      createdAt: "",
      baseVotes: initialVotes,
      closes: initialCloses,
      isMock: true,
    };
    return [...localPolls, mockPoll];
  }, [groupId, initialCloses, initialTitle, initialVotes, storedPolls]);

  function resetForm() {
    setTitle("");
    setProposedDate(today());
    setProposedTime("20:30");
    setLocationSource("place");
    setLocationValue(places[0]?.id ?? "");
    setOptions(initialOptionDrafts);
  }

  function updateOption(index: number, patch: Partial<OptionDraft>) {
    setOptions((current) => current.map((option, optionIndex) => optionIndex === index ? { ...option, ...patch } : option));
  }

  function createPoll(event: FormEvent) {
    event.preventDefault();
    const proposedLocation = locationSource === "place"
      ? places.find((place) => place.id === locationValue)?.name ?? ""
      : locationValue.trim();
    const validOptions = options.flatMap((option, index): PollOption[] => {
      const label = option.source === "place"
        ? places.find((place) => place.id === option.value)?.name ?? ""
        : option.value.trim();
      return label ? [{ id: `${Date.now()}-option-${index}`, label, source: option.source, ...(option.source === "place" ? { placeId: option.value } : {}) }] : [];
    });
    if (!title.trim() || !proposedDate || !proposedTime || !proposedLocation || validOptions.length < 2) return;

    const poll: StoredPoll = {
      id: `poll-${groupId}-${Date.now()}`,
      groupId,
      title: title.trim(),
      proposedDate,
      proposedTime,
      proposedLocation,
      proposedLocationSource: locationSource,
      options: validOptions,
      createdAt: new Date().toISOString(),
    };
    setStoredPolls((current) => [poll, ...current]);
    setCreating(false);
    resetForm();
  }

  function vote(pollId: string, optionId: string) {
    setVotes((current) => ({ ...current, [pollId]: optionId }));
  }

  return <section><div className="mb-3 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet">Decidete insieme</p><h2 className="mt-0.5 text-lg font-bold">Sondaggi</h2></div><button onClick={() => setCreating((value) => !value)} className="flex items-center gap-1.5 rounded-full bg-violet px-3.5 py-2.5 text-xs font-bold text-white shadow-glow"><PlusIcon className="size-4" />Nuovo sondaggio</button></div>
    {creating && <form onSubmit={createPoll} className="mb-3 rounded-3xl border border-violet/30 bg-gradient-to-br from-violet/[0.12] to-panel p-5">
      <label htmlFor="poll-title" className="text-xs font-bold text-zinc-300">Titolo sondaggio</label><input id="poll-title" autoFocus required value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet" placeholder="Es. Dove andiamo sabato?" />
      <div className="mt-4 grid grid-cols-2 gap-2"><label className="text-xs font-bold text-zinc-300">Data proposta<input required type="date" min={today()} value={proposedDate} onChange={(event) => setProposedDate(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm font-normal outline-none focus:border-violet" /></label><label className="text-xs font-bold text-zinc-300">Ora proposta<input required type="time" value={proposedTime} onChange={(event) => setProposedTime(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm font-normal outline-none focus:border-violet" /></label></div>
      <fieldset className="mt-4"><legend className="text-xs font-bold text-zinc-300">Luogo/attività proposta</legend><div className="mt-2 grid grid-cols-2 gap-2"><button type="button" onClick={() => { setLocationSource("place"); setLocationValue(places[0]?.id ?? ""); }} className={`rounded-xl border py-2.5 text-xs font-bold ${locationSource === "place" ? "border-violet bg-violet text-white" : "border-white/10 text-zinc-400"}`}>Attività registrata</button><button type="button" onClick={() => { setLocationSource("free"); setLocationValue(""); }} className={`rounded-xl border py-2.5 text-xs font-bold ${locationSource === "free" ? "border-violet bg-violet text-white" : "border-white/10 text-zinc-400"}`}>Luogo libero</button></div>{locationSource === "place" ? <select value={locationValue} onChange={(event) => setLocationValue(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet">{places.map((place) => <option key={place.id} value={place.id}>{place.name} · {place.category}</option>)}</select> : <input required value={locationValue} onChange={(event) => setLocationValue(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet" placeholder="Scrivi luogo o attività" />}</fieldset>
      <fieldset className="mt-4"><legend className="text-xs font-bold text-zinc-300">Opzioni del sondaggio</legend><div className="mt-2 space-y-3">{options.map((option, index) => <div key={index} className="grid grid-cols-[auto_1fr] gap-2"><select aria-label={`Tipo opzione ${index + 1}`} value={option.source} onChange={(event) => updateOption(index, { source: event.target.value as OptionDraft["source"], value: event.target.value === "place" ? places[0]?.id ?? "" : "" })} className="rounded-xl border border-white/10 bg-black/30 px-2 text-xs outline-none focus:border-violet"><option value="place">Attività</option><option value="free">Libero</option></select>{option.source === "place" ? <select aria-label={`Opzione ${index + 1}`} value={option.value} onChange={(event) => updateOption(index, { value: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet">{places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}</select> : <input aria-label={`Opzione ${index + 1}`} required value={option.value} onChange={(event) => updateOption(index, { value: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none focus:border-violet" placeholder={`Luogo/opzione ${index + 1}`} />}</div>)}</div></fieldset>
      {options.length < 6 && <button type="button" onClick={() => setOptions((current) => [...current, { source: "free", value: "" }])} className="mt-3 flex items-center gap-1 text-xs font-semibold text-violet"><PlusIcon className="size-3.5" />Aggiungi opzione</button>}
      <div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={() => setCreating(false)} className="rounded-xl border border-white/10 py-3 text-xs font-bold text-zinc-400">Annulla</button><button type="submit" className="rounded-xl bg-violet py-3 text-xs font-bold text-white">Pubblica</button></div>
    </form>}
    <div className="space-y-3">{polls.map((poll) => {
      const selectedOption = votes[poll.id];
      const baseCounts = getBaseCounts(poll.baseVotes, poll.options.length);
      const totalVotes = poll.baseVotes + (selectedOption ? 1 : 0);
      return <article key={poll.id} className={`rounded-3xl border p-5 ${poll.isMock ? "border-white/10 bg-panel" : "border-violet/30 bg-violet/[0.08]"}`}><span className="rounded-full bg-violet/10 px-2.5 py-1 text-[10px] font-bold text-violet">{poll.isMock ? "SCELTA DI GRUPPO" : "SONDAGGIO PUBBLICATO"}</span><h3 className="mt-4 text-lg font-bold">{poll.title}</h3>{!poll.isMock && <div className="mt-2 space-y-1 text-xs text-zinc-500"><p className="flex items-center gap-1.5"><CalendarIcon className="size-3.5" />{formatPollDate(poll.proposedDate)} <ClockIcon className="ml-2 size-3.5" />{poll.proposedTime}</p><p className="flex items-center gap-1.5"><PinIcon className="size-3.5" />{poll.proposedLocation}</p></div>}<div className="mt-4 space-y-2">{poll.options.map((option, index) => {
        const isSelected = selectedOption === option.id;
        const count = (baseCounts[index] ?? 0) + (isSelected ? 1 : 0);
        const percent = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
        return <button key={option.id} type="button" onClick={() => vote(poll.id, option.id)} aria-pressed={isSelected} className={`relative flex w-full overflow-hidden rounded-xl border px-3 py-3 text-left text-xs font-semibold ${isSelected ? "border-violet bg-violet/[0.12]" : "border-white/10 bg-white/[0.05]"}`}><span className="absolute inset-y-0 left-0 bg-violet/10" style={{ width: `${percent}%` }} /><span className="relative flex-1">{option.label}</span><span className="relative flex items-center gap-1 text-zinc-400">{isSelected && <CheckIcon className="size-3 text-violet" />}{count} {count === 1 ? "voto" : "voti"}</span></button>;
      })}</div><p className="mt-4 text-xs text-zinc-500">{totalVotes} {totalVotes === 1 ? "voto" : "voti"}{poll.closes ? ` · ${poll.closes}` : ""}</p></article>;
    })}</div>
  </section>;
}
