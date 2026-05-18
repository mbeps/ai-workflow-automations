import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginSchema } from '@/schemas/auth/login-schema';
import { registerSchema } from '@/schemas/auth/register-schema';
import { requireAuth, requireUnauth } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn(() => Promise.resolve(new Map())),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

// Mock lib/auth
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

describe('Auth Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Login Schema Validation', () => {
    it('should validate valid login data', () => {
      const validData = { email: 'test@example.com', password: 'password123' };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail on invalid email', () => {
      const invalidData = { email: 'not-an-email', password: 'password123' };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail on empty password', () => {
      const invalidData = { email: 'test@example.com', password: '' };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Register Schema Validation', () => {
    it('should validate valid registration data', () => {
      const validData = { 
        email: 'test@example.com', 
        password: 'password123', 
        confirmPassword: 'password123' 
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail if passwords do not match', () => {
      const invalidData = { 
        email: 'test@example.com', 
        password: 'password123', 
        confirmPassword: 'different' 
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.message === "Passwords don't match")).toBe(true);
      }
    });
  });

  describe('Auth Utils', () => {
    it('requireAuth should redirect if no session', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);
      
      await requireAuth();
      
      expect(redirect).toHaveBeenCalled();
    });

    it('requireAuth should return session if it exists', async () => {
      const mockSession = { user: { id: '1' } };
      vi.mocked(auth.api.getSession).mockResolvedValueOnce(mockSession as any);
      
      const session = await requireAuth();
      
      expect(session).toEqual(mockSession);
      expect(redirect).not.toHaveBeenCalled();
    });

    it('requireUnauth should redirect if session exists', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValueOnce({ user: { id: '1' } } as any);
      
      await requireUnauth();
      
      expect(redirect).toHaveBeenCalled();
    });
  });
});
