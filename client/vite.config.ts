import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    strictPort: true, // Force the specified port
  },
  optimizeDeps: {
    include: ['lucide-react'], // Include lucide-react in the dependency optimization
  },
});