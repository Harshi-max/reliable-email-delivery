"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  activeClassName?: string
  inactiveClassName?: string
  exact?: boolean
}

export default function NavLink({
  href,
  children,
  className = "",
  activeClassName = "",
  inactiveClassName = "",
  exact = false,
}: NavLinkProps) {
  const pathname = usePathname()
  
  const isActive = exact 
    ? pathname === href
    : (href === "/" ? pathname === "/" : pathname?.startsWith(href))

  return (
    <Link
      href={href}
      className={cn(
        className,
        isActive ? activeClassName : inactiveClassName,
        "transition-colors duration-200"
      )}
    >
      {children}
    </Link>
  )
}