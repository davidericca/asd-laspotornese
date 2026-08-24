import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedActivities } from "@/lib/data/activities";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Attività",
  description: "Le attività proposte dall'ASD La Spotornese.",
};

export default async function AttivitaPage() {
  const activities = await getPublishedActivities();

  return (
    <>
      <PageHeader title="Attività" />
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="rounded border border-black/10 p-6 dark:border-white/10"
            >
              <h2 className="font-semibold">{activity.title}</h2>
              {activity.description && (
                <p className="mt-2 whitespace-pre-line text-sm text-black/60 dark:text-white/60">
                  {activity.description}
                </p>
              )}
            </div>
          ))}
        </div>
        {activities.length === 0 && (
          <p className="text-black/60 dark:text-white/60">
            [INSERIRE elenco delle attività sportive proposte]
          </p>
        )}
      </div>
    </>
  );
}
