export type EventRow = {
  id: string;
  title: string;
  slug: string;
  event_date: string;
  event_time: string | null;
  location: string | null;
  status: "programmato" | "in corso" | "concluso" | "annullato";
  description: string | null;
  cover_image_url: string | null;
  cover_image_position: string | null;
  gallery_id: string | null;
  published: boolean;
};

export function getEventDisplayStatus(
  event: Pick<EventRow, "status" | "event_date">,
): EventRow["status"] {
  if (event.status === "annullato") return "annullato";
  const today = new Date().toISOString().slice(0, 10);
  if (event.event_date < today) return "concluso";
  if (event.event_date === today) return "in corso";
  return "programmato";
}
