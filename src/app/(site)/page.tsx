import { getPublishedSiteContent } from "@/lib/data/site-content";

export const revalidate = 60;

export default async function HomePage() {
  const content = await getPublishedSiteContent();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold">ASD La Spotornese</h1>
      <p className="mt-4 max-w-2xl whitespace-pre-line text-black/60 dark:text-white/60">
        {content.home_intro || "[INSERIRE presentazione breve dell'associazione]"}
      </p>
    </div>
  );
}
