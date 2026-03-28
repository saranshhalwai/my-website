import type { Metadata } from "next";
import { Noto_Sans_Mono, Noto_Sans_Display, Noto_Serif_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";

const notoSerif = Noto_Serif_Display({
  subsets: ["latin"],
  variable: "--font-noto-serif",
});

const notoSans = Noto_Sans_Display({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const notoMono = Noto_Sans_Mono({
  variable: "--font-noto-mono",
  subsets: ["latin"],
});

import CustomCursor from "@/components/CustomCursor";
import { ChatWidget } from "@/components/ui/chat/ChatWidget";

export const metadata: Metadata = {
  metadataBase: new URL("https://saranshhalwai.vercel.app"),
  title: "Saransh Halwai | Portfolio",
  description: "Portfolio of Saransh Halwai, Software Developer. Welcome to my personal website!",
  keywords: ["Saransh Halwai", "Software Developer", "Portfolio", "Developer", "Engineer"],
  openGraph: {
    title: "Saransh Halwai | Portfolio",
    description: "Portfolio of Saransh Halwai, Software Developer. Welcome to my personal website!",
    url: "https://saranshhalwai.vercel.app",
    siteName: "Saransh Halwai",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "4i2b-28Pt2IoFlIcSx2kH7uXCJxrM6fql1ivjKy13x8",
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
        className={`${notoSans.variable} ${notoMono.variable} ${notoSerif.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CustomCursor />
          <Navbar />
          {children}
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
