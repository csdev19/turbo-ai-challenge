import { describe, it, expect } from 'vitest'
import { SignupFormSchema, LoginFormSchema } from './definitions'

describe('SignupFormSchema', () => {
  it('accepts valid email and password', () => {
    const result = SignupFormSchema.safeParse({
      email: 'user@example.com',
      password: 'secure1pass',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = SignupFormSchema.safeParse({
      email: 'not-an-email',
      password: 'secure1pass',
    })
    expect(result.success).toBe(false)
  })

  it('rejects password shorter than 8 characters', () => {
    const result = SignupFormSchema.safeParse({
      email: 'user@example.com',
      password: 'ab1',
    })
    expect(result.success).toBe(false)
  })

  it('rejects password without a letter', () => {
    const result = SignupFormSchema.safeParse({
      email: 'user@example.com',
      password: '12345678',
    })
    expect(result.success).toBe(false)
  })

  it('rejects password without a number', () => {
    const result = SignupFormSchema.safeParse({
      email: 'user@example.com',
      password: 'abcdefgh',
    })
    expect(result.success).toBe(false)
  })
})

describe('LoginFormSchema', () => {
  it('accepts valid email and password', () => {
    const result = LoginFormSchema.safeParse({
      email: 'user@example.com',
      password: 'anypass',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = LoginFormSchema.safeParse({
      email: 'bad',
      password: 'anypass',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty password', () => {
    const result = LoginFormSchema.safeParse({
      email: 'user@example.com',
      password: '',
    })
    expect(result.success).toBe(false)
  })
})
