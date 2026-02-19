/**
 * Logging system for the Math Diagram Engine
 */

// Check if we're in browser or Node.js environment
const isBrowser = typeof window !== 'undefined';

class Logger {
  constructor() {
    this.logLevel = isBrowser ? 'info' : (process.env.LOG_LEVEL || 'info');
    this.fs = null;
    this.path = null;
    this.logFile = null;
    
    if (!isBrowser) {
      // Only in Node.js environment
      this.initializeFileLogging();
    }
  }
  
  async initializeFileLogging() {
    // Dynamic imports for Node.js only
    try {
      const fsModule = await import('fs');
      const pathModule = await import('path');
      this.fs = fsModule.default;
      this.path = pathModule.default;
      this.logFile = this.path.join(process.cwd(), 'logs', 'math-diagram-engine.log');
      this.ensureLogDirectory();
    } catch (error) {
      console.warn('Failed to initialize file logging:', error.message);
    }
  }
  
  ensureLogDirectory() {
    if (!this.fs || !this.path) return;
    
    const logDir = this.path.dirname(this.logFile);
    try {
      this.fs.mkdirSync(logDir, { recursive: true });
    } catch (error) {
      // Directory already exists or cannot be created
    }
  }
  
  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | Data: ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataStr}`;
  }
  
  writeLog(level, message, data) {
    if (!this.shouldLog(level)) return;
    
    const formattedMessage = this.formatMessage(level, message, data);
    
    if (isBrowser) {
      // Browser: console logging
      console.log(formattedMessage);
    } else {
      // Node.js: file logging
      try {
        this.fs.appendFileSync(this.logFile, formattedMessage + '\n');
      } catch (error) {
        console.error('Failed to write to log file:', error.message);
      }
    }
  }
  
  shouldLog(level) {
    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }
  
  error(message, data = null) {
    this.writeLog('error', message, data);
  }
  
  warn(message, data = null) {
    this.writeLog('warn', message, data);
  }
  
  info(message, data = null) {
    this.writeLog('info', message, data);
  }
  
  debug(message, data = null) {
    this.writeLog('debug', message, data);
  }
  
  diagramParse(type, success, errors, data = null) {
    if (this.shouldLog('info')) {
      const message = this.formatMessage('info', 'Diagram Parse Attempt', {
        type,
        success,
        errors,
        ...data
      });
      
      if (isBrowser) {
        console.log(message);
      } else if (this.fs) {
        try {
          this.fs.appendFileSync(this.logFile, message + '\n');
        } catch (error) {
          console.error('Failed to write to log file:', error.message);
        }
      }
    }
  }
  
  diagramRender(type, success, renderTime, errors, data = null) {
    if (this.shouldLog('info')) {
      const message = this.formatMessage('info', 'Diagram Render Attempt', {
        type,
        success,
        renderTime,
        errors,
        ...data
      });
      
      if (isBrowser) {
        console.log(message);
      } else if (this.fs) {
        try {
          this.fs.appendFileSync(this.logFile, message + '\n');
        } catch (error) {
          console.error('Failed to write to log file:', error.message);
        }
      }
    }
  }
  
  performance(operation, duration, data = null) {
    this.info('Performance Metric', {
      operation,
      duration,
      ...data
    });
  }
}

export default Logger;
