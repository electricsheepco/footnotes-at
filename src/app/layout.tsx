import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://footnotes.at";

export const metadata: Metadata = {
  title: {
    default: "footnotes.at",
    template: "%s — footnotes.at",
  },
  description:
    "A quiet place for short writing. No likes, no followers, no algorithms.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "footnotes.at",
    title: "footnotes.at",
    description:
      "A quiet place for short writing. No likes, no followers, no algorithms.",
  },
  twitter: {
    card: "summary",
    title: "footnotes.at",
    description:
      "A quiet place for short writing. No likes, no followers, no algorithms.",
  },
  robots: {
    index: true,
    follow: true,
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
