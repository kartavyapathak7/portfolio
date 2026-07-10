import type { Metadata, Viewport } from "next";
import { Bebas_Neue, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

/* ─── Fonts ───────────────────────────────────────────────────── */

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* ─── Root metadata ───────────────────────────────────────────── */

export const metadata: Metadata = {
  metadataBase: new URL("https://kartavyapathak.com"),
  title: {
    default: "Kartavya Pathak | Software Engineer",
    template: "%s | Kartavya Pathak",
  },
  description:
    "Kartavya Pathak — CSE student at MSRIT. Python developer, AI automation enthusiast, 120 WPM typist, and builder of free online tools.",
  authors: [{ name: "Kartavya Pathak", url: "https://kartavyapathak.com" }],
  creator: "Kartavya Pathak",
  openGraph: {
    siteName: "Kartavya Pathak",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@kartavya",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

/* ─── Viewport ────────────────────────────────────────────────── */

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/* ─── Layout ──────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${outfit.variable} ${jetbrains.variable}`}
    >
      <body className="font-body min-h-screen">{children}</body>
    </html>
  );
}
