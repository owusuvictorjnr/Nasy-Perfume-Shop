import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/app/(home)/components/Footer";
import CategoriesNav from "@/features/products/categories/components/CategoriesNav";
import { AuthProvider } from "@/lib/firebase/AuthProvider";
import { Providers } from "@/components/Providers";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nasy Scents Collection",
  description:
    "Discover the Essence of Elegance with Nasy Scents Collection - Where Fragrance Meets Artistry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthProvider>
            <Navigation />
            <CategoriesNav />
            {children}
            <footer>
              <Footer />
            </footer>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
