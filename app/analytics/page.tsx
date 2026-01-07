"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import BackButton from "@/components/navigation/BackButton"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Mail,
  Eye,
  MousePointer,
  AlertTriangle,
  Filter,
  Calendar,
  BarChart3,
} from "lucide-react"

interface AnalyticsData {
  metrics: {
    deliveryRate: number
    openRate: number
    clickRate: number
    bounceRate: number
    totalEmails: number
  }
  providerMetrics: Record<string, any>
  chartData: Array<{
    date: string
    delivered: number
    opened: number
    clicked: number
    bounced: number
  }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")
  const [provider, setProvider] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange, provider])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (provider !== "all") params.append("provider", provider)
      if (dateFrom) params.append("dateFrom", dateFrom)
      if (dateTo) params.append("dateTo", dateTo)

      const response = await fetch(`/api/email/analytics?${params}`)
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const pieData = data ? [
    { name: "Delivered", value: data.metrics.deliveryRate, color: "#10b981" },
    { name: "Opened", value: data.metrics.openRate, color: "#3b82f6" },
    { name: "Clicked", value: data.metrics.clickRate, color: "#8b5cf6" },
    { name: "Bounced", value: data.metrics.bounceRate, color: "#ef4444" },
  ] : []

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const hasData = data && data.metrics.totalEmails > 0

  return (
    <div className="min-h-screen w-full bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton fallback="/dashboard" label="Back to Dashboard" />
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Email Performance Analytics
                </h1>
                <p className="text-muted-foreground">Track delivery rates, engagement, and campaign performance</p>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Time Range</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Provider</Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Providers</SelectItem>
                    <SelectItem value="Resend">Resend</SelectItem>
                    <SelectItem value="MockProviderA">MockProviderA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {timeRange === "custom" && (
                <>
                  <div>
                    <Label>From Date</Label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>To Date</Label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
            {timeRange === "custom" && (
              <Button onClick={fetchAnalytics} className="mt-4">
                Apply Filters
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Rate</p>
                  <p className="text-3xl font-bold text-green-600">
                    {hasData ? data?.metrics.deliveryRate.toFixed(1) : "0.0"}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {hasData ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600">Real data</span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-500">No data yet</span>
                    )}
                  </div>
                </div>
                <Mail className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Rate</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {hasData ? data?.metrics.openRate.toFixed(1) : "0.0"}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {hasData ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <span className="text-xs text-blue-600">Real data</span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-500">No data yet</span>
                    )}
                  </div>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Click Rate</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {hasData ? data?.metrics.clickRate.toFixed(1) : "0.0"}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {hasData ? (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-600">Real data</span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-500">No data yet</span>
                    )}
                  </div>
                </div>
                <MousePointer className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bounce Rate</p>
                  <p className="text-3xl font-bold text-red-600">
                    {hasData ? data?.metrics.bounceRate.toFixed(1) : "0.0"}%
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {hasData ? (
                      <>
                        <TrendingDown className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600">Real data</span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-500">No data yet</span>
                    )}
                  </div>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        {!hasData ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Analytics Data Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start sending emails through the dashboard to see analytics data here.
              </p>
              <Button asChild>
                <a href="/dashboard">Send Your First Email</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Performance Trends</CardTitle>
                <CardDescription>Daily email metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data?.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="opened" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="clicked" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="bounced" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>Breakdown of email engagement rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Provider Comparison */}
        {hasData && Object.keys(data.providerMetrics).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Provider Performance Comparison</CardTitle>
              <CardDescription>Compare metrics across different email providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(data.providerMetrics).map(([providerName, metrics]) => (
                  <div key={providerName} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{providerName}</h3>
                      <Badge variant="outline">{metrics.totalEmails} emails</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Delivery Rate</p>
                        <p className="font-medium text-green-600">{metrics.deliveryRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Open Rate</p>
                        <p className="font-medium text-blue-600">{metrics.openRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Click Rate</p>
                        <p className="font-medium text-purple-600">{metrics.clickRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Bounce Rate</p>
                        <p className="font-medium text-red-600">{metrics.bounceRate.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Volume Chart */}
        {hasData && (
          <Card>
            <CardHeader>
              <CardTitle>Daily Email Volume</CardTitle>
              <CardDescription>Email sending volume and status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="delivered" stackId="a" fill="#10b981" />
                  <Bar dataKey="opened" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="clicked" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="bounced" stackId="a" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}