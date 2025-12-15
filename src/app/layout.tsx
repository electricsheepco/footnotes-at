import type { Metadata } from "next";
import { Gentium_Book_Plus, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const gentiumBookPlus = Gentium_Book_Plus({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
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
        className={`${gentiumBookPlus.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
