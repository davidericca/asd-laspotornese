"use client";

import { useEffect, useRef } from "react";
import { logout } from "@/actions/auth";

const INACTIVITY_LIMIT_MS = 60 * 60 * 1000; // 1 ora

// Disconnette automaticamente dall'admin dopo un'ora di inattivita', o subito
// quando la scheda/il browser viene chiuso (non alla semplice navigazione tra
// pagine admin, che in Next.js non scarica mai davvero il documento).
export function AdminSessionGuard() {
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        formRef.current?.requestSubmit();
      }, INACTIVITY_LIMIT_MS);
    }

    function onPageHide(event: PageTransitionEvent) {
      // event.persisted = true significa che la pagina va solo nella cache
      // del browser (es. tasto "indietro"), non che e' stata chiusa davvero.
      if (event.persisted) return;
      navigator.sendBeacon("/api/logout-beacon");
    }

    const activityEvents = ["mousemove", "keydown", "mousedown", "scroll", "touchstart"] as const;
    activityEvents.forEach((name) => window.addEventListener(name, resetTimer, { passive: true }));
    window.addEventListener("pagehide", onPageHide);
    resetTimer();

    return () => {
      activityEvents.forEach((name) => window.removeEventListener(name, resetTimer));
      window.removeEventListener("pagehide", onPageHide);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <form ref={formRef} action={logout} className="hidden" aria-hidden="true">
      <button type="submit" tabIndex={-1} aria-hidden="true" />
    </form>
  );
}
