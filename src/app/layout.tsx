import type { Metadata } from "next";
import { Newsreader, Source_Serif_4, DM_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "500"],
  style: ["normal", "italic"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Kumar Divya Rajat",
    template: "%s — Kumar Divya Rajat",
  },
  description:
    "Personal blog and portfolio. Writing about software engineering, design, and building things.",
  metadataBase: new URL("https://kumardivyarajat.com"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://kumardivyarajat.com",
    types: {
      "application/rss+xml": "https://kumardivyarajat.com/feed.xml",
    },
  },
  openGraph: {
    title: "Kumar Divya Rajat",
    description:
      "Personal blog and portfolio. Writing about software engineering, design, and building things.",
    url: "https://kumardivyarajat.com",
    siteName: "Kumar Divya Rajat",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og?title=Kumar%20Divya%20Rajat&description=Software%20engineer%20%26%20writer.%20Building%20things%2C%20writing%20about%20the%20process.",
        width: 1200,
        height: 630,
        alt: "Kumar Divya Rajat",
      },
    ],
  },
  twitter: {
    card: "summary",
    site: "@Rajat225",
    creator: "@Rajat225",
    title: "Kumar Divya Rajat",
    description:
      "Personal blog and portfolio. Writing about software engineering, design, and building things.",
    images: ["/og?title=Kumar%20Divya%20Rajat&description=Software%20engineer%20%26%20writer.%20Building%20things%2C%20writing%20about%20the%20process."],
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
    <html lang="en">
      <body
        className={`${newsreader.variable} ${sourceSerif.variable} ${dmSans.variable} grain`}
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
