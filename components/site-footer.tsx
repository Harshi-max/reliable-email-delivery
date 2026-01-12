import Link from "next/link"
import { Github, Mail } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-5">

          <div className="space-y-3 md:col-span-2">
            <h3 className="text-base font-semibold text-foreground">
              Reliable Email Delivery
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A reliable and scalable platform for email delivery with monitoring,
              resilience, and failover support.
            </p>
            <p className="text-xs text-muted-foreground">
              Status: <span className="font-medium text-foreground">Active development</span>
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium text-foreground">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground">Home</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
              <li><Link href="/status" className="hover:text-foreground">System Status</Link></li>
              <li><Link href="/setup" className="hover:text-foreground">Setup Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium text-foreground">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="https://github.com/Harshi-max/reliable-email-delivery#readme"
                  target="_blank"
                  className="hover:text-foreground"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/Harshi-max/reliable-email-delivery"
                  target="_blank"
                  className="flex items-center gap-2 hover:text-foreground"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium text-foreground">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href="#"
                  className="hover:text-foreground"
                >
                  support@reliable-email.dev
                </a>
              </li>
              <li>
                <Link
                  href="https://github.com/Harshi-max/reliable-email-delivery/discussions"
                  target="_blank"
                  className="hover:text-foreground"
                >
                  Community Discussions
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} Reliable Email Delivery. All rights reserved.
          </p>
          <span>Built with Next.js & Tailwind CSS</span>
        </div>
      </div>
    </footer>
  )
}
