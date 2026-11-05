import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // In development the API runs separately on port 3000. Proxying /api through Vite
    // means the browser only ever talks to one origin, exactly like production,
    // so cookies behave the same in both environments.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
