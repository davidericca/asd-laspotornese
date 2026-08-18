import { signOut } from "@/actions/auth";

export function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
      >
        Esci
      </button>
    </form>
  );
}
