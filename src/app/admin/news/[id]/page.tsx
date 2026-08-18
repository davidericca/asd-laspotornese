import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsById } from "@/lib/data/news";
import { NewsForm } from "@/components/admin/forms/NewsForm";
import { AttachmentsManager } from "@/components/admin/forms/AttachmentsManager";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news = await getNewsById(id);
  if (!news) notFound();

  return (
    <div>
      <Link
        href="/admin/news"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary-700 hover:underline"
      >
        ← Tutte le news
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-primary-900">
        Modifica news
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NewsForm news={{ ...news, cover_image_url: news.cover_image?.url }} />
        </div>
        <div>
          <AttachmentsManager
            relatedType="news"
            relatedId={news.id}
            attachments={news.attachments}
          />
        </div>
      </div>
    </div>
  );
}
