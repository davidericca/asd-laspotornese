export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-12 pb-8">
      <h1 className="font-heading text-3xl font-semibold">{title}</h1>
      {description && (
        <p className="mt-2 whitespace-pre-line text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
