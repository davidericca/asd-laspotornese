import { ContenutiForm } from "@/components/admin/forms/ContenutiForm";
import { getSiteContent } from "@/lib/data/site-content";
import { SITE } from "@/lib/constants";

export default async function AdminContenutiPage() {
  const [heroSubtitle, aboutText, missionText] = await Promise.all([
    getSiteContent("home_hero_subtitle", SITE.shortDescription),
    getSiteContent("about_text", SITE.aboutText),
    getSiteContent("mission_text", SITE.mission),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-primary-900">
        Contenuti pagine
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Modifica i testi principali del sito senza bisogno di toccare il
        codice.
      </p>
      <div className="mt-8">
        <ContenutiForm
          heroSubtitle={heroSubtitle}
          aboutText={aboutText}
          missionText={missionText}
        />
      </div>
    </div>
  );
}
