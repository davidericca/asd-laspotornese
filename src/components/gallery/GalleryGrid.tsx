"use client";

import { useState } from "react";
import Image from "next/image";
import type { ImageRow } from "@/lib/types";
import { Lightbox } from "@/components/gallery/Lightbox";

/**
 * Griglia fotografica "masonry-like" con apertura a schermo intero
 * (lightbox) al click. Usata sia nella pagina Galleria che nel dettaglio
 * di una singola galleria/evento.
 */
export function GalleryGrid({ images }: { images: ImageRow[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
        Nessuna fotografia disponibile in questa galleria per ora.
      </p>
    );
  }

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4 [&>*]:mb-3 sm:[&>*]:mb-4">
        {images.map((image, i) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group relative block w-full overflow-hidden rounded-xl bg-primary-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500"
          >
            <Image
              src={image.url}
              alt={image.alt_text || image.title || "Fotografia della galleria"}
              width={image.width ?? 600}
              height={image.height ?? 400}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="w-full object-cover transition duration-300 group-hover:scale-[1.03] group-hover:brightness-95"
            />
            {image.title && (
              <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-left text-xs text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {image.title}
              </span>
            )}
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          images={images}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </>
  );
}
