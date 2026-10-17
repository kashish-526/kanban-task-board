import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' so the build also works on GitHub Pages sub-paths
export default defineConfig({
  plugins: [react()],
  base: './',
})
