/**
 * Informazioni statiche della società.
 *
 * NOTA IMPORTANTE: tutti i valori contrassegnati con [INSERIRE ...] sono
 * placeholder. Vanno sostituiti con le informazioni reali della ASD La
 * Spotornese non appena disponibili. Questo è l'UNICO file da modificare
 * per aggiornare i dati "fissi" del sito (nome, indirizzo, social, ecc.).
 * I contenuti dinamici (eventi, news, immagini) si gestiscono invece dal
 * pannello di amministrazione, non da qui.
 */

export const SITE = {
  name: "ASD La Spotornese",
  fullName: "ASD La Spotornese – Società di Pesca Sportiva",
  shortDescription:
    "Associazione Sportiva Dilettantistica dedicata alla pesca sportiva, alla tutela dell'ambiente acquatico e alla passione condivisa per il mare.",
  // Testo lungo mostrato nella pagina "La Società"
  aboutText: `[INSERIRE STORIA DELLA SOCIETÀ]

Racconta qui quando è nata l'associazione, da chi è stata fondata, quali sono
i valori e gli obiettivi, e qualche tappa significativa della sua storia.`,
  mission:
    "[INSERIRE MISSION/OBIETTIVI DELL'ASSOCIAZIONE — es. promozione della pesca sportiva, tutela dell'ambiente marino, aggregazione sociale, avviamento dei giovani allo sport]",

  address: "[INSERIRE INDIRIZZO]",
  city: "Spotorno (SV)",
  email: "[INSERIRE EMAIL]",
  phone: "[INSERIRE TELEFONO]",
  vatOrFiscalCode: "[INSERIRE CODICE FISCALE / P.IVA]",

  // Coordinate usate per la mappa nella pagina Contatti (placeholder: Spotorno centro)
  mapLat: 44.2286,
  mapLng: 8.4136,

  social: {
    facebook: "[INSERIRE LINK FACEBOOK]",
    instagram: "[INSERIRE LINK INSTAGRAM]",
    youtube: "[INSERIRE LINK YOUTUBE]",
  },

  // URL del sito quando sarà online (usato per SEO/Open Graph/sitemap)
  url: "https://www.laspotornese.it",

  logoAlt: "Logo ASD La Spotornese [INSERIRE LOGO]",

  // ID di Google Analytics (lasciare vuoto per disattivare). Da inserire in futuro.
  googleAnalyticsId: "",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/la-societa", label: "La Società" },
  { href: "/attivita", label: "Attività" },
  { href: "/eventi", label: "Eventi & Gare" },
  { href: "/news", label: "News" },
  { href: "/galleria", label: "Galleria" },
  { href: "/contatti", label: "Contatti" },
] as const;

export const ACTIVITIES_PLACEHOLDER = [
  {
    title: "Pesca sportiva in mare",
    description:
      "[INSERIRE INFORMAZIONI ATTIVITÀ — es. uscite di pesca in barca o da riva, specie target, periodi consigliati]",
    icon: "anchor",
  },
  {
    title: "Gare sociali",
    description:
      "[INSERIRE INFORMAZIONI ATTIVITÀ — es. calendario gare interne, regolamento, categorie]",
    icon: "trophy",
  },
  {
    title: "Corsi e avviamento allo sport",
    description:
      "[INSERIRE INFORMAZIONI ATTIVITÀ — es. corsi per giovani, uscite didattiche, sicurezza in mare]",
    icon: "users",
  },
  {
    title: "Tutela dell'ambiente marino",
    description:
      "[INSERIRE INFORMAZIONI ATTIVITÀ — es. giornate ecologiche, pulizia delle coste, sensibilizzazione]",
    icon: "waves",
  },
] as const;
