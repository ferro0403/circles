# Circle

Demo mobile-first di Circle: una web app per vedere cosa fanno gli amici, condividere il proprio stato e organizzare uscite nei gruppi.

## Stack

- Next.js con App Router
- TypeScript
- Tailwind CSS
- Mock data locali, senza backend, Firebase o autenticazione

## Funzionalità demo

- Home con stato personale modificabile e attività degli amici
- Esplora e dettaglio dei locali
- Gruppi, programmi e creazione mock di sondaggi
- Profilo e Avatar Creator con anteprima live
- Check-in con visibilità e durata configurabili

## Avvio

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Controlli

```bash
npm run lint
npm run build
```

## Struttura principale

- `app/`: pagine e route dell'App Router
- `components/`: componenti UI e interazioni mock riutilizzabili
- `data/mock-data.ts`: tutti i dati mock della demo
