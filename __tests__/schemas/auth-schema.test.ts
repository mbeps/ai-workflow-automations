import { describe, it, expect } from 'vitest';
import { loginSchema, type LoginFormValues } from '@/schemas/auth/login.schema';
import {
  registerSchema,
  type RegisterFormValues,
} from '@/schemas/auth/register.schema';

describe('loginSchema', () => {
  const valid = { email: 'user@example.com', password: 'secret' };

  it('accepts valid input', () => {
    expect(loginSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ ...valid, password: '' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const valid = {
    email: 'user@example.com',
    password: 'hunter2',
    confirmPassword: 'hunter2',
  };

  it('accepts valid input', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(
      registerSchema.safeParse({ ...valid, email: 'nope' }).success,
    ).toBe(false);
  });

  it('rejects empty password (min length rule)', () => {
    expect(
      registerSchema.safeParse({ ...valid, password: '', confirmPassword: '' })
        .success,
    ).toBe(false);
  });

  it('rejects mismatched confirmPassword', () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirmPassword: 'different',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Passwords don't match");
      expect(result.error.issues[0].path).toEqual(['confirmPassword']);
    }
  });

  it('infers LoginFormValues / RegisterFormValues types matching schema output', () => {
    const login: LoginFormValues = loginSchema.parse({
      email: 'a@b.co',
      password: 'x',
    });
    const register: RegisterFormValues = registerSchema.parse(valid);
    expect(login.email).toBe('a@b.co');
    expect(register.password).toBe('hunter2');
  });
});
