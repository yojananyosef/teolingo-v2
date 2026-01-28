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
  title: "Teolingo - Aprende Hebreo Bíblico",
  description: "La forma más divertida de aprender hebreo bíblico.",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Teolingo - Aprende Hebreo Bíblico",
    description: "La forma más divertida de aprender hebreo bíblico.",
    url: "https://teolingo.vercel.app",
    siteName: "Teolingo",
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: "Teolingo Logo",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teolingo - Aprende Hebreo Bíblico",
    description: "La forma más divertida de aprender hebreo bíblico.",
    images: ["/logo.svg"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 overflow-x-hidden`}
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
