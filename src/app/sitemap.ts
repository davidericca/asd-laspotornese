import type { MetadataRoute } from "next";
import { getAllPublicEvents } from "@/lib/data/events";
import { getAllPublicNews } from "@/lib/data/news";
import { getAllGalleries } from "@/lib/data/galleries";
import { SITE } from "@/lib/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, news, galleries] = await Promise.all([
    getAllPublicEvents(),
    getAllPublicNews(),
    getAllGalleries(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/la-societa",
    "/attivita",
    "/eventi",
    "/news",
    "/galleria",
    "/contatti",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const eventPages: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${SITE_URL}/eventi/${e.slug}`,
    lastModified: e.updated_at,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const newsPages: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${SITE_URL}/news/${n.slug}`,
    lastModified: n.updated_at,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const galleryPages: MetadataRoute.Sitemap = galleries.map((g) => ({
    url: `${SITE_URL}/galleria/${g.slug}`,
    lastModified: g.updated_at,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticPages, ...eventPages, ...newsPages, ...galleryPages];
}
