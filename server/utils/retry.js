/**
 * retry.js — wraps an async function with exponential backoff
 * Retries on 429 (rate limit) and 503 (service unavailable)
 */
async function withRetry(fn, retries = 3, delayMs = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const status = err.response?.status;
      const isRetryable = status === 429 || status === 503;
      const isLastAttempt = attempt === retries;

      if (!isRetryable || isLastAttempt) throw err;

      const wait = delayMs * attempt; // 1s, 2s, 3s
      console.warn(`[Retry] Attempt ${attempt} failed (${status}). Retrying in ${wait}ms...`);
      await new Promise(res => setTimeout(res, wait));
    }
  }
}

module.exports = { withRetry };