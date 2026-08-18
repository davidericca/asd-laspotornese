import Script from "next/script";
import { SITE } from "@/lib/constants";

/**
 * Google Analytics (o strumento equivalente) — al momento disattivato.
 * Per attivarlo in futuro: inserisci il tuo Measurement ID (es. "G-XXXXXXX")
 * in SITE.googleAnalyticsId dentro src/lib/constants.ts. Finché resta vuoto,
 * questo componente non carica nulla, quindi non impatta le prestazioni né
 * la privacy dei visitatori.
 */
export function GoogleAnalytics() {
  if (!SITE.googleAnalyticsId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${SITE.googleAnalyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${SITE.googleAnalyticsId}');
        `}
      </Script>
    </>
  );
}
