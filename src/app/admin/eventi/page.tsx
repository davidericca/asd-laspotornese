import Link from "next/link";
import { getAllEventsAdmin } from "@/lib/data/events";
import { deleteEvent } from "@/actions/events";
import { DeleteButton } from "@/components/admin/forms/DeleteButton";
import { Badge } from "@/components/ui/Badge";
import {
  eventStatusColor,
  eventStatusLabel,
  formatDateIT,
  getEffectiveStatus,
} from "@/lib/utils";

export default async function AdminEventiPage() {
  const events = await getAllEventsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-900">Eventi & Gare</h1>
          <p className="mt-1 text-sm text-slate-500">
            Lo stato &quot;Concluso&quot; viene assegnato automaticamente dal
            giorno successivo alla data dell&apos;evento: non serve
            aggiornarlo a mano.
          </p>
        </div>
        <Link
          href="/admin/eventi/nuovo"
          className="rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600"
        >
          + Nuovo evento
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Nessun evento creato. Inizia creandone uno nuovo.
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Evento</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Stato</th>
                <th className="px-5 py-3 font-medium">Pubblicato</th>
                <th className="px-5 py-3 font-medium text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((e) => (
                <tr key={e.id}>
                  <td className="px-5 py-3.5 font-medium text-primary-950">{e.title}</td>
                  <td className="px-5 py-3.5 text-slate-500">{formatDateIT(e.event_date)}</td>
                  <td className="px-5 py-3.5">
                    <Badge className={eventStatusColor(getEffectiveStatus(e))}>
                      {eventStatusLabel(getEffectiveStatus(e))}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {e.published ? "Sì" : "Bozza"}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/eventi/${e.id}`}
                        className="text-xs font-medium text-secondary-700 hover:underline"
                      >
                        Modifica
                      </Link>
                      <DeleteButton
                        action={deleteEvent.bind(null, e.id)}
                        confirmMessage={`Eliminare l'evento "${e.title}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
