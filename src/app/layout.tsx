import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Providers } from "@/providers/Providers";
import { AuthGuard } from "@/components/AuthGuard";
import { Toaster } from "sonner";
import { headers } from "next/headers";

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
  description: "La forma más divertida de aprender hebreo bíblico",
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
