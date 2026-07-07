import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',           // Phải là '/' khi deploy Vercel
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})