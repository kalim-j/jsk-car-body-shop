import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { QuickActions } from "../components/QuickActions";
import { Providers } from "../components/Providers";
import { CustomCursor } from "../components/CustomCursor";
import { ScrollToTop } from "../components/ScrollToTop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JSK CAR BODY SHOP | Premium Repairs & Detailing",
  description: "High-end car body repairs, painting, and detailing showroom.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JSK Body Shop",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Providers>
          <CustomCursor />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <QuickActions />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
