// Sistema de logs detalhados para debugging
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: any;
  error?: Error;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private addLog(level: LogLevel, module: string, message: string, data?: any, error?: Error) {
    const logEntry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      module,
      message,
      data,
      error
    };

    this.logs.push(logEntry);
    
    // Manter apenas os últimos logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log no console também
    const prefix = `[${level.toUpperCase()}] [${module}] ${this.formatTimestamp()}:`;
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(prefix, message, data, error);
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, data);
        break;
      case LogLevel.INFO:
        console.info(prefix, message, data);
        break;
      case LogLevel.DEBUG:
        console.debug(prefix, message, data);
        break;
    }
  }

  error(module: string, message: string, error?: Error, data?: any) {
    this.addLog(LogLevel.ERROR, module, message, data, error);
  }

  warn(module: string, message: string, data?: any) {
    this.addLog(LogLevel.WARN, module, message, data);
  }

  info(module: string, message: string, data?: any) {
    this.addLog(LogLevel.INFO, module, message, data);
  }

  debug(module: string, message: string, data?: any) {
    this.addLog(LogLevel.DEBUG, module, message, data);
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  getErrorLogs(): LogEntry[] {
    return this.getLogs(LogLevel.ERROR);
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();

// Helper para logs de operações assíncronas
export async function withLogging<T>(
  module: string,
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  logger.info(module, `Iniciando operação: ${operation}`);
  
  try {
    const result = await fn();
    logger.info(module, `Operação concluída com sucesso: ${operation}`);
    return result;
  } catch (error) {
    logger.error(module, `Falha na operação: ${operation}`, error as Error);
    throw error;
  }
}