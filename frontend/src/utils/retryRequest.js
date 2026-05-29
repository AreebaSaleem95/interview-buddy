/**
 * Retry a failed async function with exponential backoff
 * @param {Function} fn - The async function to retry
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @param {number} delay - Initial delay in milliseconds (default: 1000)
 * @returns {Promise}
 */
export async function retryRequest(fn, maxRetries = 3, delay = 1000) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx) except 408, 429, 503
      if (error.response) {
        const status = error.response.status;
        const retryableStatuses = [408, 429, 503];
        
        if (status >= 400 && status < 500 && !retryableStatuses.includes(status)) {
          throw error;
        }
      }

      // Wait before retrying with exponential backoff
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
}
