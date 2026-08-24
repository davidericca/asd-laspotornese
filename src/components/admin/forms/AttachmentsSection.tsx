import type { AttachmentRow } from "@/lib/data/attachments";
import { uploadAttachment, deleteAttachment } from "@/actions/attachments";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function AttachmentsSection({
  parent,
  parentId,
  revalidateTarget,
  attachments,
}: {
  parent: "event" | "news";
  parentId: string;
  revalidateTarget: string;
  attachments: AttachmentRow[];
}) {
  return (
    <div className="max-w-lg">
      <h2 className="font-heading text-sm font-semibold">Allegati PDF</h2>
      <ul className="mt-2 flex flex-col gap-2">
        {attachments.map((attachment) => (
          <li key={attachment.id} className="flex items-center justify-between text-sm">
            <a href={attachment.file_url} target="_blank" className="hover:underline">
              {attachment.file_name}
            </a>
            <form
              action={deleteAttachment.bind(
                null,
                attachment.id,
                attachment.file_url,
                revalidateTarget,
              )}
            >
              <SubmitButton className="text-xs text-red-600 hover:underline">
                Elimina
              </SubmitButton>
            </form>
          </li>
        ))}
        {attachments.length === 0 && (
          <li className="text-sm text-muted-foreground">
            Nessun allegato.
          </li>
        )}
      </ul>
      <form
        action={uploadAttachment.bind(null, parent, parentId, revalidateTarget)}
        className="mt-3 flex items-center gap-3"
      >
        <input type="file" name="file" accept="application/pdf" required />
        <SubmitButton className="rounded-xs bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-hover">
          Carica PDF
        </SubmitButton>
      </form>
    </div>
  );
}
