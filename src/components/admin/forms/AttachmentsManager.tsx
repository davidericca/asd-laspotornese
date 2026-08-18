"use client";

import { useRef, useTransition, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { uploadAttachment, deleteAttachment } from "@/actions/attachments";
import type { AttachmentRow } from "@/lib/types";

export function AttachmentsManager({
  relatedType,
  relatedId,
  attachments,
}: {
  relatedType: "event" | "news";
  relatedId: string;
  attachments: AttachmentRow[];
}) {
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    startTransition(async () => {
      await uploadAttachment(relatedType, relatedId, file);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Eliminare questo documento?")) return;
    startTransition(async () => {
      await deleteAttachment(id, relatedType, relatedId);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-display font-semibold text-primary-950">
        Documenti e regolamenti
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        Carica eventuali PDF (regolamento, modulo di iscrizione…).
      </p>

      <ul className="mt-4 space-y-2">
        {attachments.map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <a href={a.url} target="_blank" className="truncate text-secondary-700 hover:underline">
              {a.file_name}
            </a>
            <button
              type="button"
              onClick={() => handleDelete(a.id)}
              disabled={isPending}
              className="shrink-0 text-xs font-medium text-red-600 hover:underline"
            >
              Elimina
            </button>
          </li>
        ))}
        {attachments.length === 0 && (
          <p className="text-sm text-slate-400">Nessun documento caricato.</p>
        )}
      </ul>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/*"
        onChange={handleUpload}
        disabled={isPending}
        className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-secondary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-secondary-700 hover:file:bg-secondary-100"
      />
    </div>
  );
}
