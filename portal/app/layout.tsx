import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const noto = Noto_Sans_SC({ subsets: ["latin"], variable: "--font-noto" });

export const metadata: Metadata = {
  title: "4D Results",
  description: "Explore historical Magnum 4D results by number and prize type.",
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
