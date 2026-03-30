import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/noMigrationCost/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": "/src" },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
