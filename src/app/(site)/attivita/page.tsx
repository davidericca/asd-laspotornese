import { PageHeader } from "@/components/ui/PageHeader";
import { getPublishedSiteContent } from "@/lib/data/site-content";

export const revalidate = 60;

export default async function AttivitaPage() {
  const content = await getPublishedSiteContent();

  return (
    <PageHeader
      title="Attività"
      description={content.attivita || "[INSERIRE elenco delle attività sportive proposte]"}
    />
  );
}
