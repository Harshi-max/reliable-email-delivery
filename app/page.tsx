"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Shield,
  Zap,
  RefreshCw,
  Server,
  Activity,
  ArrowRight,
  CheckCircle,
  Timer,
  Eye,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import ScrollToTop from "@/components/ui/scroll-to-top"
import NavLink from "@/components/ui/nav-link"

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false)

  const features = [
    {
      icon: RefreshCw,
      title: "Intelligent Retry Logic",
      description: "Exponential backoff with jitter prevents thundering herd problems",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      borderColor: "border-blue-200",
    },
    {
      icon: Server,
      title: "Provider Fallback",
      description: "Seamless switching between providers ensures maximum deliverability",
      color: "text-green-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      borderColor: "border-green-200",
    },
    {
      icon: Shield,
      title: "Idempotency Protection",
      description: "Prevents duplicate sends with intelligent request deduplication",
      color: "text-purple-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      borderColor: "border-purple-200",
    },
    {
      icon: Activity,
      title: "Circuit Breaker",
      description: "Prevents cascading failures with automatic recovery mechanisms",
      color: "text-red-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      borderColor: "border-red-200",
    },
    {
      icon: Timer,
      title: "Rate Limiting",
      description: "Token bucket algorithm ensures fair usage and prevents abuse",
      color: "text-orange-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      borderColor: "border-orange-200",
    },
    {
      icon: Eye,
      title: "Real-time Monitoring",
      description: "Comprehensive observability with metrics and structured logging",
      color: "text-indigo-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      borderColor: "border-indigo-200",
    },
  ]

  const stats = [
    { label: "Uptime", value: "99.9%", icon: CheckCircle, color: "text-green-600" },
    { label: "Response Time", value: "<200ms", icon: Zap, color: "text-yellow-600" },
    { label: "Providers", value: "3+", icon: Server, color: "text-blue-600" },
    { label: "Features", value: "10+", icon: Sparkles, color: "text-purple-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Resilient Email Service
                </h1>
                <p className="text-sm text-muted-foreground ">Enterprise-grade reliability</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200 animate-pulse hidden sm:inline-flex">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Live Demo
            </Badge>
            <ThemeToggle />
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 mb-8 shadow-lg animate-fade-in">
              <Sparkles className="h-4 w-4 text-blue-500 animate-spin" />
              <span className="text-sm font-medium text-blue-700">Powered by Advanced Resilience Patterns</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Enterprise Email
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Delivery System
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Built with production-ready resilience patterns including{" "}
              <span className="font-semibold text-blue-600">retry logic</span>,{" "}
              <span className="font-semibold text-yellow-600">provider fallback</span>,{" "}
              <span className="font-semibold text-purple-600">circuit breakers</span>, and{" "}
              <span className="font-semibold text-orange-600">real-time monitoring</span>.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-400">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <Mail className="mr-3 h-5 w-5 group-hover:animate-bounce" />
                  Launch Email Dashboard
                  <ArrowRight
                    className={`ml-3 h-5 w-5 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
                  />
                </Button>
              </Link>
              <Link href="/status">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 border-2 hover:bg-black/80 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-transparent"
                >
                  <Activity className="mr-2 h-5 w-5" />
                  View System Status
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 animate-fade-in-up delay-600">
              {stats.map((stat, index) => (
                <Card
                  key={stat.label}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-yellow-400 bg-clip-text text-transparent">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with production-ready patterns used by the world's most reliable email services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className={`group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 hover:${feature.bgColor} animate-fade-in-up`}
                style={{ animationDelay: `${800 + index * 150}ms` }}
              >
                <CardContent className="p-8">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.bgColor} ${feature.borderColor} border-2 mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-yellow-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Provider Status */}
        <section className="container mx-auto px-6 py-16">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow dark-gradient-card">
            <CardContent className="p-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <Badge className="bg-green-100 text-green-800 border-green-200 text-lg px-4 py-2">
                  System Operational
                </Badge>
              </div>
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Ready to Send Real Emails
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Resend provider is configured and healthy. The system is ready to deliver emails with enterprise-grade
                reliability and monitoring.
              </p>
              <div className="flex items-center justify-center gap-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Resend Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Fallback Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Monitoring Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-400 {
          animation-delay: 400ms;
        }

        .delay-600 {
          animation-delay: 600ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }

        .delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </div>
  )
}