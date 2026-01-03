
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // @ts-ignore
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env': {
        ...env,
        API_KEY: env.API_KEY || (process.env.API_KEY || '')
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8080,
      strictPort: true,
      hmr: {
        clientPort: 443
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    }
  };
});
