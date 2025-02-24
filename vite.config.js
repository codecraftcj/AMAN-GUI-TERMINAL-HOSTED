import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',  // Allow access from any network interface
    port: 80,         // Run on port 80
    strictPort: true, // Ensures it runs on port 80
    cors: true,       // Allow Cross-Origin requests
    allowedHosts: true,  // Allow all hosts to access
  }
})
