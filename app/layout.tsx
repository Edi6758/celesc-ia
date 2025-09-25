import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppLayout } from "@/components/layout/app-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CELESC IA - Sistema de Críticas",
  description: "Sistema inteligente para tratamento de faturas em crítica - SAP S/4HANA IS-U",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
        </Providers>
      </body>
    </html>
  );
}