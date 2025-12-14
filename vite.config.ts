import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Polyfill process.env for the Google GenAI SDK and your existing code
      'process.env': env
    },
    server: {
      host: true, // Listen on all addresses
      port: 8080,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    }
  };
});