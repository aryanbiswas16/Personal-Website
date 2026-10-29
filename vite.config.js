import { createHash } from 'node:crypto'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The page's only other origins: OpenFreeMap tiles for the Motive map, and Mapbox when a token is set.
const MAP_HOSTS = 'https://tiles.openfreemap.org https://api.mapbox.com https://*.tiles.mapbox.com https://events.mapbox.com'

/**
 * Adds a Content-Security-Policy to the built page. GitHub Pages can't send security headers, so it
 * goes in a <meta> tag. Inline scripts are allowed by hash (computed here, so they can't go stale);
 * JSON-LD blocks are data, not script, and need no hash. Build-only: the dev server injects its own
 * inline scripts.
 */
function contentSecurityPolicy() {
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const hashes = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g)].map(
          ([, body]) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`,
        )
        const policy = [
          "default-src 'self'",
          `script-src 'self' ${hashes.join(' ')}`,
          // React and the map libraries set inline styles.
          "style-src 'self' 'unsafe-inline'",
          `img-src 'self' data: blob: ${MAP_HOSTS}`,
          "font-src 'self' data:",
          "media-src 'self'",
          `connect-src 'self' ${MAP_HOSTS}`,
          "worker-src 'self' blob:",
          "child-src 'self' blob:",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'none'",
          'upgrade-insecure-requests',
        ].join('; ')
        return html.replace(
          /<meta charset="UTF-8" \/>/,
          (m) => `${m}\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`,
        )
      },
    },
  }
}

// https://vite.dev/config/
// Set base path for GitHub Pages project site so assets work at
// https://<user>.github.io/Personal-Website/
// You can override the base via environment variable VITE_BASE.
// For a custom domain (example.com), set VITE_BASE="/".
export default defineConfig(({ mode }) => ({
  plugins: [react(), contentSecurityPolicy()],
  base: process.env.VITE_BASE ?? (mode === 'production' ? '/Personal-Website/' : '/'),
}))
