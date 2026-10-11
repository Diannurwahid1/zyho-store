import CryptoJS from 'crypto-js'
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
} from 'crypto'

const VERSION = 'v2'

const getSecret = () => {
  const secret = process.env.ENCRYPTION_KEY
  if (!secret) throw new Error('ENCRYPTION_KEY is required.')
  return secret
}

const getKey = () => createHash('sha256').update(getSecret()).digest()

export const encryptSensitiveValue = (value: unknown) => {
  if (!value || typeof value !== 'string' || value.startsWith(`${VERSION}:`)) return value
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', getKey(), iv)
  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [VERSION, iv.toString('base64url'), tag.toString('base64url'), ciphertext.toString('base64url')].join(':')
}

export const decryptSensitiveValue = (value: unknown) => {
  if (!value || typeof value !== 'string') return value

  if (value.startsWith(`${VERSION}:`)) {
    try {
      const [, encodedIV, encodedTag, encodedCiphertext] = value.split(':')
      if (!encodedIV || !encodedTag || !encodedCiphertext) return value
      const decipher = createDecipheriv('aes-256-gcm', getKey(), Buffer.from(encodedIV, 'base64url'))
      decipher.setAuthTag(Buffer.from(encodedTag, 'base64url'))
      return Buffer.concat([
        decipher.update(Buffer.from(encodedCiphertext, 'base64url')),
        decipher.final(),
      ]).toString('utf8')
    } catch {
      return value
    }
  }

  // Read legacy CryptoJS ciphertext so existing credentials remain usable.
  try {
    const decrypted = CryptoJS.AES.decrypt(value, getSecret()).toString(CryptoJS.enc.Utf8)
    return decrypted || value
  } catch {
    return value
  }
}

export const keyedLookup = (namespace: string, value: string) =>
  createHmac('sha256', getKey()).update(`${namespace}:${value}`).digest('hex')

export const hashGoogleID = (value: string) => `gid:${keyedLookup('google-id', value.trim())}`
