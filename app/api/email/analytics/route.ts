import { NextRequest, NextResponse } from "next/server"
import { EmailService } from "@/lib/email/EmailService"
import type { AnalyticsFilter } from "@/lib/email/types"

const emailService = new EmailService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filter: AnalyticsFilter = {}
    
    if (searchParams.get("dateFrom")) {
      filter.dateFrom = new Date(searchParams.get("dateFrom")!)
    }
    
    if (searchParams.get("dateTo")) {
      filter.dateTo = new Date(searchParams.get("dateTo")!)
    }
    
    if (searchParams.get("provider")) {
      filter.provider = searchParams.get("provider")!
    }
    
    if (searchParams.get("status")) {
      filter.status = searchParams.get("status")!
    }

    const analyticsManager = emailService.getAnalyticsManager()
    
    const metrics = analyticsManager.getMetrics(filter)
    const providerMetrics = analyticsManager.getProviderMetrics(filter)
    const recentAnalytics = analyticsManager.getAnalytics(filter).slice(-50)

    // Generate chart data from real analytics
    const chartData = generateChartData(analyticsManager.getAnalytics(filter))
    
    return NextResponse.json({
      success: true,
      data: {
        metrics,
        providerMetrics,
        recentAnalytics,
        chartData,
      },
    })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}

function generateChartData(analytics: any[]) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  return last7Days.map(date => {
    const dayAnalytics = analytics.filter(a => 
      a.timestamp.toISOString().split('T')[0] === date
    )
    
    return {
      date,
      delivered: dayAnalytics.filter(a => a.status === 'delivered').length,
      opened: dayAnalytics.filter(a => a.status === 'opened').length,
      clicked: dayAnalytics.filter(a => a.status === 'clicked').length,
      bounced: dayAnalytics.filter(a => a.status === 'bounced').length,
    }
  })
}