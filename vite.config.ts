import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves project sites from /<repo>/; the deploy workflow sets VITE_BASE.
  base: process.env.VITE_BASE ?? "/",
  plugins: [react()],
  build: {
    // three.js (~830 kB) is only ever loaded lazily with the first 3D scene, never in the initial bundle.
    chunkSizeWarningLimit: 900,
  },
})
