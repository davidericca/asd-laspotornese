import sharp from "sharp";

const MAX_WIDTH = 2000;
const WEBP_QUALITY = 82;

export interface OptimizedImage {
  buffer: Buffer;
  width: number;
  height: number;
  contentType: string;
  extension: string;
}

/**
 * Ottimizza automaticamente un'immagine caricata dall'amministratore:
 * corregge l'orientamento (EXIF), la ridimensiona se troppo grande e la
 * converte in WebP per ridurre il peso del file, mantenendo una buona
 * qualità visiva. Così le gallerie restano leggere e veloci da caricare
 * anche da smartphone con connessione lenta.
 */
export async function optimizeImage(input: Buffer): Promise<OptimizedImage> {
  const pipeline = sharp(input).rotate();
  const metadata = await pipeline.metadata();

  const resized =
    metadata.width && metadata.width > MAX_WIDTH
      ? pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true })
      : pipeline;

  const { data, info } = await resized
    .webp({ quality: WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    width: info.width,
    height: info.height,
    contentType: "image/webp",
    extension: "webp",
  };
}
