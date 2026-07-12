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

  // Retire les informations inutiles des réponses.
  poweredByHeader: false,

  // Next.js et Vercel gèrent automatiquement le cache des fichiers statiques.
  // Ne pas définir Cache-Control ici évite les avertissements Vercel.

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
