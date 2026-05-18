import { describe, it, expect, vi } from 'vitest';
import { encrypt, decrypt } from '@/lib/encryption';

// Mock env
vi.mock('@/lib/env', () => ({
  env: {
    ENCRYPTION_KEY: 'test-key-of-at-least-32-characters-long-123',
  },
}));

describe('Encryption Logic', () => {
  const testText = 'Hello, this is a secret!';

  it('should encrypt a string', () => {
    const encrypted = encrypt(testText);
    expect(encrypted).toBeDefined();
    expect(encrypted).not.toBe(testText);
  });

  it('should decrypt an encrypted string back to original', () => {
    const encrypted = encrypt(testText);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(testText);
  });

  it('should result in different ciphertexts for the same input (if cryptr uses salt/iv internally)', () => {
    // Note: cryptr uses IV internally so it should be different if it rotates, 
    // but its api is deterministic for simple use if key is same and it doesn't salt per call.
    // Actually, cryptr (aes-256-ctr by default) uses a random IV so ciphertexts should be different.
    const encrypted1 = encrypt(testText);
    const encrypted2 = encrypt(testText);
    expect(encrypted1).not.toBe(encrypted2);
  });

  it('should throw error when decrypting invalid string', () => {
    expect(() => decrypt('invalid-string')).toThrow();
  });
});
