import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Magistratura Loyihasi",
    template: "%s | Magistratura",
  },
  description: "Magistratura dasturlash fanlari uchun interaktiv topshiriqlar platformasi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
