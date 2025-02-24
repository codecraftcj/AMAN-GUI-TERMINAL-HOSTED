import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: '0.0.0.0',  // Allow LAN access
    port: 80,         // Use default HTTP port
    strictPort: true, // Ensures it runs on port 80
  }
})

