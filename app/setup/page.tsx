"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Settings, Key, Server, AlertTriangle, CheckCircle, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import NavLink from "@/components/ui/nav-link"
import ScrollToTop from "@/components/ui/scroll-to-top"

import BackButton from "@/components/navigation/BackButton"
export default function SetupPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Email Provider Setup
                </h1>
                <p className="text-muted-foreground">Configure real email providers to start sending actual emails</p>
              </div>
          <div className="mb-3">
    <BackButton fallback="/dashboard" label="Back to Dashboard" forceRedirect={true} />
  </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg shrink-0">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Email Provider Setup
                </h1>
                <p className="text-sm text-muted-foreground">Configure real email providers to start sending actual emails</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
           
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Currently using mock providers:</strong> The demo is using simulated email providers. To send real
              emails, configure one or more providers below.
            </AlertDescription>
          </Alert>
        </div>

        {/* Updated Tabs with Active Highlighting */}
        <Tabs defaultValue="sendgrid" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="sendgrid">SendGrid</TabsTrigger>
            <TabsTrigger value="resend">Resend</TabsTrigger>
            <TabsTrigger value="smtp">SMTP</TabsTrigger>
            <TabsTrigger value="env">Environment</TabsTrigger>
          </TabsList>

          {/* SendGrid Setup */}
          <TabsContent value="sendgrid">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  SendGrid Configuration
                </CardTitle>
                <CardDescription>
                  SendGrid is a reliable email delivery service with excellent deliverability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">1. Get SendGrid API Key</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Sign up at SendGrid and create an API key with Mail Send permissions
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://sendgrid.com" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Go to SendGrid
                      </a>
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">2. Set Environment Variable</h3>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                      <div className="flex items-center justify-between">
                        <span>SENDGRID_API_KEY=your_api_key_here</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard("SENDGRID_API_KEY=your_api_key_here")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Recommended:</strong> SendGrid offers 100 free emails per day and has excellent
                    deliverability rates.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resend Setup */}
          <TabsContent value="resend">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-500" />
                  Resend Configuration
                </CardTitle>
                <CardDescription>Modern email API built for developers with great DX</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">1. Get Resend API Key</h3>
                    <p className="text-sm text-muted-foreground mb-3">Sign up at Resend and create an API key</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://resend.com" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Go to Resend
                      </a>
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">2. Set Environment Variable</h3>
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                      <div className="flex items-center justify-between">
                        <span>RESEND_API_KEY=your_api_key_here</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard("RESEND_API_KEY=your_api_key_here")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Developer Friendly:</strong> Resend offers 3,000 free emails per month and has a simple,
                    modern API.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMTP Setup */}
          <TabsContent value="smtp">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-green-500" />
                  SMTP Configuration
                </CardTitle>
                <CardDescription>Use any SMTP server (Gmail, Outlook, custom server)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-semibold">Environment Variables</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { key: "SMTP_HOST", value: "smtp.gmail.com", desc: "SMTP server hostname" },
                      { key: "SMTP_PORT", value: "587", desc: "SMTP server port" },
                      { key: "SMTP_SECURE", value: "false", desc: "Use TLS (true/false)" },
                      { key: "SMTP_USER", value: "your-email@gmail.com", desc: "SMTP username" },
                      { key: "SMTP_PASS", value: "your-app-password", desc: "SMTP password" },
                    ].map((env) => (
                      <div key={env.key} className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-blue-400">{env.key}</span>=<span>{env.value}</span>
                            <p className="text-xs text-gray-400 mt-1">{env.desc}</p>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(`${env.key}=${env.value}`)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Gmail Users:</strong> You'll need to use an App Password instead of your regular password.
                    Enable 2FA and generate an App Password in your Google Account settings.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Environment Setup */}
          <TabsContent value="env">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-orange-500" />
                  Environment Variables
                </CardTitle>
                <CardDescription>Complete list of environment variables for all providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm space-y-2">
                  <div className="text-blue-400 font-semibold"># SendGrid</div>
                  <div>SENDGRID_API_KEY=your_sendgrid_api_key</div>

                  <div className="text-blue-400 font-semibold mt-4"># Resend</div>
                  <div>RESEND_API_KEY=your_resend_api_key</div>

                  <div className="text-blue-400 font-semibold mt-4"># SMTP</div>
                  <div>SMTP_HOST=smtp.gmail.com</div>
                  <div>SMTP_PORT=587</div>
                  <div>SMTP_SECURE=false</div>
                  <div>SMTP_USER=your-email@gmail.com</div>
                  <div>SMTP_PASS=your-app-password</div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Setup Instructions</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>
                      Create a <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file in your project
                      root
                    </li>
                    <li>Add the environment variables for your chosen provider(s)</li>
                    <li>Restart your development server</li>
                    <li>The service will automatically detect and use configured providers</li>
                  </ol>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Multiple Providers:</strong> You can configure multiple providers for automatic fallback.
                    The service will try each provider in order until one succeeds.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Current Status */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Current Configuration Status</CardTitle>
            <CardDescription>Check which providers are currently available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">SendGrid</span>
                <Badge variant="secondary">Not Configured</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">Resend</span>
                <Badge variant="secondary">Not Configured</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">SMTP</span>
                <Badge variant="secondary">Not Configured</Badge>
              </div>
            </div>

            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Currently using mock providers for demonstration. Configure at least one real provider above to send
                actual emails.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
      
      <ScrollToTop />
    </div>
  )
}