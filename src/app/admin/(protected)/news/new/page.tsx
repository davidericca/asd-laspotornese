import { NewsForm } from "@/components/admin/forms/NewsForm";
import { createNews } from "@/actions/news";

export default function NewNewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Nuova news</h1>
      <div className="mt-6">
        <NewsForm action={createNews} />
      </div>
    </div>
  );
}
