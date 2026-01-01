import type { Metadata } from "next";
import { Gentium_Book_Plus, JetBrains_Mono } from "next/font/google";
import { TopRightLogomark } from "@/components/TopRightLogomark";
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
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
      <head>
        <meta
          name="source"
          content="https://github.com/electricsheepco/footnotes-at"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
/*

        *
    footnotes.at

    A quiet place for short writing.
    No likes. No followers. No algorithms.

    https://footnotes.at

*/
`,
          }}
        />
      </head>
      <body
        className={`${gentiumBookPlus.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}
      >
        <TopRightLogomark />
        {children}
      </body>
    </html>
  );
}
