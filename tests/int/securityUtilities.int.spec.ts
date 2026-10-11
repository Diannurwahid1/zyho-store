import {
  decryptSensitiveValue,
  encryptSensitiveValue,
  keyedLookup,
} from '@/utilities/sensitiveData'
import {
  createOrderAccessToken,
  verifyOrderAccessToken,
} from '@/utilities/orderAccessToken'
import jwt from 'jsonwebtoken'
import { beforeEach, describe, expect, it } from 'vitest'

describe('security utilities', () => {
  beforeEach(() => {
    process.env.ENCRYPTION_KEY = 'test-encryption-key-with-sufficient-entropy'
    process.env.ORDER_ACCESS_SECRET = 'test-order-access-secret-with-sufficient-entropy'
  })

  it('encrypts sensitive values with authenticated encryption', () => {
    const plaintext = 'credential-password-123'
    const ciphertext = String(encryptSensitiveValue(plaintext))

    expect(ciphertext).toMatch(/^v2:/)
    expect(ciphertext).not.toContain(plaintext)
    expect(decryptSensitiveValue(ciphertext)).toBe(plaintext)

    const segments = ciphertext.split(':')
    const encryptedSegment = segments[3] || ''
    segments[3] = `${encryptedSegment[0] === 'A' ? 'B' : 'A'}${encryptedSegment.slice(1)}`
    const tampered = segments.join(':')

    expect(decryptSensitiveValue(tampered)).toBe(tampered)
    expect(decryptSensitiveValue(tampered)).not.toBe(plaintext)
  })

  it('creates deterministic namespace-bound lookup values', () => {
    expect(keyedLookup('redeem-code', 'ABC123')).toBe(keyedLookup('redeem-code', 'ABC123'))
    expect(keyedLookup('redeem-code', 'ABC123')).not.toBe(keyedLookup('google-id', 'ABC123'))
  })

  it('issues short-lived order tokens bound to normalized claims', () => {
    const token = createOrderAccessToken({ email: ' Customer@Example.COM ', orderID: 42 })
    const claims = verifyOrderAccessToken(token)
    const decoded = jwt.decode(token) as { exp?: number; iat?: number } | null

    expect(claims).toEqual({
      email: 'customer@example.com',
      orderID: '42',
      scope: 'order:read',
    })
    expect((decoded?.exp || 0) - (decoded?.iat || 0)).toBe(30 * 60)
  })

  it('rejects tampered tokens and tokens signed with an old secret', () => {
    const token = createOrderAccessToken({ email: 'customer@example.com', orderID: 42 })
    const [header, payload, signature] = token.split('.')
    const tampered = `${header}.${payload}.${signature?.startsWith('A') ? 'B' : 'A'}${signature?.slice(1)}`

    expect(verifyOrderAccessToken(tampered)).toBeNull()

    process.env.ORDER_ACCESS_SECRET = 'rotated-order-access-secret-with-sufficient-entropy'
    expect(verifyOrderAccessToken(token)).toBeNull()
  })
})
