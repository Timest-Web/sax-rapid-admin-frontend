// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ── BODY FONT ──
// Inter: The #1 UI font. Designed specifically for screens.
// Massive glyph set, tabular nums, contextual alternates built-in.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// ── DISPLAY / HEADING FONT ──
// Sora: Geometric sans-serif with personality.
// Perfect for dashboard headings, stats, and hero numbers.
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

// ── MONOSPACE / DATA FONT ──
// JetBrains Mono: The best monospace for data display.
// Ligatures, distinguishable chars (0 vs O, 1 vs l), tabular by default.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SAX Admin",
  description: "Premium Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${inter.variable}
          ${sora.variable}
          ${jetbrains.variable}
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}