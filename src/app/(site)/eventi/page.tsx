import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { EventsExplorer } from "@/components/events/EventsExplorer";
import { getAllPublicEvents } from "@/lib/data/events";
import { fetchImageById } from "@/lib/data/galleries";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Eventi & Gare",
  description: `Calendario di eventi, gare e manifestazioni organizzate dalla ${SITE.name}.`,
};

export default async function EventiPage() {
  const events = await getAllPublicEvents();
  const supabase = await createClient();

  const covers: Record<string, string | null | undefined> = {};
  await Promise.all(
    events.map(async (e) => {
      const img = await fetchImageById(supabase, e.cover_image_id);
      covers[e.id] = img?.url;
    })
  );

  return (
    <>
      <PageHero
        eyebrow="Calendario"
        title="Eventi & Gare"
        subtitle="Tutte le gare sociali e le manifestazioni organizzate dalla nostra associazione."
      />
      <Container className="py-12 sm:py-16">
        <EventsExplorer events={events} covers={covers} />
      </Container>
    </>
  );
}
