import slugify from "slugify";
import type { EventStatus } from "@/lib/types";

/** Genera uno slug URL-friendly a partire da un titolo (es. per eventi/news). */
export function makeSlug(title: string, uniqueSuffix?: string): string {
  const base = slugify(title, { lower: true, strict: true, locale: "it" });
  return uniqueSuffix ? `${base}-${uniqueSuffix}` : base;
}

const MONTHS_IT = [
  "gennaio",
  "febbraio",
  "marzo",
  "aprile",
  "maggio",
  "giugno",
  "luglio",
  "agosto",
  "settembre",
  "ottobre",
  "novembre",
  "dicembre",
];

const DAYS_IT = [
  "domenica",
  "lunedì",
  "martedì",
  "mercoledì",
  "giovedì",
  "venerdì",
  "sabato",
];

/** Formatta una data ISO (YYYY-MM-DD) in italiano, es. "12 settembre 2026". */
export function formatDateIT(isoDate: string, withWeekday = false): string {
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  const day = d.getDate();
  const month = MONTHS_IT[d.getMonth()];
  const year = d.getFullYear();
  const weekday = withWeekday ? `${DAYS_IT[d.getDay()]} ` : "";
  return `${weekday}${day} ${month} ${year}`;
}

/** Formatta un orario HH:MM:SS in HH:MM. */
export function formatTimeIT(time: string | null): string | null {
  if (!time) return null;
  return time.slice(0, 5);
}

/** Formatta una data/ora ISO completa (timestamptz) in italiano. */
export function formatDateTimeIT(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS_IT[d.getMonth()]} ${d.getFullYear()}`;
}

export function eventStatusLabel(status: EventStatus): string {
  switch (status) {
    case "prossimo":
      return "Prossimo evento";
    case "concluso":
      return "Concluso";
    case "annullato":
      return "Annullato";
    default:
      return status;
  }
}

export function eventStatusColor(status: EventStatus): string {
  switch (status) {
    case "prossimo":
      return "bg-accent-500 text-white";
    case "concluso":
      return "bg-slate-200 text-slate-600";
    case "annullato":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-200 text-slate-600";
  }
}

/**
 * Calcola lo stato "effettivo" di un evento, quello mostrato sul sito.
 *
 * - "annullato" è l'unico stato che l'amministratore imposta manualmente e
 *   ha sempre la precedenza (una manifestazione annullata resta tale a
 *   prescindere dalla data).
 * - In tutti gli altri casi lo stato viene calcolato automaticamente dalla
 *   data: l'evento resta "prossimo" per l'intera giornata in cui si
 *   svolge (o fino alla data di fine, per eventi su più giorni) e diventa
 *   "concluso" solo a partire dal giorno successivo. Così l'amministratore
 *   non deve ricordarsi di aggiornare lo stato a mano.
 */
export function getEffectiveStatus(event: {
  status: EventStatus;
  event_date: string;
  end_date?: string | null;
}): EventStatus {
  if (event.status === "annullato") return "annullato";

  const today = new Date().toISOString().slice(0, 10);
  const lastDay = event.end_date || event.event_date;
  return today > lastDay ? "concluso" : "prossimo";
}

/** Formatta una dimensione file in KB/MB leggibili. */
export function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
