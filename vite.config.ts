import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/journalist-material-client/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-mui': ['@mui/material', '@mui/icons-material'],
          'vendor-editor': [
            '@editorjs/editorjs',
            '@editorjs/header',
            '@editorjs/list',
            '@editorjs/checklist',
            '@editorjs/code',
            '@editorjs/delimiter',
            '@editorjs/image',
            '@editorjs/inline-code',
            '@editorjs/link',
            '@editorjs/marker',
            '@editorjs/quote',
            '@editorjs/table',
            '@editorjs/warning'
          ],
          'vendor-charts': ['recharts'],
          'vendor-core': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/auth', 'firebase/app']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
