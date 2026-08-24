import { ActivityForm } from "@/components/admin/forms/ActivityForm";
import { createActivity } from "@/actions/activities";

export default function NewActivityPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Nuova attività</h1>
      <div className="mt-6">
        <ActivityForm action={createActivity} />
      </div>
    </div>
  );
}
