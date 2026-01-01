
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
});
