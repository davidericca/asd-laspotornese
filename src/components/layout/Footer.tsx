export function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-black/60 dark:text-white/60">
        <p>
          &copy; {new Date().getFullYear()} ASD La Spotornese. Tutti i diritti
          riservati.
        </p>
      </div>
    </footer>
  );
}
