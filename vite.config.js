import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Set base path for GitHub Pages project site so assets work at
// https://<user>.github.io/Personal-Website/
// You can override the base via environment variable VITE_BASE.
// For a custom domain (example.com), set VITE_BASE="/".
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: process.env.VITE_BASE ?? (mode === 'production' ? '/Personal-Website/' : '/'),
}))
