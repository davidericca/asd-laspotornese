import type { AttachmentRow } from "@/lib/data/attachments";

export function AttachmentList({ attachments }: { attachments: AttachmentRow[] }) {
  if (attachments.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="font-heading text-sm font-semibold">Allegati</h2>
      <ul className="mt-2 flex flex-col gap-1">
        {attachments.map((attachment) => (
          <li key={attachment.id}>
            <a
              href={attachment.file_url}
              target="_blank"
              className="text-sm text-muted-foreground hover:underline"
            >
              {attachment.file_name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
