import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const sentient = localFont({
  src: [
    {
      path: "../../public/fonts/Sentient-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sentient-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sentient-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Sentient-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sentient",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1623c1",
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
};

export const metadata: Metadata = {
  title: "PeopleAsset Survey Dashboard",
  description: " ",

  openGraph: {
    title: "PeopleAsset Survey Dashboard",
    description: " ",
    siteName: "PeopleAsset Survey Dashboard",
    images: [
      {
        url: "https://survey.peopleasset.in/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
      },
    ],
  },
  twitter: {
    title: "PeopleAsset Survey Dashboard",
    description: " ",
    images: [
      {
        url: "https://survey.peopleasset.in/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
      },
    ],
    card: "summary_large_image",
  },
  manifest: "/manifest.json",
  icons: {
    apple: "/web-app-manifest-512x512.png",
    icon: "/web-app-manifest-512x512.png",
    other: {
      rel: "icon",
      url: "/web-app-manifest-512x512.png",
    },
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${sentient.className} antialiased`}>
        <QueryProvider>
          <main>{children}</main>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
