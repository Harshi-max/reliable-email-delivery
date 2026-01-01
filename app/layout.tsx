import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "@/app/providers/theme-providers"
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
      <body>
        <ThemeProvider defaultTheme="light" storageKey="email-service-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
