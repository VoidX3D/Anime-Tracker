import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnimeTarget | Millennium Archive - Track 10,000+ Anime",
  description: "The ultimate anime tracking platform with neural recommendations, real-time synchronization, and a 10,000+ unit archive. Built with Next.js, Supabase, and cutting-edge design.",
  keywords: ["anime tracker", "anime list", "myanimelist", "anilist", "anime database", "anime recommendations", "watch list"],
  authors: [{ name: "Sincere Bhattarai (VoidX3D)" }],
  creator: "Sincere Bhattarai (VoidX3D)",
  publisher: "AnimeTarget",
  applicationName: "AnimeTarget Millennium Archive",
  generator: "Next.js",
  metadataBase: new URL('https://animetarget.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://animetarget.vercel.app',
    title: 'AnimeTarget | Millennium Archive',
    description: 'Track 10,000+ anime with neural recommendations and real-time sync',
    siteName: 'AnimeTarget',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'AnimeTarget Millennium Archive',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnimeTarget | Millennium Archive',
    description: 'Track 10,000+ anime with neural recommendations',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-text-main`}
      >
        <ThemeProvider defaultTheme="dark">
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
