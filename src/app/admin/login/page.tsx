"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, type AuthActionState } from "@/actions/auth";
import { SITE } from "@/lib/constants";

const initialState: AuthActionState = {};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    signIn,
    initialState
  );
  const searchParams = useSearchParams();
  const notAuthorized = searchParams.get("error") === "not_authorized";

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary-500/20 text-secondary-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-8 w-8"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36 6.36-.7-.7M6.34 6.34l-.7-.7m12.02 0-.7.7M6.34 17.66l-.7.7M12 8a4 4 0 100 8 4 4 0 000-8Z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white">
            Area amministratore
          </h1>
          <p className="mt-1 text-sm text-primary-200">
            {SITE.name} — accesso riservato
          </p>
        </div>

        <form
          action={formAction}
          className="rounded-2xl bg-white p-8 shadow-xl space-y-5"
        >
          {(state.error || notAuthorized) && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {state.error ??
                "Il tuo account non è abilitato come amministratore."}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/30 outline-none transition"
              placeholder="nome@esempio.it"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/30 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-primary-800 px-4 py-2.5 font-medium text-white transition hover:bg-primary-900 disabled:opacity-60"
          >
            {isPending ? "Accesso in corso…" : "Accedi"}
          </button>

          <p className="text-center text-xs text-slate-400">
            Solo per l&apos;amministratore autorizzato del sito.
          </p>
        </form>
      </div>
    </div>
  );
}
