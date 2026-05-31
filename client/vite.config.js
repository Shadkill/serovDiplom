import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.ttf'] // Это добавляется, если вдруг возникнут проблемы с импортом шрифтов
})
