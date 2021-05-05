interface ILogger {
  log(message: string): void;
  warn(message: string, error?: any): void;
  error(message: string, error?: any): void;
}

let loggingEnabled = false;

class ConsoleLogger implements ILogger {
  log(message: string) {
    if (loggingEnabled) {
      console.log(message);
    }
  }

  warn(message: string, error?: any) {
    if (loggingEnabled) {
      console.warn(message, error);
    }
  }

  error(message: string, error?: any) {
    if (loggingEnabled) {
      console.error(message, error);
    }
  }
}

export function enableLogging() {
  loggingEnabled = true;
}

export function getLogger(name: string): ILogger {
  return new ConsoleLogger();
}
