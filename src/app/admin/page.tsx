import Link from "next/link";
import { getAllEventsAdmin } from "@/lib/data/events";
import { getAllNewsAdmin } from "@/lib/data/news";
import { getAllGalleries } from "@/lib/data/galleries";
import { getEffectiveStatus } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [events, news, galleries] = await Promise.all([
    getAllEventsAdmin(),
    getAllNewsAdmin(),
    getAllGalleries(),
  ]);

  const upcomingCount = events.filter(
    (e) => getEffectiveStatus(e) === "prossimo"
  ).length;
  const featuredNewsCount = news.filter((n) => n.featured).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-primary-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Da qui puoi gestire eventi, news, immagini e i contenuti del sito.
        </p>
      </div>

      {/* Pulsanti di azione rapida richiesti: "+ Nuovo evento" ecc. */}
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickAction
          href="/admin/eventi/nuovo"
          label="+ Nuovo evento"
          description="Crea una nuova gara o manifestazione"
        />
        <QuickAction
          href="/admin/news/nuovo"
          label="+ Nuova news"
          description="Pubblica una comunicazione"
        />
        <QuickAction
          href="/admin/galleria/nuova"
          label="+ Carica immagini"
          description="Crea una galleria o aggiungi foto"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Eventi totali"
          value={events.length}
          sub={`${upcomingCount} in programma`}
          href="/admin/eventi"
        />
        <StatCard
          label="News pubblicate"
          value={news.length}
          sub={`${featuredNewsCount} in evidenza`}
          href="/admin/news"
        />
        <StatCard
          label="Gallerie fotografiche"
          value={galleries.length}
          sub="Gestisci le foto del sito"
          href="/admin/galleria"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-primary-900">Come funziona</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>
            • Usa i pulsanti in alto per creare rapidamente un evento, una
            news o caricare nuove foto.
          </li>
          <li>
            • Ogni contenuto che pubblichi appare subito sul sito pubblico,
            senza bisogno di reinstallare o aggiornare nulla.
          </li>
          <li>
            • Puoi modificare o eliminare in qualsiasi momento ciò che hai
            creato, dalle rispettive sezioni nel menu a sinistra.
          </li>
        </ul>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border-2 border-dashed border-secondary-300 bg-secondary-50/50 p-5 transition hover:border-secondary-500 hover:bg-secondary-50"
    >
      <p className="text-base font-semibold text-secondary-800">{label}</p>
      <p className="mt-1 text-sm text-secondary-700/70">{description}</p>
    </Link>
  );
}

function StatCard({
  label,
  value,
  sub,
  href,
}: {
  label: string;
  value: number;
  sub: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md"
    >
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-primary-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{sub}</p>
    </Link>
  );
}
