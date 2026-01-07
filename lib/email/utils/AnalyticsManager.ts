import type { EmailAnalytics, AnalyticsMetrics, AnalyticsFilter } from "../types"

export class AnalyticsManager {
  private analytics: EmailAnalytics[] = []

  recordEmailEvent(event: Omit<EmailAnalytics, "id" | "timestamp">): void {
    const analyticsEvent: EmailAnalytics = {
      id: this.generateId(),
      timestamp: new Date(),
      ...event,
    }
    this.analytics.push(analyticsEvent)
    
    // Keep only last 1000 events to prevent memory issues
    if (this.analytics.length > 1000) {
      this.analytics = this.analytics.slice(-1000)
    }
  }

  getMetrics(filter?: AnalyticsFilter): AnalyticsMetrics {
    const filteredData = this.filterAnalytics(filter)
    const total = filteredData.length

    if (total === 0) {
      return {
        deliveryRate: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0,
        totalEmails: 0,
        timeRange: this.getTimeRangeLabel(filter),
      }
    }

    const delivered = filteredData.filter(a => a.status === "delivered").length
    const opened = filteredData.filter(a => a.status === "opened").length
    const clicked = filteredData.filter(a => a.status === "clicked").length
    const bounced = filteredData.filter(a => a.status === "bounced").length

    return {
      deliveryRate: (delivered / total) * 100,
      openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
      clickRate: opened > 0 ? (clicked / opened) * 100 : 0,
      bounceRate: (bounced / total) * 100,
      totalEmails: total,
      timeRange: this.getTimeRangeLabel(filter),
    }
  }

  getAnalytics(filter?: AnalyticsFilter): EmailAnalytics[] {
    return this.filterAnalytics(filter)
  }

  getProviderMetrics(filter?: AnalyticsFilter): Record<string, AnalyticsMetrics> {
    const providers = [...new Set(this.analytics.map(a => a.provider))]
    const result: Record<string, AnalyticsMetrics> = {}

    providers.forEach(provider => {
      const providerFilter = { ...filter, provider }
      result[provider] = this.getMetrics(providerFilter)
    })

    return result
  }

  private filterAnalytics(filter?: AnalyticsFilter): EmailAnalytics[] {
    if (!filter) return this.analytics

    return this.analytics.filter(analytics => {
      if (filter.dateFrom && analytics.timestamp < filter.dateFrom) return false
      if (filter.dateTo && analytics.timestamp > filter.dateTo) return false
      if (filter.provider && analytics.provider !== filter.provider) return false
      if (filter.status && analytics.status !== filter.status) return false
      if (filter.recipient && !analytics.recipient.includes(filter.recipient)) return false
      return true
    })
  }

  private getTimeRangeLabel(filter?: AnalyticsFilter): string {
    if (!filter?.dateFrom && !filter?.dateTo) return "All time"
    if (filter.dateFrom && filter.dateTo) {
      return `${filter.dateFrom.toLocaleDateString()} - ${filter.dateTo.toLocaleDateString()}`
    }
    if (filter.dateFrom) return `From ${filter.dateFrom.toLocaleDateString()}`
    if (filter.dateTo) return `Until ${filter.dateTo.toLocaleDateString()}`
    return "All time"
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}