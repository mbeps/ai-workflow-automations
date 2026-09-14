import { describe, it, expect, afterEach, vi } from 'vitest';

const ORIGINAL_KEY = process.env.ENCRYPTION_KEY;

describe('Encryption error branches', () => {
  afterEach(() => {
    if (ORIGINAL_KEY === undefined) {
      delete process.env.ENCRYPTION_KEY;
    } else {
      process.env.ENCRYPTION_KEY = ORIGINAL_KEY;
    }
    vi.restoreAllMocks();
  });

  it('should throw when decrypting a tampered ciphertext', async () => {
    process.env.ENCRYPTION_KEY = 'test-key-of-at-least-32-characters-long-123';
    vi.resetModules();
    const { encrypt, decrypt } = await import('@/lib/encryption');

    const encrypted = encrypt('secret payload');
    // Flip a hex character in the middle of the ciphertext
    const mid = Math.floor(encrypted.length / 2);
    const tampered =
      encrypted.slice(0, mid) +
      (encrypted[mid] === '0' ? '1' : '0') +
      encrypted.slice(mid + 1);

    expect(() => decrypt(tampered)).toThrow();
  });

  it('should not return original plaintext when decrypting with a different key', async () => {
    process.env.ENCRYPTION_KEY = 'original-key-of-at-least-32-characters!!';
    vi.resetModules();
    const { encrypt } = await import('@/lib/encryption');
    const plaintext = 'my-api-key-12345';
    const encrypted = encrypt(plaintext);

    process.env.ENCRYPTION_KEY = 'different-key-of-at-least-32-characters!';
    vi.resetModules();
    const { decrypt } = await import('@/lib/encryption');

    let result: string | undefined;
    try {
      result = decrypt(encrypted);
    } catch {
      result = undefined;
    }

    expect(result).not.toBe(plaintext);
  });
});
