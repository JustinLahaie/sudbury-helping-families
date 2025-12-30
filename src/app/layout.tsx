import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sudbury & Area Helping Families in Need",
  description: "A community-driven grassroots charity supporting local families and individuals during times of hardship since 2012. Fuelled by Kindness. Powered by Community.",
  keywords: ["charity", "Sudbury", "families", "community", "help", "donate", "volunteer"],
  openGraph: {
    title: "Sudbury & Area Helping Families in Need",
    description: "Supporting families and individuals in Sudbury during times of hardship since 2012.",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#1a2e2e] min-h-screen`}
      >
        <Navigation />
        <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen flex flex-col">
          {children}
          <Footer />
        </main>
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
