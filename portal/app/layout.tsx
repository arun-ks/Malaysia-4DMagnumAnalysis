import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const noto = Noto_Sans_SC({ subsets: ["latin"], variable: "--font-noto" });

export const metadata: Metadata = {
  title: "Magnum 4D Classic Historical Results Malaysia | 4D Results",
  description:
    "Search historical Magnum 4D Classic results in Malaysia. Check a 4D number, explore prize history, make a lucky guess or predict number patterns from past draws. Independent historical-results reference for Magnum, TOTO and KTM players.",
  keywords: [
    "Magnum 4D Classic",
    "Malaysia 4D results",
    "Magnum historical results",
    "TOTO results",
    "KTM results",
    "predict number",
    "lucky guess",
    "4D number history",
  ],
  openGraph: {
    title: "Magnum 4D Classic Historical Results Malaysia | 4D Results",
    description:
      "Search historical Magnum 4D Classic results in Malaysia and explore 4D number prize history.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffaf0",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${noto.variable}`}>{children}</body>
    </html>
  );
}
