import type { Metadata } from "next";
import { Newsreader, Source_Serif_4, DM_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Kumar Divya Rajat",
    template: "%s — Kumar Divya Rajat",
  },
  description:
    "Personal blog and portfolio. Writing about software engineering, design, and building things.",
  metadataBase: new URL("https://kumardivyarajat.com"),
  openGraph: {
    title: "Kumar Divya Rajat",
    description:
      "Personal blog and portfolio. Writing about software engineering, design, and building things.",
    url: "https://kumardivyarajat.com",
    siteName: "Kumar Divya Rajat",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kumar Divya Rajat",
    description:
      "Personal blog and portfolio. Writing about software engineering, design, and building things.",
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
