import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Agent Builder - Create AI Agents Conversationally",
  description: "Build powerful AI agents through natural conversation. Upload knowledge, assign tools, and create workflows in minutes.",
  keywords: ["AI", "agents", "automation", "chatbot", "artificial intelligence"],
  authors: [{ name: "Agent Builder Team" }],
  creator: "Agent Builder",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Agent Builder - Create AI Agents Conversationally",
    description: "Build powerful AI agents through natural conversation",
    siteName: "Agent Builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent Builder - Create AI Agents Conversationally",
    description: "Build powerful AI agents through natural conversation",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
