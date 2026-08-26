import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
      <h1 className="font-heading text-3xl font-semibold">Pagina non trovata</h1>
      <p className="mt-4 text-muted-foreground">
        La pagina che cerchi non esiste o è stata spostata.
      </p>
      <Link
        href="/"
        className="mt-6 rounded bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-90 active:scale-[0.97]"
      >
        Torna alla Home
      </Link>
    </div>
  );
}
