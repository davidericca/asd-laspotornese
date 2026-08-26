import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedActivities, type ActivityRow } from "@/lib/data/activities";
import { getActivityStyle } from "@/lib/activity-style";
import { cardClass } from "@/lib/ui";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Attività",
  description: "Le attività proposte dall'ASD La Spotornese.",
};

function ActivityCard({ activity, index }: { activity: ActivityRow; index: number }) {
  const { accent, Icon } = getActivityStyle(index);

  return (
    <div className={`flex flex-col overflow-hidden ${cardClass}`}>
      {activity.cover_image_url && (
        <div className="aspect-[16/10] bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={activity.cover_image_url} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-7">
        <div className="flex items-center justify-between">
          <span className={`font-mono text-2xl font-bold ${accent}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <Icon size={26} className={`${accent} opacity-80`} aria-hidden="true" />
        </div>
        <h2 className="font-heading text-lg font-semibold text-card-foreground">
          {activity.title}
        </h2>
        {activity.description && (
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {activity.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default async function AttivitaPage() {
  const activities = await getPublishedActivities();

  return (
    <>
      <PageHeader title="Attività" description="Le attività proposte dall'associazione." />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {activities.map((activity, index) => (
            <ActivityCard key={activity.id} activity={activity} index={index} />
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
