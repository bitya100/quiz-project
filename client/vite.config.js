import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // המספר הענק הזה מכריח את Vite לקודד את קבצי השמע לטקסט!
    assetsInlineLimit: 100000000, 
  }
})