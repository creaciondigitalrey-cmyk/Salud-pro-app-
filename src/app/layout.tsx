import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/saludpro/toast";
import { BCVProvider } from "@/lib/bcv-context";
import { ServiceWorkerRegister } from "@/components/saludpro/sw-register";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const spaceGrotesk = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], display: "swap", weight: ["400","500","600","700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://saludpro-31e9a.web.app"),
  title: "SaludPro — Portafolios Profesionales de Salud y Bienestar",
  description: "La primera plataforma con IA generativa para profesionales de la salud, la belleza, el fitness y el bienestar. Médicos, enfermeras, barberos, nail artists, entrenadores y más.",
  authors: [{ name: "SaludPro" }],
  applicationName: "SaludPro",
  generator: "SaludPro",
  keywords: ["saludpro", "portafolio médico", "profesionales salud", "IA generativa", "enfermería", "barbería", "belleza", "Venezuela", "PWA"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "SaludPro",
    statusBarStyle: "black-translucent",
    startupImage: ["/apple-touch-icon.png"],
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-256.png", sizes: "256x256", type: "image/png" },
      { url: "/icon-384.png", sizes: "384x384", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.png"],
  },
  openGraph: {
    title: "SaludPro — Profesionales de Salud y Bienestar",
    description: "Tu portafolio profesional en 5 minutos. Con IA generativa incluida.",
    type: "website",
    locale: "es_VE",
    siteName: "SaludPro",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "SaludPro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaludPro",
    description: "Tu portafolio profesional en 5 minutos. Con IA generativa incluida.",
    images: ["/icon-512.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0D9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* PWA iOS meta tags (no soportados por Metadata API) */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SaludPro" />
        <meta name="application-name" content="SaludPro" />
        <meta name="msapplication-TileColor" content="#0D9488" />
        <meta name="msapplication-tap-highlight" content="no" />
        {/* PWA Windows tile */}
        <meta name="msapplication-square192x192logo" content="/icon-192.png" />
        <meta name="msapplication-square512x512logo" content="/icon-512.png" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`} style={{ backgroundColor: "#061520", color: "#FFFFFF" }}>
        <AuthProvider><BCVProvider><ToastProvider>{children}</ToastProvider></BCVProvider></AuthProvider>
        <ServiceWorkerRegister />
        <Toaster />
      </body>
    </html>
  );
}
