import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedNewsBySlug } from "@/lib/data/news";
import { getPublishedAttachments } from "@/lib/data/attachments";
import { formatDateIt } from "@/lib/utils";

export const revalidate = 60;

export default async function NewsDetailPage({
  params,
}: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const item = await getPublishedNewsBySlug(slug);
  const attachments = await getPublishedAttachments("news", item.id);

  return (
    <>
      <PageHeader title={item.title} description={formatDateIt(item.created_at)} />
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <p className="whitespace-pre-line text-sm">{item.body}</p>

        {attachments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold">Allegati</h2>
            <ul className="mt-2 flex flex-col gap-1">
              {attachments.map((attachment) => (
                <li key={attachment.id}>
                  <a
                    href={attachment.file_url}
                    target="_blank"
                    className="text-sm text-black/60 hover:underline dark:text-white/60"
                  >
                    {attachment.file_name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
