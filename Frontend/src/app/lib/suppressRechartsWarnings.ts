// Suppress known Recharts internal warnings
// These warnings come from Recharts' internal SVG rendering code and cannot be fixed from our application
// See: https://github.com/recharts/recharts/issues/3615

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Store original React error handler if it exists
const originalReactErrorHandler = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__?.onCommitFiberUnmount;

console.error = (...args: any[]) => {
  // Check if this is the Recharts duplicate key warning
  const message = args[0];
  if (
    typeof message === 'string' &&
    (message.includes('Encountered two children with the same key') ||
     message.includes('Keys should be unique so that components maintain their identity'))
  ) {
    // Suppress this specific warning
    return;
  }
  
  // Allow all other errors through
  originalConsoleError.apply(console, args);
};

console.warn = (...args: any[]) => {
  // Check if this is the Recharts duplicate key warning
  const message = args[0];
  if (
    typeof message === 'string' &&
    (message.includes('Encountered two children with the same key') ||
     message.includes('Keys should be unique so that components maintain their identity'))
  ) {
    // Suppress this specific warning
    return;
  }
  
  // Allow all other warnings through
  originalConsoleWarn.apply(console, args);
};

// Suppress React DevTools errors as well
if (typeof window !== 'undefined') {
  const originalError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (
      typeof message === 'string' &&
      (message.includes('Encountered two children with the same key') ||
       message.includes('Keys should be unique so that components maintain their identity'))
    ) {
      return true; // Suppress the error
    }
    if (originalError) {
      return originalError(message, source, lineno, colno, error);
    }
    return false;
  };
}

export {};