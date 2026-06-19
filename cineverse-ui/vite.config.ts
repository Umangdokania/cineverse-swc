import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/movies': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/theatres': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/bookings': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
});
