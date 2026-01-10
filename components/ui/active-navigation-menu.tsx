"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "Email sending and monitoring dashboard",
  },
  {
    title: "Builder",
    href: "/builder",
    description: "Drag-and-drop email template builder",
  },
  {
    title: "Setup",
    href: "/setup",
    description: "Configure email providers and settings",
  },
  {
    title: "Status",
    href: "/status",
    description: "Check system and provider status",
  },
]

export function ActiveNavigationMenu() {
  const pathname = usePathname()

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Email Service</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => {
                const isActive = pathname === component.href || 
                  (component.href !== "/" && pathname?.startsWith(component.href))
                
                return (
                  <li key={component.title}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={component.href}
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          isActive && "bg-accent text-accent-foreground"
                        )}
                      >
                        <div className="text-sm font-medium leading-none">
                          {component.title}
                          {isActive && (
                            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {component.description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                )
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Simple Navigation Links */}
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === "/" && "bg-accent text-accent-foreground"
              )}
            >
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/dashboard" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                (pathname === "/dashboard" || pathname?.startsWith("/dashboard")) && 
                "bg-accent text-accent-foreground"
              )}
            >
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/builder" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === "/builder" && "bg-accent text-accent-foreground"
              )}
            >
              Builder
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/setup" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === "/setup" && "bg-accent text-accent-foreground"
              )}
            >
              Setup
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/status" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === "/status" && "bg-accent text-accent-foreground"
              )}
            >
              Status
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}