import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'chaturbate',
      filename: 'remoteEntry.js',
      exposes: {
        './ChaturbateApp': './src/ChaturbateApp.tsx',
        './ChaturbateStreamList': './src/components/StreamList.tsx',
        './ChaturbatePlayer': './src/components/HlsPlayer.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    })
  ],
  build: {
    target: 'esnext',
    minify: false
  },
  server: {
    host: true,
    port: 5174,
    proxy: {
      '/ctb': {
        target: 'https://chaturbate.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ctb/, '')
      },
    }
  }
})
