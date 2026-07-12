import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Active la compression sur toutes les réponses (HTML, JSON, JS...)
  compress: true,

  // Optimise les images pour les téléphones à faible connexion
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 3600,
    unoptimized: false,
  },

  // Retire les infos inutiles des headers pour gagner en perf
  poweredByHeader: false,

  // Cache les pages statiques pendant 1 heure sur le CDN
  headers: async () => [
    {
      source: "/_next/static/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/fonts/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
  ],

  // Active l'optimisation pour des bundles plus légers
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "react",
      "react-dom",
    ],
  },

  // Désactive les checks redondants en production
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
