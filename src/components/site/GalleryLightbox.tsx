"use client";

import { useEffect, useState } from "react";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import type { ImageRow } from "@/lib/data/galleries";
import { cardClass } from "@/lib/ui";

export function GalleryLightbox({ images }: { images: ImageRow[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;

    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex, images.length]);

  const current = openIndex !== null ? images[openIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="cursor-pointer text-left"
          >
            <div className={`aspect-square w-full overflow-hidden ${cardClass}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt_text ?? ""}
                className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
              />
            </div>
            {image.alt_text && (
              <p className="mt-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                {image.alt_text}
              </p>
            )}
          </button>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-10"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Chiudi"
            className="absolute top-4 right-4 cursor-pointer p-2 text-white/80 transition hover:text-white"
          >
            <X size={28} weight="bold" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex((openIndex! - 1 + images.length) % images.length);
                }}
                aria-label="Foto precedente"
                className="absolute left-2 cursor-pointer p-2 text-white/80 transition hover:text-white sm:left-4"
              >
                <CaretLeft size={32} weight="bold" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex((openIndex! + 1) % images.length);
                }}
                aria-label="Foto successiva"
                className="absolute right-2 cursor-pointer p-2 text-white/80 transition hover:text-white sm:right-4"
              >
                <CaretRight size={32} weight="bold" />
              </button>
            </>
          )}

          <div className="flex max-h-full max-w-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={current.alt_text ?? ""}
              className="max-h-[80vh] max-w-full object-contain"
            />
            {current.alt_text && (
              <p className="mt-3 font-mono text-xs tracking-widest text-white/70 uppercase">
                {current.alt_text}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
