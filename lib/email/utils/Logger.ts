export class Logger {
  private logLevel: "debug" | "info" | "warn" | "error" = "info"

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
    if (this.shouldLog("error")) {
      this.log("ERROR", message, meta)
    }
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
      ...meta,
    }

    console.log(JSON.stringify(logEntry, null, 2))
  }
}
