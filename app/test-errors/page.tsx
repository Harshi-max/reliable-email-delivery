"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, RefreshCw, AlertTriangle, Shield, Timer, Server, Activity } from "lucide-react"
import BackButton from "@/components/navigation/BackButton"
import { ThemeToggle } from "@/components/theme-toggle"

interface NormalizedError {
  category: string
  severity: string
  explanation: string
  suggestedAction: string
  shouldRetry: boolean
  shouldFallback: boolean
}

interface TestResult {
  testCase: string
  provider: string
  rawError: string
  normalized: NormalizedError
}

export default function TestErrorsPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTests = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/test-errors')
      if (!response.ok) throw new Error('Failed to load test results')
      const data = await response.json()
      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTests()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'TEMPORARY':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'PERMANENT':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'CRITICAL':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AUTHENTICATION':
        return <Shield className="h-4 w-4" />
      case 'RATE_LIMITING':
        return <Timer className="h-4 w-4" />
      case 'NETWORK':
        return <Server className="h-4 w-4" />
      case 'VALIDATION':
      case 'RECIPIENT':
      case 'CONTENT':
        return <AlertTriangle className="h-4 w-4" />
      case 'CONFIGURATION':
        return <Activity className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BackButton fallback="/dashboard" label="Back to Dashboard" />
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🔍 Error Normalization Tests
                </h1>
                <p className="text-muted-foreground">
                  Testing {results.length} error patterns
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={loadTests} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-muted-foreground">Loading tests...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {!loading && !error && (
          <div className="space-y-4">
            {/* Summary Card */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-lg font-semibold text-green-900">
                      All {results.length} error patterns normalized successfully!
                    </p>
                    <p className="text-sm text-green-700">
                      Each error is transformed into actionable insights
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            {results.map((result, index) => (
              <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      {result.testCase}
                    </CardTitle>
                    <Badge variant="outline">{result.provider}</Badge>
                  </div>
                  <CardDescription className="font-mono text-xs bg-gray-100 p-2 rounded mt-2">
                    {result.rawError}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                    {/* Category and Severity */}
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(result.normalized.category)}
                      <Badge className={`${getSeverityColor(result.normalized.severity)} text-xs`}>
                        {result.normalized.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {result.normalized.category.replace(/_/g, ' ')}
                      </Badge>
                    </div>

                    {/* Explanation */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        📝 Explanation:
                      </p>
                      <p className="text-sm text-red-900">
                        {result.normalized.explanation}
                      </p>
                    </div>

                    {/* Suggested Action */}
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        💡 Suggested Action:
                      </p>
                      <p className="text-sm text-blue-900">
                        {result.normalized.suggestedAction}
                      </p>
                    </div>

                    {/* Retry/Fallback Info */}
                    <div className="flex gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Should Retry:</span>
                        <Badge variant={result.normalized.shouldRetry ? "default" : "secondary"} className="text-xs">
                          {result.normalized.shouldRetry ? '✓ Yes' : '✗ No'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Should Fallback:</span>
                        <Badge variant={result.normalized.shouldFallback ? "default" : "secondary"} className="text-xs">
                          {result.normalized.shouldFallback ? '✓ Yes' : '✗ No'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
