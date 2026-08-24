import type { Metadata } from "next";
import { Target } from "@phosphor-icons/react/ssr";
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
              className="flex flex-col gap-3 rounded-lg border border-border bg-card p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <Target size={20} weight="bold" />
              </span>
              <h2 className="font-heading font-semibold text-card-foreground">{activity.title}</h2>
              {activity.description && (
                <p className="whitespace-pre-line text-sm text-muted-foreground">
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
