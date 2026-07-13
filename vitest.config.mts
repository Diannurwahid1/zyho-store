import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'node',
    hookTimeout: 60000,
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 60000,
    include: ['tests/int/**/*.int.spec.ts'],
  },
})
