import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Rolldown loads the CJS icon files with Node-style default interop, so every icon
      // becomes `{ default: Component }` and React throws error #130 in production.
      { find: /^@mui\/icons-material\/(?!esm\/)(.+)$/, replacement: "@mui/icons-material/esm/$1" },
    ],
  },
  build: {
    // three.js (~830 kB) is only ever loaded lazily with the first 3D scene, never in the initial bundle.
    chunkSizeWarningLimit: 900,
  },
})
