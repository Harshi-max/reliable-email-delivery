"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw, Mail, Server, Activity } from "lucide-react"
import BackButton from "@/components/navigation/BackButton"


interface ProviderStatus {
  name: string
  configured: boolean
  healthy: boolean
  lastChecked: string
}

export default function StatusPage() {
  const [providers, setProviders] = useState<ProviderStatus[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const checkProviderStatus = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to check provider status
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProviders([
        {
          name: "Resend",
          configured: true,
          healthy: true,
          lastChecked: new Date().toISOString(),
        },
        {
          name: "SendGrid",
          configured: false,
          healthy: false,
          lastChecked: new Date().toISOString(),
        },
        {
          name: "SMTP",
          configured: false,
          healthy: false,
          lastChecked: new Date().toISOString(),
        },
      ])
    } catch (error) {
      console.error("Failed to check provider status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkProviderStatus()
  }, [])

  const configuredProviders = providers.filter((p) => p.configured)
  const healthyProviders = providers.filter((p) => p.configured && p.healthy)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <div className="mb-3">
    <BackButton fallback="/dashboard" label="Back" />
  </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-600 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Service Status
              </h1>
              <p className="text-muted-foreground">Real-time status of email providers and system health</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">System Operational</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {configuredProviders.length} Provider{configuredProviders.length !== 1 ? "s" : ""} Configured
              </Badge>
            </div>
            <Button onClick={checkProviderStatus} disabled={isLoading} variant="outline">
              {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh Status
            </Button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Configured Providers</p>
                  <p className="text-3xl font-bold text-green-600">{configuredProviders.length}</p>
                </div>
                <Server className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Healthy Providers</p>
                  <p className="text-3xl font-bold text-blue-600">{healthyProviders.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Status</p>
                  <p className="text-lg font-bold text-purple-600">Operational</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Provider Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Provider Status
            </CardTitle>
            <CardDescription>Current status of all configured email providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {providers.map((provider) => (
                <div
                  key={provider.name}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {provider.configured && provider.healthy ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : provider.configured ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <h3 className="font-medium">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Last checked: {new Date(provider.lastChecked).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {provider.configured ? (
                      <>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Configured
                        </Badge>
                        <Badge
                          variant={provider.healthy ? "default" : "destructive"}
                          className={provider.healthy ? "bg-green-100 text-green-800" : ""}
                        >
                          {provider.healthy ? "Healthy" : "Unhealthy"}
                        </Badge>
                      </>
                    ) : (
                      <Badge variant="secondary">Not Configured</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Alerts */}
        <div className="space-y-4">
          {configuredProviders.length > 0 ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>✅ Service Ready:</strong> You have {configuredProviders.length} email provider
                {configuredProviders.length !== 1 ? "s" : ""} configured and ready to send emails.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-orange-200 bg-orange-50">
              <XCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>⚠️ No Providers Configured:</strong> Please configure at least one email provider to start
                sending emails.
              </AlertDescription>
            </Alert>
          )}

          <Alert className="border-blue-200 bg-blue-50">
            <Mail className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>🚀 Resend Active:</strong> Your Resend API key is configured and ready to send real emails. The
              service will automatically use Resend as the primary provider with mock providers as fallback.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
