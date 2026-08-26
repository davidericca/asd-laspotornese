import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";

// Chiamato da navigator.sendBeacon quando si chiude la scheda/il browser
// mentre si e' nell'area admin, per invalidare subito la sessione.
export async function POST() {
  const supabase = await getServerSupabase();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
