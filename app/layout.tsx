import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import FloatingBar from "@/components/FloatingBar";
import Footer from "@/components/Footer";

const notoSerif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "대치 위더스 학원",
  description: "대치동 위더스 학원 - 프리미엄 맞춤 교육",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSerif.variable}>
      <body className="min-h-screen font-sans">
        <Header />
        <Navbar />
        <main className="relative z-0 pb-24 md:pb-8">{children}</main>
        <Footer />
        <FloatingBar />
      </body>
    </html>
  );
}
