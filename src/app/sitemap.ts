import type { MetadataRoute } from "next";
import { getPublishedEvents } from "@/lib/data/events";
import { getPublishedNews } from "@/lib/data/news";
import { getPublishedGalleries } from "@/lib/data/galleries";

const BASE_URL = "https://asd-laspotornese.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, news, galleries] = await Promise.all([
    getPublishedEvents(),
    getPublishedNews(),
    getPublishedGalleries(),
  ]);

  const staticRoutes = [
    "",
    "/chi-siamo",
    "/attivita",
    "/eventi",
    "/news",
    "/galleria",
    "/contatti",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const eventRoutes = events.map((event) => ({
    url: `${BASE_URL}/eventi/${event.slug}`,
    lastModified: new Date(event.event_date),
  }));

  const newsRoutes = news.map((item) => ({
    url: `${BASE_URL}/news/${item.slug}`,
    lastModified: new Date(item.created_at),
  }));

  const galleryRoutes = galleries.map((gallery) => ({
    url: `${BASE_URL}/galleria/${gallery.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...eventRoutes, ...newsRoutes, ...galleryRoutes];
}
