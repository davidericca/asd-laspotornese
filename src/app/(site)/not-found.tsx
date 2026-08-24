import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">Pagina non trovata</h1>
      <p className="mt-4 text-black/60 dark:text-white/60">
        La pagina che cerchi non esiste o è stata spostata.
      </p>
      <Link
        href="/"
        className="mt-6 rounded bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
      >
        Torna alla Home
      </Link>
    </div>
  );
}
