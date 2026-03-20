import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // <--- NEW FONT
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
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
    <html lang="en" className="dark">
      <body className={`${jakarta.variable} antialiased bg-[#050505] text-white`}>
        {children}
      </body>
    </html>
  );
}