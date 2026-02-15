/**
 * Centralized Logging Service
 * Provides structured logging with severity levels
 */

export type LogLevel = 'info' | 'warning' | 'error' | 'critical';

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  timestamp: Date;
  service?: string;
}

class Logger {
  private serviceName: string;

  constructor(serviceName: string = 'AIRA') {
    this.serviceName = serviceName;
  }

  /**
   * Format log entry
   */
  private formatLog(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const level = entry.level.toUpperCase().padEnd(8);
    const service = entry.service || this.serviceName;
    
    let log = `[${timestamp}] [${level}] [${service}] ${entry.message}`;
    
    if (entry.context && Object.keys(entry.context).length > 0) {
      log += `\n  Context: ${JSON.stringify(entry.context, null, 2)}`;
    }
    
    return log;
  }

  /**
   * Write log to console (will integrate with external service in production)
   */
  private writeLog(entry: LogEntry): void {
    const formattedLog = this.formatLog(entry);

    switch (entry.level) {
      case 'critical':
      case 'error':
        console.error(formattedLog);
        break;
      case 'warning':
        console.warn(formattedLog);
        break;
      case 'info':
      default:
        console.log(formattedLog);
        break;
    }

    // TODO: Send to external logging service in production
    // if (process.env.NODE_ENV === 'production') {
    //   this.sendToExternalService(entry);
    // }

    // TODO: Alert administrators for critical errors
    // if (entry.level === 'critical') {
    //   this.alertAdministrators(entry);
    // }
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, any>): void {
    this.writeLog({
      level: 'info',
      message,
      context,
      timestamp: new Date(),
      service: this.serviceName,
    });
  }

  /**
   * Log warning message
   */
  warning(message: string, context?: Record<string, any>): void {
    this.writeLog({
      level: 'warning',
      message,
      context,
      timestamp: new Date(),
      service: this.serviceName,
    });
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.writeLog({
      level: 'error',
      message,
      context: {
        ...context,
        error: error?.message,
        stack: error?.stack,
      },
      timestamp: new Date(),
      service: this.serviceName,
    });
  }

  /**
   * Log critical error
   */
  critical(message: string, error?: Error, context?: Record<string, any>): void {
    this.writeLog({
      level: 'critical',
      message,
      context: {
        ...context,
        error: error?.message,
        stack: error?.stack,
      },
      timestamp: new Date(),
      service: this.serviceName,
    });
  }

  /**
   * Create child logger with specific service name
   */
  child(serviceName: string): Logger {
    return new Logger(serviceName);
  }
}

// Export singleton instance
export const logger = new Logger('AIRA');

// Export class for creating child loggers
export default Logger;
