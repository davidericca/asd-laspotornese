import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { ACTIVITIES_PLACEHOLDER, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Attività",
  description: `Le attività di pesca sportiva organizzate dalla ${SITE.name}.`,
};

export default function AttivitaPage() {
  return (
    <>
      <PageHero
        eyebrow="Cosa proponiamo"
        title="Le nostre attività"
        subtitle="Dalla pesca sportiva alle gare sociali, fino alla tutela dell'ambiente marino."
      />

      <Container className="py-12 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2">
          {ACTIVITIES_PLACEHOLDER.map((activity) => (
            <div
              key={activity.title}
              className="rounded-2xl border border-slate-200 bg-white p-8 transition hover:shadow-md"
            >
              <h2 className="font-display text-xl font-semibold text-primary-950">
                {activity.title}
              </h2>
              <p className="mt-3 whitespace-pre-line text-slate-600">
                {activity.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-primary-950 p-10 text-center text-white">
          <h2 className="font-display text-2xl font-semibold">
            Vuoi partecipare alle nostre attività?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-primary-200">
            Consulta il calendario eventi o contattaci per maggiori
            informazioni su come iscriverti.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button href="/eventi" variant="primary">
              Calendario eventi
            </Button>
            <Button href="/contatti" variant="outline">
              Contattaci
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
