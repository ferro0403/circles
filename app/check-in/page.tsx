import { CheckInForm } from "@/components/check-in-form";
import { PageHeader } from "@/components/ui";

export default function CheckInPage() {
  return <div><PageHeader title="Condividi cosa fai" eyebrow="Check-in" backHref="/" /><p className="mb-6 text-sm leading-6 text-zinc-400">Fai sapere alle persone giuste dove sei, senza condividere la posizione in tempo reale.</p><CheckInForm /></div>;
}
