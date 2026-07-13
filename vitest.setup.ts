// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'

if (!process.env.ENCRYPTION_KEY) {
  process.env.ENCRYPTION_KEY = 'test-encryption-key-32-bytes-min'
}
