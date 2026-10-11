import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

// Secondo "risveglio" anti-pausa del piano gratuito Supabase, chiamato ogni
// giorno da Vercel Cron (vedi vercel.json). Affianca quello su GitHub
// Actions: se uno dei due smette di girare, l'altro tiene comunque sveglio
// il database. Se la scrittura fallisce risponde 500, cosi' Vercel segna
// l'esecuzione come fallita.
export async function GET() {
  const { data, error } = await supabasePublic.rpc("keepalive_ping");
  if (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true, last_ping: data });
}
