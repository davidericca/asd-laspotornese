"use client";

import { useState, useTransition } from "react";
import { saveSiteContent } from "@/actions/site-content";

export function ContenutiForm({
  heroSubtitle,
  aboutText,
  missionText,
}: {
  heroSubtitle: string;
  aboutText: string;
  missionText: string;
}) {
  const [hero, setHero] = useState(heroSubtitle);
  const [about, setAbout] = useState(aboutText);
  const [mission, setMission] = useState(missionText);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await saveSiteContent({
        home_hero_subtitle: hero,
        about_text: about,
        mission_text: mission,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Sottotitolo Home (sotto il nome della società)
        </label>
        <textarea
          value={hero}
          onChange={(e) => setHero(e.target.value)}
          rows={2}
          className="input"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Storia della società (pagina &quot;La Società&quot;)
        </label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          rows={8}
          className="input"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Missione / obiettivi (pagina &quot;La Società&quot;)
        </label>
        <textarea
          value={mission}
          onChange={(e) => setMission(e.target.value)}
          rows={5}
          className="input"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60"
      >
        {isPending ? "Salvataggio…" : saved ? "Salvato ✓" : "Salva contenuti"}
      </button>

      <p className="text-xs text-slate-400">
        Nota: le attività proposte (pagina &quot;Attività&quot; e sezione in
        Home) e i dati fissi non presenti qui si modificano dal file
        src/lib/constants.ts nel codice sorgente.
      </p>
    </div>
  );
}
