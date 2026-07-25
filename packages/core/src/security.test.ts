import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EnvSecretsProvider, SecretMasker } from './security/index.js';

describe('EnvSecretsProvider', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should retrieve secrets prefixed with MYSTACK_SECRET_', async () => {
    process.env.MYSTACK_SECRET_DB_PASS = 'super_secret_123';
    const provider = new EnvSecretsProvider();

    expect(await provider.has('db_pass')).toBe(true);
    expect(await provider.get('db_pass')).toBe('super_secret_123');
  });

  it('should fallback to standard env vars if prefix not present', async () => {
    process.env.OPENAI_API_KEY = 'sk-test-key-999';
    const provider = new EnvSecretsProvider();

    expect(await provider.has('OPENAI_API_KEY')).toBe(true);
    expect(await provider.get('OPENAI_API_KEY')).toBe('sk-test-key-999');
  });

  it('should list all custom secret keys', async () => {
    process.env.MYSTACK_SECRET_KEY_A = 'valA';
    process.env.MYSTACK_SECRET_KEY_B = 'valB';
    const provider = new EnvSecretsProvider();

    const keys = await provider.list();
    expect(keys).toContain('key_a');
    expect(keys).toContain('key_b');
  });
});

describe('SecretMasker', () => {
  it('should mask known token patterns in strings', () => {
    const raw = 'Connecting with sk-abcdef1234567890abcdef1234567890 to server';
    const masked = SecretMasker.mask(raw);
    expect(masked).not.toContain('sk-abcdef1234567890abcdef1234567890');
    expect(masked).toContain('[REDACTED_TOKEN]');
  });

  it('should mask explicit secret strings', () => {
    const raw = 'Password is my_password_xyz';
    const masked = SecretMasker.mask(raw, ['my_password_xyz']);
    expect(masked).toBe('Password is [REDACTED_SECRET]');
  });

  it('should deep-walk objects and redact sensitive key values', () => {
    const payload = {
      user: 'alice',
      apiKey: 'sk-12345',
      config: {
        password: 'pass',
        timeout: 5000,
      },
    };

    const masked = SecretMasker.maskObject(payload);
    expect(masked.user).toBe('alice');
    expect(masked.apiKey).toBe('[REDACTED]');
    expect(masked.config.password).toBe('[REDACTED]');
    expect(masked.config.timeout).toBe(5000);
  });
});
