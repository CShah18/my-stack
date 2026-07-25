export class SecretMasker {
  private static readonly TOKEN_PATTERNS = [
    /sk-[a-zA-Z0-9]{32,}/g,                  // OpenAI-style keys
    /ghp_[a-zA-Z0-9]{36}/g,                 // GitHub Personal Access Tokens
    /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g, // JWT Tokens
    /Bearer\s+[a-zA-Z0-9._-]{20,}/gi,       // Bearer Auth Tokens
  ];

  public static mask(text: string, secrets: string[] = []): string {
    let masked = text;

    // Mask explicit secret values
    for (const secret of secrets) {
      if (secret && secret.length >= 4) {
        masked = masked.replaceAll(secret, '[REDACTED_SECRET]');
      }
    }

    // Mask regex token patterns
    for (const pattern of this.TOKEN_PATTERNS) {
      masked = masked.replaceAll(pattern, '[REDACTED_TOKEN]');
    }

    return masked;
  }

  public static maskObject<T>(obj: T, secrets: string[] = []): T {
    if (obj === null || obj === undefined) return obj;

    if (typeof obj === 'string') {
      return this.mask(obj, secrets) as unknown as T;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.maskObject(item, secrets)) as unknown as T;
    }

    if (typeof obj === 'object') {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        // Redact values of sensitive key names
        if (/api_?key|secret|token|password|auth/i.test(key) && typeof value === 'string') {
          result[key] = '[REDACTED]';
        } else {
          result[key] = this.maskObject(value, secrets);
        }
      }
      return result as T;
    }

    return obj;
  }
}
