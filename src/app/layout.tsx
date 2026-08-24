import type { Metadata } from "next";
import { Schibsted_Grotesk, Karla, Space_Mono } from "next/font/google";
import "./globals.css";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  weight: ["600", "700"],
  subsets: ["latin"],
});

const karla = Karla({
  variable: "--font-karla",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://asd-laspotornese.vercel.app"),
  title: {
    default: "ASD La Spotornese",
    template: "%s · ASD La Spotornese",
  },
  description: "Sito ufficiale dell'ASD La Spotornese",
  openGraph: {
    siteName: "ASD La Spotornese",
    locale: "it_IT",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${schibstedGrotesk.variable} ${karla.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
