import { ActivityForm } from "@/components/admin/forms/ActivityForm";
import { getAdminActivityById } from "@/lib/data/activities";
import { updateActivity } from "@/actions/activities";

export default async function EditActivityPage({
  params,
}: PageProps<"/admin/activities/[id]">) {
  const { id } = await params;
  const activity = await getAdminActivityById(id);

  return (
    <div>
      <h1 className="text-2xl font-bold">Modifica attività</h1>
      <div className="mt-6">
        <ActivityForm action={updateActivity.bind(null, id)} defaultValues={activity} />
      </div>
    </div>
  );
}
