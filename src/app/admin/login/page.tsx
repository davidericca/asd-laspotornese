import { login } from "@/actions/auth";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default async function LoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-bold">Accesso amministratore</h1>
      <form action={login} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            name="email"
            required
            className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            name="password"
            required
            className="rounded border border-black/20 bg-transparent px-3 py-2 dark:border-white/20"
          />
        </label>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {Array.isArray(error) ? error[0] : error}
          </p>
        )}
        <SubmitButton className="rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
          Accedi
        </SubmitButton>
      </form>
    </div>
  );
}
