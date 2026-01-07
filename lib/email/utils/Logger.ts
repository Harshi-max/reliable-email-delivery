export class Logger {
  private logLevel: "debug" | "info" | "warn" | "error" = "info"
  private metrics = {
    totalRequests: 0,
    successCount: 0,
    errorCount: 0,
    providerFailures: new Map<string, number>()
  }

  setLogLevel(level: "debug" | "info" | "warn" | "error"): void {
    this.logLevel = level
  }

  debug(message: string, meta?: Record<string, any>): void {
    if (this.shouldLog("debug")) {
      this.log("DEBUG", message, meta)
    }
  }

  info(message: string, meta?: Record<string, any>): void {
    if (this.shouldLog("info")) {
      this.log("INFO", message, meta)
    }
  }

  warn(message: string, meta?: Record<string, any>): void {
    if (this.shouldLog("warn")) {
      this.log("WARN", message, meta)
    }
  }

  error(message: string, meta?: Record<string, any>): void {
    this.metrics.errorCount++
    if (meta?.provider) {
      const current = this.metrics.providerFailures.get(meta.provider) || 0
      this.metrics.providerFailures.set(meta.provider, current + 1)
    }
    if (this.shouldLog("error")) {
      this.log("ERROR", message, { ...meta, errorId: this.generateErrorId() })
    }
  }

  logSuccess(provider?: string): void {
    this.metrics.successCount++
    this.metrics.totalRequests++
  }

  logRequest(): void {
    this.metrics.totalRequests++
  }

  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.totalRequests > 0 ? (this.metrics.successCount / this.metrics.totalRequests) * 100 : 0,
      providerFailures: Object.fromEntries(this.metrics.providerFailures)
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
  }

  private shouldLog(level: string): boolean {
    const levels = ["debug", "info", "warn", "error"]
    return levels.indexOf(level) >= levels.indexOf(this.logLevel)
  }

  private log(level: string, message: string, meta?: Record<string, any>): void {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      service: "email-service",
      ...meta,
    }

    console.log(JSON.stringify(logEntry, null, 2))
  }
}
