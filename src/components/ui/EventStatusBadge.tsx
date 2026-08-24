import { CalendarBlank, CheckCircle, Pulse, XCircle } from "@phosphor-icons/react/ssr";
import type { EventRow } from "@/lib/event-status";

const STATUS_CONFIG: Record<
  EventRow["status"],
  { label: string; icon: typeof CalendarBlank; className: string }
> = {
  programmato: {
    label: "Programmato",
    icon: CalendarBlank,
    className: "bg-primary/10 text-primary",
  },
  "in corso": {
    label: "In corso",
    icon: Pulse,
    className: "bg-accent/10 text-accent",
  },
  concluso: {
    label: "Concluso",
    icon: CheckCircle,
    className: "bg-muted text-muted-foreground",
  },
  annullato: {
    label: "Annullato",
    icon: XCircle,
    className: "bg-red-100 text-red-700",
  },
};

export function EventStatusBadge({ status }: { status: EventRow["status"] }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon size={14} weight="bold" aria-hidden="true" />
      {config.label}
    </span>
  );
}
