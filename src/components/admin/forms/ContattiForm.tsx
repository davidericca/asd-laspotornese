"use client";

import { useState, useTransition } from "react";
import { saveSiteContent } from "@/actions/site-content";
import type { ContactInfo } from "@/lib/data/site-content";

export function ContattiForm({ contact }: { contact: ContactInfo }) {
  const [form, setForm] = useState(contact);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function update<K extends keyof ContactInfo>(key: K, value: ContactInfo[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    startTransition(async () => {
      await saveSiteContent({
        contact_address: form.address,
        contact_city: form.city,
        contact_email: form.email,
        contact_phone: form.phone,
        contact_vat: form.vatOrFiscalCode,
        contact_social_facebook: form.social.facebook,
        contact_social_instagram: form.social.instagram,
        contact_social_youtube: form.social.youtube,
        contact_map_lat: form.mapLat,
        contact_map_lng: form.mapLng,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="max-w-xl space-y-5">
      <TextField label="Indirizzo" value={form.address} onChange={(v) => update("address", v)} />
      <TextField label="Città" value={form.city} onChange={(v) => update("city", v)} />
      <TextField label="Email" value={form.email} onChange={(v) => update("email", v)} />
      <TextField label="Telefono" value={form.phone} onChange={(v) => update("phone", v)} />
      <TextField
        label="Codice Fiscale / P.IVA"
        value={form.vatOrFiscalCode}
        onChange={(v) => update("vatOrFiscalCode", v)}
      />
      <TextField
        label="Link Facebook"
        value={form.social.facebook}
        onChange={(v) => setForm((f) => ({ ...f, social: { ...f.social, facebook: v } }))}
      />
      <TextField
        label="Link Instagram"
        value={form.social.instagram}
        onChange={(v) => setForm((f) => ({ ...f, social: { ...f.social, instagram: v } }))}
      />
      <TextField
        label="Link YouTube"
        value={form.social.youtube}
        onChange={(v) => setForm((f) => ({ ...f, social: { ...f.social, youtube: v } }))}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Latitudine mappa"
          value={String(form.mapLat)}
          onChange={(v) => update("mapLat", Number(v) || 0)}
        />
        <TextField
          label="Longitudine mappa"
          value={String(form.mapLng)}
          onChange={(v) => update("mapLng", Number(v) || 0)}
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60"
      >
        {isPending ? "Salvataggio…" : saved ? "Salvato ✓" : "Salva contatti"}
      </button>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="input" />
    </div>
  );
}
