import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedSiteContent } from "@/lib/data/site-content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Chi siamo",
  description: "Storia e valori dell'ASD La Spotornese.",
};

export default async function ChiSiamoPage() {
  const content = await getPublishedSiteContent();

  return (
    <PageHeader
      title="Chi siamo"
      description={content.chi_siamo || "[INSERIRE storia e valori dell'associazione]"}
    />
  );
}
