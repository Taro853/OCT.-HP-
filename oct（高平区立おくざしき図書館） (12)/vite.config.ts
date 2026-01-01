
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env vars instead of just those with `VITE_`.
  // Use (process as any).cwd() to resolve the TypeScript error where 'cwd' is not recognized on the global 'process' object.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Map process.env variables so they are available in the browser context
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.FIREBASE_API_KEY': JSON.stringify(env.FIREBASE_API_KEY),
    },
    resolve: {
      alias: {
        // Ensuring modules resolve correctly regardless of project path
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom', 'lucide-react', 'firebase/app', 'firebase/firestore'],
            'genai': ['@google/genai']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['@google/genai', 'lucide-react', 'firebase/app', 'firebase/firestore']
    }
  };
});
