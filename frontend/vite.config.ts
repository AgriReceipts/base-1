import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // String shorthand for proxying requests with a specific prefix
      '/api': {
        target: 'http://localhost:3000', // Your Express backend URL
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false, // Can be false if your backend is not running on HTTPS
        // This removes the domain from the cookie, forcing the browser to
        // associate it with the origin of the request (your Vite app).
        cookieDomainRewrite: '',
      },
    },
  },
});
