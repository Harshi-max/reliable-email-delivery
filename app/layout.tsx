import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/app/providers/theme-providers";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://reliable-email-delivery.vercel.app"),

  title: {
    default: "Resilient Email Service | Reliable & Scalable Email Delivery",
    template: "%s | Resilient Email Service",
  },

  description:
    "Enterprise-grade reliable email delivery system with retry logic, provider fallback, circuit breakers, and real-time monitoring. Built for scalability, resilience, and fault tolerance.",

  applicationName: "Resilient Email Service",

  keywords: [
    "reliable email delivery",
    "resilient email service",
    "email provider fallback",
    "email retry logic",
    "circuit breaker pattern",
    "scalable email system",
    "enterprise email infrastructure",
    "email delivery reliability",
    "fault tolerant email service",
  ],

  authors: [{ name: "Reliable Email Delivery Team" }],
  creator: "Reliable Email Delivery Team",
  publisher: "Reliable Email Delivery",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://reliable-email-delivery.vercel.app",
    title: "Resilient Email Service",
    description:
      "Production-ready email delivery system with retries, provider fallback, circuit breakers, and real-time monitoring.",
    siteName: "Resilient Email Service",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Resilient Email Service – Reliable Email Delivery",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Resilient Email Service",
    description:
      "Reliable, fault-tolerant email delivery system built with enterprise-grade resilience patterns.",
    images: ["/og-image.png"],
    creator: "@your_twitter_handle",
  },

  category: "Technology",

  themeColor: "#0f172a", // matches dark enterprise UI
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider defaultTheme="light" storageKey="email-service-theme">
          <div className="min-h-screen flex flex-col">
            <main className="flex-1" role="main">
              {children}
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
