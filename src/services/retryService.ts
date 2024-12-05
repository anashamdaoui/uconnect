
type RetryOptions = {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    onRetry?: (attempt: number) => void;
  };
  
  class RetryService {
    static async withRetry<T>(
      fn: () => Promise<T>, 
      options: RetryOptions = {}
    ): Promise<T> {
      const {
        maxRetries = 3,
        baseDelay = 1000,
        maxDelay = 5000,
        onRetry
      } = options;
  
      let attempt = 0;
  
      while (attempt <= maxRetries) {
        try {
          return await fn();
        } catch (error) {
          attempt++;
  
          if (attempt > maxRetries) {
            throw error;
          }
  
          // Exponential backoff with jitter
          const delay = Math.min(
            maxDelay, 
            baseDelay * Math.pow(2, attempt) + 
            Math.random() * baseDelay
          );
  
          // Optional retry callback
          if (onRetry) {
            onRetry(attempt);
          }
  
          // Wait before next attempt
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
  
      throw new Error('Max retries exceeded');
    }
  
    // Circuit breaker pattern
    static createCircuitBreaker<T>(
      fn: () => Promise<T>, 
      options: {
        failureThreshold?: number;
        recoveryTime?: number;
      } = {}
    ) {
      const {
        failureThreshold = 3,
        recoveryTime = 30000
      } = options;
  
      let failures = 0;
      let lastFailureTime = 0;
      let isOpen = false;
  
      return async () => {
        const now = Date.now();
  
        // Check if circuit is open and in recovery period
        if (isOpen) {
          if (now - lastFailureTime < recoveryTime) {
            throw new Error('Circuit is open. Service temporarily unavailable.');
          }
          // Allow one test request to check if service recovered
          isOpen = false;
        }
  
        try {
          const result = await fn();
          // Reset on successful request
          failures = 0;
          return result;
        } catch (error) {
          failures++;
  
          if (failures >= failureThreshold) {
            isOpen = true;
            lastFailureTime = now;
          }
  
          throw error;
        }
      };
    }
  }
  
  export default RetryService;