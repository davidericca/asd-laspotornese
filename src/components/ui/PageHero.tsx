import { Container } from "@/components/ui/Container";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-primary-950 py-14 sm:py-16 text-center text-white">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-wider text-secondary-300">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-xl text-primary-200">{subtitle}</p>
        )}
      </Container>
    </section>
  );
}
