import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { AuthGuard } from "@/components/AuthGuard";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://teolingo.vercel.app"),
  title: "Teolingo - Aprende Hebreo Bíblico",
  description: "La forma más divertida de aprender hebreo bíblico.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
  },
  openGraph: {
    title: "Teolingo - Aprende Hebreo Bíblico",
    description: "La forma más divertida de aprender hebreo bíblico.",
    url: "https://teolingo.vercel.app",
    siteName: "Teolingo",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Teolingo Logo",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Teolingo - Aprende Hebreo Bíblico",
    description: "La forma más divertida de aprender hebreo bíblico.",
    images: ["/logo.png"],
  },
};

import { ClientLayout } from "@/components/ClientLayout";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white overflow-x-hidden`}
      >
        <Providers>
          <AuthGuard>
            <ClientLayout>{children}</ClientLayout>
          </AuthGuard>
          <Toaster position="top-center" richColors visibleToasts={5} expand={true} gap={10} />
        </Providers>
      </body>
    </html>
  );
}
