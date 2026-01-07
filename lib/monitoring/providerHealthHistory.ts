export type ProviderHealthStatus = "healthy" | "unhealthy" | "degraded";

export type ProviderHealthEvent = {
  provider: string;
  timestamp: string;
  status: ProviderHealthStatus;
  reason?: string;
  responseTime?: number;
};

const MAX_EVENTS_PER_PROVIDER = 20;

/**
 * In-memory, bounded store for provider health history.
 * Designed to be easily replaced by Redis or DB later.
 */
class ProviderHealthHistoryStore {
  private history: Record<string, ProviderHealthEvent[]> = {};

  record(event: ProviderHealthEvent) {
    const events = this.history[event.provider] ?? [];

    events.push(event);

    // Keep only last N events
    if (events.length > MAX_EVENTS_PER_PROVIDER) {
      events.shift();
    }

    this.history[event.provider] = events;
  }

  getHistory(provider: string): ProviderHealthEvent[] {
    return this.history[provider] ?? [];
  }

  getAllHistory(): Record<string, ProviderHealthEvent[]> {
    return this.history;
  }
}

// Singleton instance shared across the app
export const providerHealthHistoryStore = new ProviderHealthHistoryStore();
