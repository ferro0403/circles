export type Friend = {
  id: string;
  name: string;
  initials: string;
  activity: string;
  place: string;
  until: string;
  color: string;
};

export type Group = {
  id: string;
  name: string;
  emoji: string;
  members: number;
  activeNow: number;
  nextPlan: string;
  poll?: { title: string; votes: number; closes: string };
};

export type Place = {
  id: string;
  name: string;
  category: string;
  distance: string;
  address: string;
  description: string;
  image: string;
  imageAlt: string;
  friends: string[];
  mapsUrl: string;
  instagramUrl: string;
  openNow: boolean;
};

export const currentUser = {
  name: "Luca Bianchi",
  nickname: "@lucab",
  initials: "LB",
  city: "Riolo Terme",
  status: "Libero per un aperitivo",
  statusUntil: "fino alle 21:00",
};

export const friends: Friend[] = [
  { id: "sofia", name: "Sofia", initials: "SO", activity: "Aperitivo", place: "Al Parco", until: "fino alle 20:30", color: "bg-violet-400" },
  { id: "marco", name: "Marco", initials: "MA", activity: "Allenamento", place: "Fit Club", until: "ancora 1h", color: "bg-cyan-400" },
  { id: "giulia", name: "Giulia", initials: "GI", activity: "Cena", place: "Da Mario", until: "dalle 20:00", color: "bg-orange-400" },
  { id: "andrea", name: "Andrea", initials: "AN", activity: "In centro", place: "Piazza Mazzanti", until: "fino alle 22:00", color: "bg-rose-400" },
];

export const groups: Group[] = [
  { id: "compagnia-riolo", name: "Compagnia Riolo", emoji: "⚡", members: 12, activeNow: 4, nextPlan: "Cena sabato sera", poll: { title: "Dove andiamo sabato?", votes: 9, closes: "Chiude stasera" } },
  { id: "calcetto", name: "Calcetto del giovedì", emoji: "⚽", members: 10, activeNow: 2, nextPlan: "Giovedì · 20:30", poll: { title: "Confermi la presenza?", votes: 7, closes: "2 posti liberi" } },
  { id: "universita", name: "Quelli dell’uni", emoji: "📚", members: 8, activeNow: 0, nextPlan: "Nessun programma" },
];

export const places: Place[] = [
  { id: "cinema-moderno", name: "Cinema Moderno", category: "Cinema", distance: "350 m", address: "Corso Matteotti 55, Riolo Terme", description: "Il cinema di Riolo, con una sala rinnovata e una programmazione tra nuove uscite, film d’autore ed eventi speciali.", image: "cinema", imageAlt: "Sala del Cinema Moderno", friends: ["Sofia", "Andrea"], mapsUrl: "https://maps.google.com/?q=Cinema+Moderno+Riolo+Terme", instagramUrl: "https://instagram.com/", openNow: true },
  { id: "al-parco", name: "Al Parco", category: "Bar", distance: "500 m", address: "Via Firenze 10, Riolo Terme", description: "Cocktail, musica e tavoli all’aperto nel cuore verde della città.", image: "bar", imageAlt: "Cocktail del bar Al Parco", friends: ["Sofia"], mapsUrl: "https://maps.google.com/?q=Riolo+Terme", instagramUrl: "https://instagram.com/", openNow: true },
  { id: "fit-club", name: "Fit Club", category: "Palestre", distance: "1,2 km", address: "Via Bologna 8, Riolo Terme", description: "Palestra attrezzata con sala pesi, corsi di gruppo e area functional.", image: "gym", imageAlt: "Attrezzi della palestra Fit Club", friends: ["Marco", "Elena"], mapsUrl: "https://maps.google.com/?q=Riolo+Terme", instagramUrl: "https://instagram.com/", openNow: true },
  { id: "da-mario", name: "Da Mario", category: "Ristoranti", distance: "750 m", address: "Via Aldo Moro 4, Riolo Terme", description: "Cucina romagnola, pasta fresca e una selezione di vini del territorio.", image: "restaurant", imageAlt: "Tavola del ristorante Da Mario", friends: ["Giulia"], mapsUrl: "https://maps.google.com/?q=Riolo+Terme", instagramUrl: "https://instagram.com/", openNow: false },
];

export const categories = ["Bar", "Ristoranti", "Palestre", "Cinema", "Discoteche", "Eventi"];

export const groupMembers = [
  { name: "Luca", initials: "LB", availability: "Libero stasera", state: "free" },
  { name: "Sofia", initials: "SO", availability: "Dopo le 21", state: "later" },
  { name: "Marco", initials: "MA", availability: "Occupato", state: "busy" },
  { name: "Giulia", initials: "GI", availability: "Libera domani", state: "later" },
];

export const futurePlans = [
  { day: "08", month: "GIU", title: "Cena tutti insieme", meta: "Sabato · 20:30", going: 8 },
  { day: "14", month: "GIU", title: "Cinema sotto le stelle", meta: "Venerdì · 21:15", going: 5 },
];
