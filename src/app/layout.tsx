import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
