export function PageHeader({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
}) {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex min-h-[200px] max-w-5xl flex-col justify-center px-6 py-12 sm:min-h-[240px] sm:py-16">
        {eyebrow && (
          <p className="font-mono text-xs font-bold tracking-widest text-accent uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className={`font-heading text-3xl font-bold sm:text-4xl ${eyebrow ? "mt-2" : ""}`}>
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl whitespace-pre-line text-primary-foreground/80">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
