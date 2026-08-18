export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary-600">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold text-primary-950 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={
            "mt-3 max-w-2xl text-base text-slate-600" +
            (align === "center" ? " mx-auto" : "")
          }
        >
          {description}
        </p>
      )}
    </div>
  );
}
