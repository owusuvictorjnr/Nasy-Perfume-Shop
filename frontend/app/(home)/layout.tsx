import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Nasy Scents Collection",
  description: "Discover the Essence of Elegance with Nasy Scents Collection - Where Fragrance Meets Artistry.",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
