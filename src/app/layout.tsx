import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";

const etBook = localFont({
  src: [
    {
      path: "../../public/fonts/et-book-roman.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/et-book-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/et-book-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
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
        className={`${etBook.variable} ${inter.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
