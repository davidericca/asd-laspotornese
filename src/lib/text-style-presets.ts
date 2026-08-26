// Preset di stile per i testi personalizzabili della home (titolo hero +
// presentazione). Deliberatamente limitati alla palette e ai font gia'
// usati nel sito, cosi' l'admin puo' personalizzare senza romperne la
// coerenza grafica. Condivisi tra il form in admin e il rendering pubblico.

export const TEXT_COLOR_PRESETS = {
  bianco: "text-primary-foreground",
  arancione: "text-accent",
  teal: "text-accent-teal",
  oro: "text-accent-gold",
} as const;

export const TEXT_FONT_PRESETS = {
  titolo: "font-heading",
  testo: "font-sans",
  mono: "font-mono",
} as const;

export const HERO_TITLE_SIZE_PRESETS = {
  "molto-piccolo": "text-[clamp(1.6rem,4vw,2.4rem)]",
  piccolo: "text-[clamp(2rem,6vw,3.5rem)]",
  medio: "text-[clamp(3rem,9vw,6rem)]",
  grande: "text-[clamp(3.5rem,11vw,7.5rem)]",
  "molto-grande": "text-[clamp(4rem,13vw,9rem)]",
} as const;

export const BODY_TEXT_SIZE_PRESETS = {
  "molto-piccolo": "text-xs",
  piccolo: "text-sm",
  medio: "text-base",
  grande: "text-lg",
  "molto-grande": "text-xl",
} as const;

export type TextColorKey = keyof typeof TEXT_COLOR_PRESETS;
export type TextFontKey = keyof typeof TEXT_FONT_PRESETS;
export type HeroTitleSizeKey = keyof typeof HERO_TITLE_SIZE_PRESETS;
export type BodyTextSizeKey = keyof typeof BODY_TEXT_SIZE_PRESETS;

export const COLOR_LABELS: Record<TextColorKey, string> = {
  bianco: "Bianco",
  arancione: "Arancione",
  teal: "Verde acqua",
  oro: "Oro",
};

export const FONT_LABELS: Record<TextFontKey, string> = {
  titolo: "Manrope (titoli)",
  testo: "Manrope (testo)",
  mono: "Manrope (dati)",
};

export const HERO_SIZE_LABELS: Record<HeroTitleSizeKey, string> = {
  "molto-piccolo": "Molto piccolo (circa 38px)",
  piccolo: "Piccolo (circa 56px)",
  medio: "Medio (circa 96px) — attuale",
  grande: "Grande (circa 120px)",
  "molto-grande": "Molto grande (circa 144px)",
};

export const BODY_SIZE_LABELS: Record<BodyTextSizeKey, string> = {
  "molto-piccolo": "Molto piccolo (12px)",
  piccolo: "Piccolo (14px)",
  medio: "Medio (16px) — attuale",
  grande: "Grande (18px)",
  "molto-grande": "Molto grande (20px)",
};

function pick<T extends Record<string, string>>(map: T, value: string, fallback: keyof T): T[keyof T] {
  return (value in map ? map[value as keyof T] : map[fallback]) as T[keyof T];
}

export function colorClass(value: string) {
  return pick(TEXT_COLOR_PRESETS, value, "bianco");
}

export function fontClass(value: string, fallback: TextFontKey) {
  return pick(TEXT_FONT_PRESETS, value, fallback);
}

export function heroTitleSizeClass(value: string) {
  return pick(HERO_TITLE_SIZE_PRESETS, value, "medio");
}

export function bodyTextSizeClass(value: string) {
  return pick(BODY_TEXT_SIZE_PRESETS, value, "medio");
}
