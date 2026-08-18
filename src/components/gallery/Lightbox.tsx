"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";
import type { ImageRow } from "@/lib/types";

/**
 * Visualizzatore fullscreen (lightbox) per una galleria di immagini.
 * Supporta navigazione con le frecce della tastiera e chiusura con ESC.
 */
export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: ImageRow[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const image = images[index];

  const goNext = useCallback(
    () => onNavigate((index + 1) % images.length),
    [index, images.length, onNavigate]
  );
  const goPrev = useCallback(
    () => onNavigate((index - 1 + images.length) % images.length),
    [index, images.length, onNavigate]
  );

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [goNext, goPrev, onClose]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm animate-fade-in-up"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="flex items-center justify-between p-4 text-white">
        <p className="text-sm text-white/70">
          {index + 1} / {images.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div
        className="relative flex-1 px-4 pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mx-auto h-full max-w-5xl">
          <Image
            src={image.url}
            alt={image.alt_text || image.title || "Fotografia"}
            fill
            sizes="90vw"
            className="object-contain"
            priority
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Immagine precedente"
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Immagine successiva"
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {(image.title || image.description) && (
        <div
          className="px-6 pb-6 text-center text-white/80"
          onClick={(e) => e.stopPropagation()}
        >
          {image.title && <p className="font-medium text-white">{image.title}</p>}
          {image.description && (
            <p className="mt-1 text-sm text-white/60">{image.description}</p>
          )}
        </div>
      )}
    </div>
  );
}
