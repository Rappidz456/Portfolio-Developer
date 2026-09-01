import type { Metadata, Viewport } from "next";
import { Anton, Oswald, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { profile } from "@/lib/data";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description:
    "Full Stack Software Engineer with 4+ years building scalable web, mobile and AI products with Next.js, React Native, Node.js and FastAPI.",
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description:
      "Scalable web, mobile and AI products. Next.js, React Native, Node.js, FastAPI.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${oswald.variable} ${inter.variable}`}
    >
      <body className="bg-void text-cream" suppressHydrationWarning>
        <div className="grain" aria-hidden />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
