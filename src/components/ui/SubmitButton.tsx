"use client";

import { useFormStatus } from "react-dom";

// Disabilita il pulsante durante l'invio: senza questo, un doppio click
// (o un click ripetuto per lentezza) puo' inviare due volte lo stesso
// form, creando righe duplicate nel database.
export function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Attendere..." : children}
    </button>
  );
}
