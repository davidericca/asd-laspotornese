"use client";

import { useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({
  action,
  confirmMessage,
  className,
  children = "Elimina",
}: {
  action: () => Promise<void>;
  confirmMessage: string;
  className?: string;
  children?: ReactNode;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm(confirmMessage)) return;
        startTransition(async () => {
          await action();
          router.refresh();
        });
      }}
      className={
        className ??
        "rounded-full px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
      }
    >
      {isPending ? "Eliminazione…" : children}
    </button>
  );
}
