export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-12 pb-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && (
        <p className="mt-2 text-black/60 dark:text-white/60">{description}</p>
      )}
    </div>
  );
}
