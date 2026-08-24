import Link from "next/link";
import { getAdminActivities } from "@/lib/data/activities";
import { deleteActivity, moveActivity } from "@/actions/activities";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default async function AdminActivitiesPage() {
  const activities = await getAdminActivities();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Attività</h1>
        <Link
          href="/admin/activities/new"
          className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Nuova attività
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-border">
        {activities.map((activity, index) => (
          <li key={activity.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <form action={moveActivity.bind(null, activity.id, "up")}>
                  <button
                    type="submit"
                    disabled={index === 0}
                    aria-label="Sposta su"
                    className="block leading-none disabled:opacity-20"
                  >
                    ▲
                  </button>
                </form>
                <form action={moveActivity.bind(null, activity.id, "down")}>
                  <button
                    type="submit"
                    disabled={index === activities.length - 1}
                    aria-label="Sposta giù"
                    className="block leading-none disabled:opacity-20"
                  >
                    ▼
                  </button>
                </form>
              </div>
              <p className="font-medium">
                {activity.title}{" "}
                {!activity.published && (
                  <span className="text-xs text-muted-foreground">
                    (bozza)
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href={`/admin/activities/${activity.id}`} className="hover:underline">
                Modifica
              </Link>
              <form action={deleteActivity.bind(null, activity.id)}>
                <SubmitButton className="text-red-600 hover:underline dark:text-red-400">
                  Elimina
                </SubmitButton>
              </form>
            </div>
          </li>
        ))}
        {activities.length === 0 && (
          <li className="py-3 text-muted-foreground">
            Nessuna attività creata.
          </li>
        )}
      </ul>
    </div>
  );
}
