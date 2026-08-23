// Il piano gratuito Supabase puo' "addormentarsi" ed e' comunque possibile
// che la rete si blocchi: senza timeout una richiesta appesa rallenterebbe
// l'intero sito. Vedi sezione 6 della guida.
const TIMEOUT_MS = 8000;

export function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timeout),
  );
}
