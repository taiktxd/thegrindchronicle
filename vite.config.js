import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // 👈 Đổi từ '/' thành './' để chạy được trên CẢ Vercel LẪN GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})