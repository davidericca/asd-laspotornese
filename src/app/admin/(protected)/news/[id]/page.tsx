import { NewsForm } from "@/components/admin/forms/NewsForm";
import { getAdminNewsById } from "@/lib/data/news";
import { updateNews } from "@/actions/news";

export default async function EditNewsPage({
  params,
}: PageProps<"/admin/news/[id]">) {
  const { id } = await params;
  const item = await getAdminNewsById(id);

  return (
    <div>
      <h1 className="text-2xl font-bold">Modifica news</h1>
      <div className="mt-6">
        <NewsForm action={updateNews.bind(null, id)} defaultValues={item} />
      </div>
    </div>
  );
}
