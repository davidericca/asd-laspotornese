import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/constants";

export function Hero({ subtitle }: { subtitle: string }) {
  return (
    <section className="relative overflow-hidden bg-primary-950">
      {/* Immagine hero: sostituire il gradiente con una fotografia reale
          (es. tramonto sul mare, gara di pesca, uscita in barca) non
          appena disponibile — vedi indicazioni nel README. */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-950 to-secondary-950" />
      <div className="absolute inset-0 opacity-20 bg-wave-pattern" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary-500/20 blur-3xl" />
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />

      <Container className="relative flex min-h-[80vh] flex-col justify-center py-24 sm:min-h-[85vh]">
        <div className="animate-fade-in-up max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-secondary-200">
            Associazione Sportiva Dilettantistica
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {SITE.name}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-primary-100">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/la-societa" variant="primary">
              Scopri la società
            </Button>
            <Button href="/eventi" variant="outline">
              Prossime gare
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
