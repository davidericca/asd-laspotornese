import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Consente a next/image di ottimizzare le immagini caricate su
    // Supabase Storage (dominio del tipo <progetto>.supabase.co).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
