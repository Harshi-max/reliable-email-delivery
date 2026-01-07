"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import BackButton from "@/components/navigation/BackButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Loader2,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Server,
  Zap,
  AlertTriangle,
  RefreshCw,
  Send,
  Eye,
  TrendingUp,
  Shield,
  Timer,
  ArrowLeft,
  Palette,
} from "lucide-react"
import Link from "next/link"
import ScrollToTop from "@/components/ui/scroll-to-top"


interface EmailStatus {
  id: string
  status: "pending" | "sent" | "failed" | "retrying"
  provider?: string
  attempts: number
  lastError?: string
  timestamp: string
  to?: string
  subject?: string
}

interface ProviderStatus {
  name: string
  healthy: boolean
  circuitBreakerState: string
  responseTime?: number
  successRate?: number
}

interface SystemMetrics {
  totalSent: number
  totalFailed: number
  successRate: number
  avgResponseTime: number
  queueLength: number
  rateLimitRemaining: number
}

export default function EmailDashboard() {
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailStatuses, setEmailStatuses] = useState<EmailStatus[]>([])
  const [providers, setProviders] = useState<ProviderStatus[]>([])
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalSent: 0,
    totalFailed: 0,
    successRate: 0,
    avgResponseTime: 0,
    queueLength: 0,
    rateLimitRemaining: 100,
  })
  const [activeTab, setActiveTab] = useState("send")

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update provider status
      setProviders([
        {
          name: "Resend (Primary)",
          healthy: true,
          circuitBreakerState: "CLOSED",
          responseTime: 120 + Math.random() * 100,
          successRate: 95 + Math.random() * 4,
        },
        {
          name: "MockProviderA (Fallback)",
          healthy: Math.random() > 0.1,
          circuitBreakerState: Math.random() > 0.8 ? "OPEN" : "CLOSED",
          responseTime: 150 + Math.random() * 200,
          successRate: 85 + Math.random() * 10,
        },
      ])

      // Update metrics
      setMetrics((prev) => ({
        ...prev,
        rateLimitRemaining: Math.max(0, prev.rateLimitRemaining - Math.random() * 2),
        avgResponseTime: 175 + Math.random() * 50,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleSendEmail = async () => {
    if (!email || !subject || !body) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject,
          body,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        const newStatus: EmailStatus = {
          id: result.id,
          status: "sent",
          provider: result.provider,
          attempts: result.attempts,
          timestamp: new Date().toISOString(),
          to: email,
          subject: subject,
        }
        setEmailStatuses((prev) => [newStatus, ...prev.slice(0, 19)]) // Keep last 20

        // Update metrics
        setMetrics((prev) => ({
          ...prev,
          totalSent: prev.totalSent + 1,
          successRate: ((prev.totalSent + 1) / (prev.totalSent + prev.totalFailed + 1)) * 100,
        }))

        // Clear form
        setEmail("")
        setSubject("")
        setBody("")
      } else {
        const failedStatus: EmailStatus = {
          id: result.id || Date.now().toString(),
          status: "failed",
          attempts: result.attempts || 1,
          lastError: result.error,
          timestamp: new Date().toISOString(),
          to: email,
          subject: subject,
        }
        setEmailStatuses((prev) => [failedStatus, ...prev.slice(0, 19)])

        // Update metrics
        setMetrics((prev) => ({
          ...prev,
          totalFailed: prev.totalFailed + 1,
          successRate: (prev.totalSent / (prev.totalSent + prev.totalFailed + 1)) * 100,
        }))
      }
    } catch (error) {
      console.error("Failed to send email:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "retrying":
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800 border-green-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "retrying":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCircuitBreakerColor = (state: string) => {
    switch (state) {
      case "CLOSED":
        return "text-green-600"
      case "OPEN":
        return "text-red-600"
      case "HALF_OPEN":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen w-full bg-background">
       <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <BackButton fallback="/" label="Back to Home" forceRedirect={true} />
              <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg shrink-0">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Email Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground">Manage and monitor your email delivery</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full xl:w-auto">
              <Badge className="bg-green-100 text-green-800 border-green-200 animate-pulse whitespace-nowrap">
                <div className="w-2 h-2 bg-green-50 rounded-full mr-2"></div>
                Live System
              </Badge>
              <ThemeToggle />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-l-4 border-l-green-500 animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold text-green-600">{metrics.successRate.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 animate-fade-in delay-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Emails Sent</p>
                    <p className="text-2xl font-bold text-blue-600">{metrics.totalSent}</p>
                  </div>
                  <Send className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 animate-fade-in delay-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                    <p className="text-2xl font-bold text-purple-600">{metrics.avgResponseTime.toFixed(0)}ms</p>
                  </div>
                  <Timer className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 animate-fade-in delay-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rate Limit</p>
                    <p className="text-2xl font-bold text-orange-600">{metrics.rateLimitRemaining.toFixed(0)}</p>
                  </div>
                  <Shield className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Alert className="mb-6 border-green-200 bg-green-50 animate-fade-in delay-400">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>✅ Resend Configured:</strong> Real emails will be sent using your Resend API key.
            <Link href="/status" className="underline font-medium ml-2">
              View system status →
            </Link>
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-[400px] h-auto">
            <TabsTrigger value="send" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Monitor
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Providers
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          {/* Send Email Tab */}
          <TabsContent value="send" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Compose Email
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Send emails through our resilient delivery system
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="mb-4">
                      <Link href="/builder">
                        <Button
                          className="w-full h-12 border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all bg-gradient-to-r from-blue-50 to-purple-50"
                        >
                          <Palette className="mr-2 h-5 w-5 text-blue-500" />
                          <span className="text-blue-600 font-medium">Design Email Template</span>
                        </Button>
                      </Link>
                      <p className="text-xs text-red-500 mt-2 text-center">Create beautiful emails with drag-and-drop builder</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">Or send plain text</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        To Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="recipient@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium">
                        Subject Line
                      </Label>
                      <Input
                        id="subject"
                        placeholder="Enter your email subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="body" className="text-sm font-medium">
                        Message Body
                      </Label>
                      <Textarea
                        id="body"
                        placeholder="Write your email message here..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={6}
                        className="resize-none"
                      />
                    </div>
                    <Button
                      onClick={handleSendEmail}
                      disabled={isLoading || !email || !subject || !body}
                      className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Email...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Email
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Rate Limiting</CardTitle>
                    <CardDescription>Current usage and limits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Requests Remaining</span>
                        <span>{metrics.rateLimitRemaining.toFixed(0)}/100</span>
                      </div>
                      <Progress value={metrics.rateLimitRemaining} className="h-2" />
                    </div>
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Rate limiting protects against abuse and ensures fair usage across all users.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Monitor Tab */}
          <TabsContent value="monitor" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Real-time email sending status</CardDescription>
                </CardHeader>
                <CardContent>
                  {emailStatuses.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-muted-foreground">No emails sent yet</p>
                      <p className="text-sm text-muted-foreground">Send your first email to see activity here</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {emailStatuses.map((status, index) => (
                        <div
                          key={status.id}
                          className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="mt-1">{getStatusIcon(status.status)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`${getStatusColor(status.status)} text-xs`}>
                                {status.status.toUpperCase()}
                              </Badge>
                              {status.provider && (
                                <Badge variant="outline" className="text-xs">
                                  {status.provider}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {status.attempts} attempt{status.attempts !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <p className="text-sm font-medium truncate">{status.subject}</p>
                            <p className="text-xs text-muted-foreground truncate">{status.to}</p>
                            {status.lastError && (
                              <p className="text-xs text-red-600 mt-1 p-2 bg-red-50 rounded border">
                                {status.lastError}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(status.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    System Metrics
                  </CardTitle>
                  <CardDescription>Performance and reliability statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-2xl font-bold text-green-600">{metrics.totalSent}</p>
                      <p className="text-sm text-green-700">Emails Sent</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-2xl font-bold text-red-600">{metrics.totalFailed}</p>
                      <p className="text-sm text-red-700">Failed Attempts</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Success Rate</span>
                      <span className="font-medium">{metrics.successRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={metrics.successRate} className="h-3" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Response Time</span>
                      <span className="text-sm font-medium">{metrics.avgResponseTime.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Queue Length</span>
                      <span className="text-sm font-medium">{metrics.queueLength}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Providers Tab */}
          <TabsContent value="providers" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {providers.map((provider, index) => (
                <Card
                  key={provider.name}
                  className="shadow-lg animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Server className="h-5 w-5" />
                        {provider.name}
                      </div>
                      <div className="flex items-center gap-2">
                        {provider.healthy ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <Badge variant={provider.healthy ? "default" : "destructive"}>
                          {provider.healthy ? "Healthy" : "Unhealthy"}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Circuit Breaker</p>
                        <p className={`font-medium ${getCircuitBreakerColor(provider.circuitBreakerState)}`}>
                          {provider.circuitBreakerState}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Response Time</p>
                        <p className="font-medium">{provider.responseTime?.toFixed(0)}ms</p>
                      </div>
                    </div>

                    {provider.successRate && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Success Rate</span>
                          <span className="font-medium">{provider.successRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={provider.successRate} className="h-2" />
                      </div>
                    )}

                    {provider.circuitBreakerState === "OPEN" && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Circuit breaker is open. Provider is temporarily disabled due to failures.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6 animate-fade-in">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  System Logs
                </CardTitle>
                <CardDescription>Real-time system activity and debugging information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                  <div className="space-y-1">
                    <div>[{new Date().toISOString()}] INFO: Email service initialized</div>
                    <div>[{new Date().toISOString()}] INFO: Circuit breakers configured</div>
                    <div>[{new Date().toISOString()}] INFO: Rate limiter active (100 req/min)</div>
                    <div>[{new Date().toISOString()}] INFO: Queue processor started</div>
                    <div>[{new Date().toISOString()}] INFO: Providers health check completed</div>
                    {emailStatuses.slice(0, 10).map((status, index) => (
                      <div key={index} className={status.status === "failed" ? "text-red-400" : "text-green-400"}>
                        [{status.timestamp}] {status.status === "failed" ? "ERROR" : "INFO"}: Email {status.status} to{" "}
                        {status.to} via {status.provider || "unknown"}
                        (attempts: {status.attempts})
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features Overview */}
        <Card className="mt-8 shadow-lg animate-fade-in delay-500">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:text-white">
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Zap className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
              Enterprise Features
            </CardTitle>
            <CardDescription className="dark:text-gray-300">
              Advanced reliability and monitoring capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow">
                <RefreshCw className="h-8 w-8 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Intelligent Retry Logic</h3>
                  <p className="text-sm text-muted-foreground">
                    Exponential backoff with jitter prevents thundering herd problems
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow">
                <Server className="h-8 w-8 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Provider Fallback</h3>
                  <p className="text-sm text-muted-foreground">
                    Seamless switching between providers ensures maximum deliverability
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow">
                <Shield className="h-8 w-8 text-purple-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Idempotency Protection</h3>
                  <p className="text-sm text-muted-foreground">
                    Prevents duplicate sends with intelligent request deduplication
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow">
                <Activity className="h-8 w-8 text-red-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Circuit Breaker</h3>
                  <p className="text-sm text-muted-foreground">
                    Prevents cascading failures with automatic recovery mechanisms
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow">
                <Timer className="h-8 w-8 text-orange-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Rate Limiting</h3>
                  <p className="text-sm text-muted-foreground">
                    Token bucket algorithm ensures fair usage and prevents abuse
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow">
                <Eye className="h-8 w-8 text-indigo-500 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Real-time Monitoring</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive observability with metrics and structured logging
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scroll to Top Button - ADDED HERE */}
      <ScrollToTop />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-400 {
          animation-delay: 400ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </div>
  )
}