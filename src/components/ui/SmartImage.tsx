import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Wrapper attorno a next/image che mostra un placeholder grafico coerente
 * col brand quando l'immagine non è ancora stata caricata (es. evento o
 * news senza foto di copertina). Evita spazi vuoti o icone rotte.
 */
export function SmartImage({
  src,
  alt,
  className,
  sizes,
  fill = true,
  priority,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-primary-800 via-primary-700 to-secondary-700",
          className
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          className="h-10 w-10 text-white/40"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12c3-4 6-6 9-6s6 2 9 6c-3 4-6 6-9 6s-6-2-9-6Z"
          />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes ?? "(min-width: 1024px) 33vw, 100vw"}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
