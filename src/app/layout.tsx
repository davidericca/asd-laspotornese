import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: `${SITE.name} — Società di Pesca Sportiva`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.shortDescription,
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: SITE.name,
    title: `${SITE.name} — Società di Pesca Sportiva`,
    description: SITE.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Società di Pesca Sportiva`,
    description: SITE.shortDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="it" className={`${inter.variable} ${poppins.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
