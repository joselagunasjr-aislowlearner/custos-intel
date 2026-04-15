import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/custos-intel/',
  server: {
    port: 5173,
  },
});
