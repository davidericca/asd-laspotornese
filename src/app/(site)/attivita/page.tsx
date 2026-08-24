import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedActivities } from "@/lib/data/activities";
import { cardClass } from "@/lib/ui";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Attività",
  description: "Le attività proposte dall'ASD La Spotornese.",
};

export default async function AttivitaPage() {
  const activities = await getPublishedActivities();

  return (
    <>
      <PageHeader title="Attività" description="Le attività proposte dall'associazione." />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {activities.map((activity) => (
            <div key={activity.id} className={`flex flex-col gap-3 p-7 ${cardClass}`}>
              <h2 className="font-heading text-lg font-semibold text-card-foreground">
                {activity.title}
              </h2>
              {activity.description && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {activity.description}
                </p>
              )}
            </div>
          ))}
        </div>
        {activities.length === 0 && (
          <p className="text-muted-foreground">
            [INSERIRE elenco delle attività sportive proposte]
          </p>
        )}
      </div>
    </>
  );
}
