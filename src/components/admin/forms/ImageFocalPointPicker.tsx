"use client";

import { useEffect, useRef, useState } from "react";

function clamp(n: number) {
  return Math.min(100, Math.max(0, n));
}

function parsePosition(value: string | null) {
  const parts = (value ?? "50% 50%").split(" ");
  const x = parseFloat(parts[0]) || 50;
  const y = parseFloat(parts[1]) || 50;
  return { x, y };
}

export function ImageFocalPointPicker({
  positionFieldName,
  fileFieldName,
  aspect = "16 / 10",
  currentImageUrl,
  currentPosition,
}: {
  positionFieldName: string;
  fileFieldName?: string;
  aspect?: string;
  currentImageUrl: string | null;
  currentPosition: string | null;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
  const [{ x, y }, setPoint] = useState(() => parsePosition(currentPosition));
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fileFieldName) return;
    const form = wrapRef.current?.closest("form");
    const input = form?.elements.namedItem(fileFieldName);
    if (!(input instanceof HTMLInputElement)) return;

    function onChange() {
      const file = (input as HTMLInputElement).files?.[0];
      if (file) {
        setPreviewUrl(URL.createObjectURL(file));
        setPoint({ x: 50, y: 50 });
      }
    }
    input.addEventListener("change", onChange);
    return () => input.removeEventListener("change", onChange);
  }, [fileFieldName]);

  function handlePick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setPoint({
      x: clamp(Math.round(((e.clientX - rect.left) / rect.width) * 100)),
      y: clamp(Math.round(((e.clientY - rect.top) / rect.height) * 100)),
    });
  }

  if (!previewUrl) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">
        Punto di inquadratura{" "}
        <span className="text-xs text-muted-foreground">
          — clicca sulla foto per scegliere cosa resta sempre visibile quando viene ritagliata
        </span>
      </p>
      <div
        ref={wrapRef}
        onClick={handlePick}
        className="relative w-full max-w-xs cursor-crosshair overflow-hidden rounded border border-border bg-muted"
        style={{ aspectRatio: aspect }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: `${x}% ${y}%` }}
        />
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-accent shadow"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      </div>
      <input type="hidden" name={positionFieldName} value={`${x}% ${y}%`} />
    </div>
  );
}
