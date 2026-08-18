"use client";

import { useActionState, type ReactNode } from "react";
import { createNews, updateNews, type NewsActionState } from "@/actions/news";
import { CoverImageInput } from "@/components/admin/forms/CoverImageInput";
import type { NewsRow } from "@/lib/types";

const initialState: NewsActionState = {};

export function NewsForm({
  news,
}: {
  news?: NewsRow & { cover_image_url?: string | null };
}) {
  const action = news ? updateNews.bind(null, news.id) : createNews;
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {state.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <Field label="Titolo" required>
        <input
          name="title"
          required
          defaultValue={news?.title}
          placeholder='Es. "Benvenuti nel nuovo sito"'
          className="input"
        />
      </Field>

      <Field label="Riassunto breve">
        <input
          name="excerpt"
          defaultValue={news?.excerpt ?? ""}
          placeholder="Una frase mostrata nelle anteprime"
          className="input"
        />
      </Field>

      <Field label="Testo della comunicazione" required>
        <textarea
          name="body"
          required
          rows={8}
          defaultValue={news?.body ?? ""}
          placeholder="Scrivi qui il contenuto completo della news…"
          className="input"
        />
      </Field>

      <CoverImageInput currentUrl={news?.cover_image_url} />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2.5 text-sm text-slate-700">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={news?.featured ?? false}
            className="h-4 w-4 rounded border-slate-300 text-accent-500 focus:ring-accent-500"
          />
          Metti in evidenza
        </label>
        <label className="flex items-center gap-2.5 text-sm text-slate-700">
          <input
            type="checkbox"
            name="published"
            defaultChecked={news?.published ?? true}
            className="h-4 w-4 rounded border-slate-300 text-secondary-600 focus:ring-secondary-500"
          />
          Pubblicato (visibile sul sito)
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60"
      >
        {isPending ? "Salvataggio…" : news ? "Salva modifiche" : "Pubblica news"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
