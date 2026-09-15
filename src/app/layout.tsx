import type { Metadata } from "next";
import { Noto_Sans_Mono, Noto_Sans_Display, Noto_Serif_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import { Toaster } from "@/components/ui/sonner";
import { AudioProvider } from "@/context/AudioContext";
import MusicPlayer from "@/components/MusicPlayer";
import FullscreenVisualizer from "@/components/FullscreenVisualizer";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://saranshhalwai.me"),
  title: "Saransh Halwai | Portfolio & Systems Enthusiast",
  description: "Portfolio of Saransh Halwai. Computer Science & Engineering @ IIT Indore, Incoming Developer Intern @ Samsung R&D (SRIB).",
  keywords: [
    "Saransh Halwai",
    "Software Developer",
    "IIT Indore",
    "Samsung R&D",
    "SRIB",
    "Portfolio",
    "Systems Design",
    "AI Engineer"
  ],
  openGraph: {
    title: "Saransh Halwai | Portfolio",
    description: "Portfolio of Saransh Halwai. Computer Science & Engineering @ IIT Indore, Incoming Developer Intern @ Samsung R&D (SRIB).",
    url: "https://saranshhalwai.me",
    siteName: "Saransh Halwai",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saransh Halwai | Portfolio",
    description: "Portfolio of Saransh Halwai. Computer Science & Engineering @ IIT Indore, Incoming Developer Intern @ Samsung R&D (SRIB).",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Saransh Halwai",
  url: "https://saranshhalwai.vercel.app",
  jobTitle: "Software Developer & Incoming Developer Intern",
  worksFor: {
    "@type": "Organization",
    name: "Samsung R&D Institute India (SRIB)",
  },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Indian Institute of Technology Indore",
  },
  sameAs: [
    "https://github.com/saranshhalwai",
    "https://linkedin.com/in/saransh-halwai-478346171",
    "https://leetcode.com/u/saransh6/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
          <AudioProvider>
            <CustomCursor />
            <Navbar />
            {children}
            <MusicPlayer />
            <FullscreenVisualizer />
            <Toaster />
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
