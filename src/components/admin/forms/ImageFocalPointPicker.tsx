"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MagnifyingGlassMinus, MagnifyingGlassPlus } from "@phosphor-icons/react";

function parseAspect(aspect: string) {
  const [w, h] = aspect.split("/").map((n) => parseFloat(n.trim()));
  return w / h || 1;
}

function parsePosition(value: string | null) {
  const parts = (value ?? "50% 50%").split(" ");
  const x = parseFloat(parts[0]);
  const y = parseFloat(parts[1]);
  return { x: Number.isFinite(x) ? x : 50, y: Number.isFinite(y) ? y : 50 };
}

const FRAME_WIDTH = 360;

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
  const ratio = parseAspect(aspect);
  const frameW = FRAME_WIDTH;
  const frameH = FRAME_WIDTH / ratio;

  const [sourceUrl, setSourceUrl] = useState<string | null>(currentImageUrl);
  const [isNewFile, setIsNewFile] = useState(false);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [touched, setTouched] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startX: number; startY: number; startPan: { x: number; y: number } } | null>(
    null,
  );

  // Carica una nuova foto scelta dall'input file
  useEffect(() => {
    if (!fileFieldName) return;
    const form = wrapRef.current?.closest("form");
    const input = form?.elements.namedItem(fileFieldName);
    if (!(input instanceof HTMLInputElement)) return;

    function onChange() {
      const file = (input as HTMLInputElement).files?.[0];
      if (file) {
        setSourceUrl(URL.createObjectURL(file));
        setIsNewFile(true);
        setNatural(null);
        setZoom(1);
      }
    }
    input.addEventListener("change", onChange);
    return () => input.removeEventListener("change", onChange);
  }, [fileFieldName]);

  const baseScale = natural ? Math.max(frameW / natural.w, frameH / natural.h) : 0;
  const renderScale = baseScale * zoom;
  const renderedW = natural ? natural.w * renderScale : 0;
  const renderedH = natural ? natural.h * renderScale : 0;

  const clampPan = useCallback(
    (p: { x: number; y: number }) => ({
      x: Math.min(0, Math.max(frameW - renderedW, p.x)),
      y: Math.min(0, Math.max(frameH - renderedH, p.y)),
    }),
    [frameW, frameH, renderedW, renderedH],
  );

  function onImageLoad() {
    const el = imgRef.current;
    if (!el) return;
    const w = el.naturalWidth;
    const h = el.naturalHeight;
    setNatural({ w, h });
    const base = Math.max(frameW / w, frameH / h);
    // parte dal punto di inquadratura gia' salvato, se c'e'
    const { x: px, y: py } = parsePosition(isNewFile ? null : currentPosition);
    const rw = w * base;
    const rh = h * base;
    setPan({
      x: Math.min(0, Math.max(frameW - rw, -((px / 100) * rw - frameW / 2))),
      y: Math.min(0, Math.max(frameH - rh, -((py / 100) * rh - frameH / 2))),
    });
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, startPan: pan };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    if (dx !== 0 || dy !== 0) setTouched(true);
    setPan(clampPan({ x: dragState.current.startPan.x + dx, y: dragState.current.startPan.y + dy }));
  }

  function onPointerUp() {
    dragState.current = null;
  }

  function changeZoom(next: number) {
    const clamped = Math.min(3, Math.max(1, next));
    setTouched(true);
    if (!natural) {
      setZoom(clamped);
      return;
    }
    const rw = natural.w * baseScale * clamped;
    const rh = natural.h * baseScale * clamped;
    // mantiene centrato il punto attualmente al centro della cornice mentre si zooma
    const centerX = (frameW / 2 - pan.x) / renderedW;
    const centerY = (frameH / 2 - pan.y) / renderedH;
    setZoom(clamped);
    setPan(
      clampPan({
        x: frameW / 2 - centerX * rw,
        y: frameH / 2 - centerY * rh,
      }),
    );
  }

  // Genera il ritaglio finale (canvas) e lo mette al posto del file originale,
  // cosi' quello che si vede nell'editor e' esattamente quello che viene salvato.
  useEffect(() => {
    if (!touched || !natural || !imgRef.current) return;
    const timeout = setTimeout(() => {
      const el = imgRef.current;
      if (!el) return;
      const outputW = 1200;
      const outputH = Math.round(1200 / ratio);
      const canvas = document.createElement("canvas");
      canvas.width = outputW;
      canvas.height = outputH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const sx = -pan.x / renderScale;
      const sy = -pan.y / renderScale;
      const sw = frameW / renderScale;
      const sh = frameH / renderScale;
      ctx.drawImage(el, sx, sy, sw, sh, 0, 0, outputW, outputH);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          if (fileFieldName) {
            const form = wrapRef.current?.closest("form");
            const input = form?.elements.namedItem(fileFieldName);
            if (input instanceof HTMLInputElement) {
              const file = new File([blob], "ritaglio.jpg", { type: "image/jpeg" });
              const dt = new DataTransfer();
              dt.items.add(file);
              input.files = dt.files;
            }
          }
        },
        "image/jpeg",
        0.92,
      );
    }, 200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pan, zoom, natural, fileFieldName]);

  if (!sourceUrl) return null;

  return (
    <div ref={wrapRef} className="flex flex-col gap-2">
      <p className="text-sm">
        Inquadratura{" "}
        <span className="text-xs text-muted-foreground">
          — trascina la foto per spostarla, usa lo zoom per ingrandire
        </span>
      </p>
      <div
        className="relative touch-none overflow-hidden rounded border border-border bg-muted select-none"
        style={{ width: frameW, height: frameH, cursor: natural ? "move" : "default" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={sourceUrl}
          alt=""
          draggable={false}
          onLoad={onImageLoad}
          className="pointer-events-none absolute top-0 left-0 max-w-none"
          style={{
            width: natural ? renderedW : undefined,
            height: natural ? renderedH : undefined,
            transform: `translate(${pan.x}px, ${pan.y}px)`,
            visibility: natural ? "visible" : "hidden",
          }}
        />
      </div>
      <div className="flex max-w-xs items-center gap-2">
        <MagnifyingGlassMinus size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => changeZoom(parseFloat(e.target.value))}
          className="w-full"
          aria-label="Zoom"
        />
        <MagnifyingGlassPlus size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
      </div>
      <input
        type="hidden"
        name={positionFieldName}
        value={touched ? "50% 50%" : (currentPosition ?? "50% 50%")}
      />
    </div>
  );
}
