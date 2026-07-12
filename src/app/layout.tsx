import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "AfiliPro — Gagnez de l'argent",
  description: "Plateforme de micro-tâches rémunérées et d'affiliation. Gagnez des FCFA avec votre téléphone.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "AfiliPro — Gagnez de l'argent",
    description: "Micro-tâches rémunérées & affiliation en Afrique de l'Ouest",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1E3A5F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-white">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
