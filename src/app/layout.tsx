import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MainContent from "@/components/MainContent";
import SecretKeyListener from "@/components/SecretKeyListener";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.sudburyhelpingfamilies.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sudbury & Area Helping Families in Need | Community Charity Since 2012",
    template: "%s | Sudbury Helping Families",
  },
  description: "A community-driven grassroots charity supporting local families and individuals in Sudbury during times of hardship since 2012. Fuelled by Kindness. Powered by Community.",
  keywords: [
    "charity",
    "Sudbury charity",
    "Sudbury Ontario",
    "helping families",
    "community support",
    "donate",
    "volunteer",
    "food assistance",
    "family support",
    "Northern Ontario charity",
    "grassroots charity",
    "local charity Sudbury",
  ],
  authors: [{ name: "Mike Bellerose", url: siteUrl }],
  creator: "Sudbury & Area Helping Families in Need",
  publisher: "Sudbury & Area Helping Families in Need",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Sudbury & Area Helping Families in Need",
    description: "A community-driven grassroots charity supporting local families and individuals in Sudbury during times of hardship since 2012. Fuelled by Kindness. Powered by Community.",
    url: siteUrl,
    siteName: "Sudbury & Area Helping Families in Need",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Sudbury & Area Helping Families in Need - Fuelled by Kindness. Powered by Community.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sudbury & Area Helping Families in Need",
    description: "A community-driven grassroots charity supporting local families in Sudbury since 2012.",
    images: ["/logo.jpg"],
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
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
    // Add your Google Search Console verification code here when available
    // google: "your-google-verification-code",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "charity",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "Sudbury & Area Helping Families in Need",
  alternateName: "Sudbury Helping Families",
  url: siteUrl,
  logo: `${siteUrl}/logo.jpg`,
  description: "A community-driven grassroots charity supporting local families and individuals in Sudbury during times of hardship since 2012.",
  foundingDate: "2012",
  founder: {
    "@type": "Person",
    name: "Mike Bellerose",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sudbury",
    addressRegion: "Ontario",
    addressCountry: "CA",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-705-207-4170",
    email: "sudburyhelpingfamilies@hotmail.com",
    contactType: "customer service",
  },
  sameAs: [
    "https://www.facebook.com/sudburyandareahelpingfamilies",
  ],
  slogan: "Fuelled by Kindness. Powered by Community.",
  areaServed: {
    "@type": "City",
    name: "Sudbury",
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "Ontario",
    },
  },
  knowsAbout: [
    "Food assistance",
    "Family support",
    "Community outreach",
    "Youth programs",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#1a2e2e] min-h-screen`}
      >
        <SecretKeyListener />
        <Navigation />
        <MainContent>
          {children}
          <Footer />
        </MainContent>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a2e2e',
              color: '#e0f7fa',
              border: '1px solid rgba(56, 182, 196, 0.2)',
            },
          }}
        />
      </body>
    </html>
  );
}
