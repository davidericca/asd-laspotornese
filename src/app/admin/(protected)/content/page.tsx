import { getAdminSiteContent } from "@/lib/data/site-content";
import { updateSiteContent, updateHeroImage } from "@/actions/site-content";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ImageFocalPointPicker } from "@/components/admin/forms/ImageFocalPointPicker";
import {
  COLOR_LABELS,
  FONT_LABELS,
  HERO_SIZE_LABELS,
  BODY_SIZE_LABELS,
} from "@/lib/text-style-presets";
import { fileInputClass } from "@/lib/ui";

const selectClass = "rounded border border-border bg-transparent px-3 py-2 text-sm";

function StyleSelects({
  namePrefix,
  content,
  sizeLabels,
}: {
  namePrefix: "home_hero_title" | "home_intro";
  content: Record<string, string>;
  sizeLabels: Record<string, string>;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        Colore
        <select
          name={`${namePrefix}_color`}
          defaultValue={content[`${namePrefix}_color`] || "bianco"}
          className={selectClass}
        >
          {Object.entries(COLOR_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        Font
        <select
          name={`${namePrefix}_font`}
          defaultValue={content[`${namePrefix}_font`] || (namePrefix === "home_hero_title" ? "titolo" : "testo")}
          className={selectClass}
        >
          {Object.entries(FONT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-muted-foreground">
        Dimensione
        <select
          name={`${namePrefix}_size`}
          defaultValue={content[`${namePrefix}_size`] || "medio"}
          className={selectClass}
        >
          {Object.entries(sizeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

const fieldClass =
  "rounded border border-border bg-transparent px-3 py-2";

export default async function AdminContentPage() {
  const content = await getAdminSiteContent();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Testi del sito</h1>
      <p className="mt-2 max-w-lg text-sm text-muted-foreground">
        Le attività ora si gestiscono da &quot;Gestisci attività&quot; nella dashboard, una scheda per volta.
      </p>
      <form action={updateHeroImage} className="mt-6 flex max-w-lg flex-col gap-3">
        <label className="flex flex-col gap-2 text-sm">
          Home &mdash; foto di copertina
          <input type="file" name="hero_image" accept="image/*" className={fileInputClass} />
        </label>
        <p className="-mt-2 text-xs text-muted-foreground">
          Scegli il file, poi premi &quot;Carica foto&quot; qui sotto: solo allora viene caricato davvero.
        </p>
        {content.home_hero_image_url && (
          <p className="-mt-1 text-xs text-muted-foreground">
            Foto attuale. Caricandone una nuova la sostituirai.
          </p>
        )}
        <ImageFocalPointPicker
          positionFieldName="home_hero_image_position"
          fileFieldName="hero_image"
          aspect="16 / 7"
          currentImageUrl={content.home_hero_image_url || null}
          currentPosition={content.home_hero_image_position || null}
        />
        <p className="-mt-1 text-xs font-medium text-accent">
          Importante: dopo aver cliccato sulla foto, premi il pulsante qui sotto (non &quot;Salva&quot;
          più in basso, che appartiene ai testi) per salvare la posizione scelta.
        </p>
        <SubmitButton className="self-start rounded-xs bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover">
          Salva foto e inquadratura
        </SubmitButton>
      </form>
      <form action={updateSiteContent} className="mt-10 flex max-w-lg flex-col gap-6">
        <label className="flex flex-col gap-1 text-sm">
          Home &mdash; titolo grande sopra la foto
          <textarea
            name="home_hero_title"
            rows={2}
            placeholder={"ASD LA\nSPOTORNESE"}
            defaultValue={content.home_hero_title}
            className={fieldClass}
          />
        </label>
        <p className="-mt-4 text-xs text-muted-foreground">
          Vai a capo per spezzare il titolo su più righe. Lascia vuoto per usare
          &quot;ASD La Spotornese&quot;.
        </p>
        <StyleSelects namePrefix="home_hero_title" content={content} sizeLabels={HERO_SIZE_LABELS} />
        <label className="flex flex-col gap-1 text-sm">
          Home &mdash; presentazione
          <textarea
            name="home_intro"
            rows={3}
            defaultValue={content.home_intro}
            className={fieldClass}
          />
        </label>
        <StyleSelects namePrefix="home_intro" content={content} sizeLabels={BODY_SIZE_LABELS} />
        <label className="flex flex-col gap-1 text-sm">
          Chi siamo
          <textarea
            name="chi_siamo"
            rows={6}
            defaultValue={content.chi_siamo}
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Codice Fiscale / P.IVA
          <input
            type="text"
            name="cf_piva"
            defaultValue={content.cf_piva}
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Contatti &mdash; indirizzo
          <input
            type="text"
            name="contatti_indirizzo"
            defaultValue={content.contatti_indirizzo}
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Contatti &mdash; telefono
          <input
            type="text"
            name="contatti_telefono"
            defaultValue={content.contatti_telefono}
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Contatti &mdash; email
          <input
            type="email"
            name="contatti_email"
            defaultValue={content.contatti_email}
            className={fieldClass}
          />
        </label>
        <SubmitButton className="self-start rounded-xs bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary-hover">
          Salva
        </SubmitButton>
      </form>
    </div>
  );
}
