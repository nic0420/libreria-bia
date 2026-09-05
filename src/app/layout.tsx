import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Librería Bia — Papelería que inspira",
  description: "Descubrí útiles, papelería y artículos de oficina seleccionados para hacer tus ideas realidad.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} bg-[#faf8f6] antialiased`}>
      <body className="min-h-screen bg-[#faf8f6] font-sans text-[#1c1917]">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
