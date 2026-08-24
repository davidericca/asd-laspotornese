import { NewsForm } from "@/components/admin/forms/NewsForm";
import { AttachmentsSection } from "@/components/admin/forms/AttachmentsSection";
import { getAdminNewsById } from "@/lib/data/news";
import { getAdminAttachments } from "@/lib/data/attachments";
import { updateNews } from "@/actions/news";

export default async function EditNewsPage({
  params,
}: PageProps<"/admin/news/[id]">) {
  const { id } = await params;
  const [item, attachments] = await Promise.all([
    getAdminNewsById(id),
    getAdminAttachments("news", id),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Modifica news</h1>
      <div className="mt-6">
        <NewsForm action={updateNews.bind(null, id)} defaultValues={item} />
      </div>
      <hr className="mt-10 max-w-lg border-border" />
      <div className="mt-8">
        <AttachmentsSection
          parent="news"
          parentId={id}
          revalidateTarget={`/news/${item.slug}`}
          attachments={attachments}
        />
      </div>
    </div>
  );
}
