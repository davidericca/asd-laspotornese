export function Footer() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} ASD La Spotornese. Tutti i diritti
          riservati.
        </p>
      </div>
    </footer>
  );
}
