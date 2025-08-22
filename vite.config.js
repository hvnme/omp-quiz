import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Позволяет серверу быть доступным через локальную сеть
    port: 5173, // Вы можете изменить порт, если нужно
  },
})
