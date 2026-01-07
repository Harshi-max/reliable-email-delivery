import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "@/app/providers/theme-providers"
import ScrollToTop from "@/components/ui/scroll-to-top"
export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background">

        <ThemeProvider defaultTheme="light" storageKey="email-service-theme">
          {children}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
