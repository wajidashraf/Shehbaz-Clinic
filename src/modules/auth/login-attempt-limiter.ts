type LoginAttemptLimiterOptions = {
  maximumFailures: number;
  windowMs: number;
};

type AttemptRecord = {
  failures: number;
  resetAt: number;
};

export class LoginAttemptLimiter {
  private readonly attempts = new Map<string, AttemptRecord>();

  constructor(private readonly options: LoginAttemptLimiterOptions) {}

  isBlocked(key: string, now = Date.now()) {
    const current = this.attempts.get(key);
    if (!current) return false;
    if (current.resetAt <= now) {
      this.attempts.delete(key);
      return false;
    }
    return current.failures >= this.options.maximumFailures;
  }

  recordFailure(key: string, now = Date.now()) {
    const current = this.attempts.get(key);
    if (!current || current.resetAt <= now) {
      this.attempts.set(key, {
        failures: 1,
        resetAt: now + this.options.windowMs,
      });
      return;
    }
    current.failures += 1;
  }

  reset(key: string) {
    this.attempts.delete(key);
  }
}
